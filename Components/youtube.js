"use strict"
const request = require('request'); //http

class getYoutube {
	constructor(){
		this.key = process.env.YouTubeAPIKEY;
    	this.playlist = `PLmEZNHS4jYDmNPPinNmlaxAShqWhyCPOu`;
		this.options = {
			url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${this.playlist}&key=${this.key}`,
			method: 'GET',
      		headers: {
        		'Accept': 'application/json',
        		'Content-Type': 'application/json'
      		}
    	};

	}

    exec(){
    	return new Promise((resolve,reject)=>{
    		request(this.options,(error, response, body)=>{
    			if (!error && response.statusCode == 200) {
			       //query is good
             console.log('success')
			       resolve(compile(response.body));
			   } else {
      				//query didnt succeed
      				//return error
      				console.log('error');
              console.log(error);
      				reject(error)
      			}
      		});
    	})
    }
}


class customDate {
    constructor(date) {
        this.date = date;

        if (Object.prototype.toString.call(this.date) === "[object Date]") {
            return true;
        } else {
            this.date = new Date(this.date)
        };

        this.dayNames = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
        this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        this.dayOfMonth = this.date.getDate();
        this.dayOfWeekIndex = this.date.getDay();
        this.monthIndex = this.date.getMonth();
        this.year = this.date.getFullYear();
    }

    view() {
        return `${this.dayNames[this.dayOfWeekIndex]}-${this.monthNames[this.monthIndex]}-${this.dayOfMonth}-${this.year}`;

    }

}


var extractVideo_Title_Author = (video)=>{

    video = video;
    let [title, author] = video.split("|").map(s => s.trim());

    return {
        title:title,
        author:author
    }
}


function compile(data){

	data = JSON.parse(data);
	let allVideos = data.items;
	let videoData = new Array();


    allVideos.map((video, index) => {
    	let thumbnails = ()=>{
	    	if (video.snippet.thumbnails && video.snippet.thumbnails.high) {
	    		return `${video.snippet.thumbnails.high.url}`;
	    	}else if (video.snippet.thumbnails && video.snippet.thumbnails.medium) {
	    		return `${video.snippet.thumbnails.medium.url}`;
	    	}else if (video.snippet.thumbnails && video.snippet.thumbnails.default) {
	    		return `${video.snippet.thumbnails.default.url}`
	    	}else if (video.snippet.thumbnails && video.snippet.thumbnails.standard) {
	    		return `${video.snippet.thumbnails.standard.url}`;
	    	}else{
	    		return 'https://myelearning.firebrandnation.com/wp-content/uploads/2018/03/WhatsApp-Image-2018-03-21-at-18.32.54.jpeg';
	    	}
	    };

        videoData.push({
            videoTitle: extractVideo_Title_Author(video.snippet.title).title,
            videoThumbnail: thumbnails(),
            videoTime: new customDate(video.snippet.publishedAt).view(),
            videoURL: `/single?id=${video.snippet.resourceId.videoId}&index=${index}`,
            videoAuthor: extractVideo_Title_Author(video.snippet.title).author || 'FirebrandNation',
            videoViews: '4,200',
            index: index
        })
    })

    //console.log(videoData);
    return videoData;
}
/*
function isLive(){

	let options = {
		key = 'AIzaSyAUhMd0g4HiADs424FebITW6SuBQ37uBCk';
    	playlist = `PLmEZNHS4jYDmNPPinNmlaxAShqWhyCPOu`;
		options = {
			url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${this.playlist}&key=${this.key}`,
			method: 'GET',
      		headers: {
        		'Accept': 'application/json',
        		'Content-Type': 'application/json'
      		}
    	};

	request(options,(error, response, body)=>{
    			if (!error && response.statusCode == 200) {
			       //query is good
			       resolve(compile(response.body));
			   } else {
      				//query didnt succeed
      				//return error
      				console.log('error');
      				reject(error)
      			}
      		});

}

*/


module.exports = getYoutube;