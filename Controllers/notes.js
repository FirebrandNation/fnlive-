"use strict"

const NotesModel = require('../Models/notes.js');

const {Mail} = require('../Components/mail.js');

class Notes{
	
	constructor(data){
		var {
			ownerEmail,ownerID,content,title,otherRecipient
		}  = data;
		
		//console.log(ownerEmail,ownerID,content,title,otherRecipient)
		

		this.owner = ownerID;
		this.content = content;
		this.title = title;
		this.isSent = true;
		this.expectedRecipients = new Array();
		this.expectedRecipients.push(ownerEmail);
		this.expectedRecipients.push(otherRecipient);

	}

	saveNotes(){

		//console.log(this);

		return new Promise((resolve,reject)=>{

			NotesModel.create(this, (err, docs) => {
				if (err) {
					console.log('err');
					reject(err);
				} else {
					console.log(docs);
					resolve(docs);
				};
			});

		});

	}

	mailNotes(){
		return new Promise((resolve,reject)=>{
			
			let notesMail = new Mail(this.expectedRecipients[0],this.title,this.content);

			notesMail.dispatchNow()
			.then((response)=>{
				console.log(response);
			})
			.catch((err)=>{
				console.log(err);
			})

		});
	}
}


module.exports = {
	Notes
}