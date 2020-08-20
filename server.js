const express = require('express');
const app = express();
const cors = require('cors');
var nodemailer = require('nodemailer');

var port =  6070;
app.use(cors());
app.use(express.json());

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'madhavaneee08@gmail.com',
      pass: 'Prithik007'
    },
    tls: {
        rejectUnauthorized: false
    }
});

app.get('/',(req,res)=>{
    res.send("email nodemailer");
    transporter.sendMail({
        from:'madhavaneee08@gmail.com',
        to:'madhavan@growsmartsmb.com',
        subject:"another one subject",
        text: "Another test",
      }, (err,result)=>{
          if(err){
              console.log(`error in sending mail ${err}`)
          }else{
              console.log(result);
          }
      })
})

app.listen(port,()=>console.log(`app is listening on port ${port}`));