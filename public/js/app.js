"use strict"

/*initialize REDOM*/
const {
    el,
    mount,
    unmount,
    setChildren
} = redom;

const app = {
  name:'',
  restURL:'http://localhost:8152'
};





/*
START : service worker
*/
window.addEventListener('load', e => {

	//new LGLOPTV_app();
	registerSW();
});


async function registerSW() {
	if ('serviceWorker' in navigator) {
		try {
			await navigator.serviceWorker.register('./service_worker.js');
			alert('install')
		} catch (e) {
			alert('ServiceWorker registration failed. Sorry about that.');
		}
	} else {
		document.querySelector('.alert').removeAttribute('hidden');
	}
}


var deferredPrompt;

window.addEventListener('beforeinstallprompt', function (e) {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  //e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  showAddToHomeScreen();

});

function showAddToHomeScreen(){
	//alert('install app ?');
}

/*
END : service worker
*/

/*
START : MATERIALIZE INITIALIZATIONS
*/

//navbar dropdown
$(".dropdown-trigger").dropdown({ hover: true });

//navbar mobile
$('.sidenav').sidenav();

//tabs
$('.tabs').tabs({
	swipeable:true
});

//feature discovery
$('.tap-target').tapTarget();

//init modal
$('.modal').modal();

//init form select
$('select').formSelect();


/*
END : MATERIALIZE INITIALIZATIONS
*/

/*
START RICH-TEXT-EDITOR
*/
//var options = {
//  debug: 'info',
//  placeholder: 'Write your notes here ...',
//  readOnly: false,
//  theme: 'snow'
//};
//var editor = new Quill('#richTextEditor', options);
// tinymce.init({
    //selector: '#richTextEditor'
  //});

 class SermonNotes{

  constructor(elemID){

    this.tinymce = tinymce;
    this.elemID = elemID;
    this.init();

  }

  init(){
    this.tinymce.init({
    selector: `#${this.elemID}`
  });
  }

  getContent(){

    let notes = this.tinymce.get(this.elemID).getContent();
    return notes;

  }

  uploadNotes(){

    fetch(`${app.restURL}/notes/new`,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token:'5bd8d42aac478f135c923cee',
        email:'daggieblanqx@gmail.com',
        notes:this.getContent(),
        title:'Sermon Notes',
        person : 'daggie.blanqx@gmail.com',
        recipient : 'd.aggieblanqx@gmail.com'
      })
    })
    .then((response)=>{
      console.log(`response`);
      console.log(response);
    })
    .then((data)=>{

      console.log(data);

    })
    .catch((err)=>{
      console.log(`err : ${err}`)
    });
  };


 }

/*
START RICH-TEXT-EDITOR
*/


/*

*/


const getUrlParameter = (name)=>{
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};



class YouTubePlayer{

    constructor(){

        this.videoParams = document.getElementById('videoHolder');
        this.youtubeID = getUrlParameter('id');
        this.youtubeTitle = getUrlParameter('title');

       this.el = el('iframe.youtubeIframe',{src:`https://www.youtube.com/embed/${this.youtubeID}?&autoplay=1&frameborder=0&controls=1&enablejsapi=1&modestbranding
=1&rel=0`,allowfullscreen:""});
        
        mount(this.videoParams,this.el);


    }

}


class Card{

  constructor(){

    this.el = el('div.card',
      el('div.card-image.waves-effect.waves-block.waves-light' ,
         el('img.activator',{src:'img/banner.gif'})
         ),
      el('div.card-content',
         el('span.card-title.activator.grey-text.text-darken-4','Card Title',
            el('i.material-icons.right','more_vert')
            ),
         el('p',
            el('a',{href:'#'},'Pst.Joshua Mwesigwa',
               el('i.material-icons.left','record_voice_over'))
            )),
      el('div.card-reveal',
         el('span.card-title.grey-text.text-darken-4','Abba`s Child',
            el('i.material-icons.right','close')),
         el('p','Pst. Joshua Mwesigwa'),
         el('div',
            el('a.waves-effect.btn-flat.blue.white-text.modal-trigger',{"href":'#watchModal',"data-id":'WsABkWLJg_g'},'Watch Now'),
            el('br'),
            el('br'),
            el('a.waves-effect.btn-flat.blue.white-text',{"href":'#'},'READ Suggested Notes (3)'),
            el('a.waves-effect.btn-flat.blue.white-text.modal-trigger',{"href":'#donateModal'},'Give / Donate')
            ))
      );

    
  }
}