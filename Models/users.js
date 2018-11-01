"use strict"

//require node modules
var mongoose = require('mongoose');

//create a schema for this model
var UsersSchema = new mongoose.Schema({
	title:{type:String,trim:true,index:false,required:false},
	full_name:{type:String,trim:true, index: true, required: false},
	first_name:{type:String,trim:true, index: true, required: false},
	last_name:{type:String,trim:true, index: true, required: false},
	email:{ type: String, require: true, index:true, unique:true,sparse:true},
	phone:{type:String,trim:true, index: true, required: true},
	partner_id:{type:Number,trim:true,index:true,unique:true,sparse:true},
	postal_address:{type:String,trim:true, index: false, required: false},
	national_id:{type:String,trim:true, index: false, required: false},
	isActivated:{type:Boolean,default:false},
	password:{type:String},
	token:Number,
	jwt:{type:String,trim:true, index: true},
	meta:[]
},{
	timestamps:{
		createdAt:'created_at',
		updatedAt:'updated_at'
	}
})


UsersSchema.virtual('fullName').get(function () {
	var fullName = `${this.title} ${this.first_name} ${this.last_name}` || this.email
  return fullName; //`${this.title} ${this.first_name} ${this.last_name}`;
});
/*
USAGE:
console.log(User.fullName);
*/

/*

jwt - the api key token
meta - informatiion from app
token - verification code
isActivated -  is by default false if user registers but doesn`t verify or when an account is suspended/deactivated

*/
/*
UsersSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password, this.password);
}

UsersSchema.methods.verifyLogin = function(id,){

}
*/

module.exports = mongoose.model('Users',UsersSchema);
