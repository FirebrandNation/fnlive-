"use strict"

//require node modules
var mongoose = require('mongoose');

//create a schema for this model
var NotesSchema = new mongoose.Schema({
	owner:{type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	title:{type:String,trim:true,index:false,required:false},
	content:{type:String,trim:true,index:false,required:true},
	isSent:{type:Boolean,default:false},
	expectedRecipients:{type:String,trim:true,index:false,required:false},
	meta:[]
},{
	timestamps:{
		createdAt:'created_at',
		updatedAt:'updated_at'
	}
})


module.exports = mongoose.model('Notes',NotesSchema);
