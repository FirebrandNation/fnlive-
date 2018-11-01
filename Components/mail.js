"use strict"
const nodemailer  = require('nodemailer');

const mailSignature = ()=>{
      return `
            <hr>
            <p style = "texcenter">
               Prayer Center.<br>
               <img src="https://www.christianworldmedia.com/screencap1224" width="50" alt="JIAM logo" />
            </p>
            `;
}

const draftMail_thankMSG = (name)=>{
  return `
      <p>
      Hello ${name} ,<br>
      Thank you for reaching out to us.<br/>
      We will get back to you shortly:<br/>
      <br/>
      Warm Regards.
      ${mailSignature()}
      `;
};


class Mail{

   constructor(recipient,subject,message){
      this.sender  = `${process.env.MAILER_NAME} ${process.env.MAILUN}`;
      this.recipient = recipient ;
      this.subject = subject ;
      this.message = message;
      this.mailOptions = {
         from: this.sender ,
         to: this.recipient ,
         subject: this.subject ,
         html: this.message
      };
      this.transporter = nodemailer.createTransport({
         pool: true ,
         host: process.env.MAILER_HOST ,
         port: 465 ,
         secure: true , // use SSL
         auth: {
            user: process.env.MAILUN ,
            pass: process.env.MAIL_DISPATCH_PASS
         },
         tls: {
            rejectUnauthorized:false
         }
      });

   }

   dispatchNow(){
      return new Promise((resolve,reject)=>{
         this.transporter.sendMail(this.mailOptions,(error, info)=>{
            if (error) {
               reject(error);
            }else{
               resolve(info);
            }
         });
      });



        /*************************************************************************

        var notesMail = new Mail('daggieblanqx@gmail.com','NOTES','Hello world');
        noteMail.dispatchNow()
        .then((response)=>{
            console.log(response);
        })
        .catch((err)=>{
            console.log(err);
        })

        ************************************************************************/
   }
}


module.exports = {
   Mail
};