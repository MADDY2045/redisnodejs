var cluster    = require('cluster');
const express = require('express');
const app = express();
var nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const cors = require('cors');

var httpPort   = process.env.PORT || 6070;
app.use(cors());

var children   = {};
var emails     = [];

const oauth2Client = new OAuth2(
    "485008776010-gqcbhhonfdefituo7pr206sqpmdl4ql6.apps.googleusercontent.com",
    "tLyJNAGybUV33JZvlpaLMSU2",
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: "1//04v_p73yVXSMZCgYIARAAGAQSNwF-L9Ir0KBmspuZRcxLIDHTrnqKTbK8o6HC1oo-rrSLlhjDtOnnK5Ys_PoqhnCx2doCRcITzsY"
});
const accessToken = oauth2Client.getAccessToken()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
         type: "OAuth2",
         user: "madhavaneee08@gmail.com",
         clientId: "485008776010-gqcbhhonfdefituo7pr206sqpmdl4ql6.apps.googleusercontent.com",
         clientSecret: "tLyJNAGybUV33JZvlpaLMSU2",
         refreshToken: "1//04v_p73yVXSMZCgYIARAAGAQSNwF-L9Ir0KBmspuZRcxLIDHTrnqKTbK8o6HC1oo-rrSLlhjDtOnnK5Ys_PoqhnCx2doCRcITzsY",
         accessToken: accessToken
    },
    tls: {
        rejectUnauthorized: false
      }
});


if(cluster.isMaster){

    function masterLoop(){
      checkOnWebServer();
      checkOnEmailWorker();
    };

    function checkOnWebServer(){
      if(children.server === undefined){
        children.server = cluster.fork({ROLE: 'server'});
        children.server.name = 'web server';
        children.server.on('exit',()=>{
            return delete children.server;
        });
        children.server.on('message',(response)=>children.worker.send(response));
      }
    };

    function checkOnEmailWorker(){
      if(children.worker === undefined){
        children.worker = cluster.fork({ROLE: 'worker'});
        children.worker.name = 'email worker';
        children.worker.on('exit',()=>{
                delete children.worker;
        });
        children.worker.on('message',(message)=>console.log(message.msg));
        }
    };
    setInterval(masterLoop, 1000);
}else{
  if(process.env.ROLE === 'server'){
      app.listen(httpPort,()=>console.log(`app is listening on ${httpPort}`))
      app.post("/:to/:subject/:message",(req,res)=>{
          const { to,subject,message } = req.params;
          var email    = {
            to: decodeURI(to),
            subject: decodeURI(subject),
            text: decodeURI(message),
          };
          var response = {email: email};
          res.send(response)
          process.send(email);
        })
   }
  if(process.env.ROLE === 'worker'){
    process.on('message',(message)=>{
        emails.push(message);
      });

     function workerLoop(){
        if(emails.length === 0){
          setTimeout(workerLoop, 1000);
        }else{
        var e = emails.shift();
         process.send({msg:`trying to send an email to ${e.to}`});
          sendEmail(e.to, e.subject, e.text, function(error){
            if(error){
              emails.push(e); // try again
              process.send({msg: 'failed sending email, trying again :('});
            }else{
              process.send({msg: 'email sent!'});
            }
            setTimeout(workerLoop, 1000);
          });
        }
      };

      workerLoop();
   }
}

async function sendEmail(to, subject, text, callback){
    var email = {
      from:  "madhavaneee08@gmail.com",
      to:to,
      subject:subject,
      text:text,
    };

    await transporter.sendMail(email,(error, info)=>{
      callback(error, email);
    });
  };