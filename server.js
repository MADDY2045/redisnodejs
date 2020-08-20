const express = require('express');
const app = express();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const cors = require('cors');

app.use(cors());
app.use(express.json());
const port = 6070;

const oauth2Client = new OAuth2(
    "485008776010-gqcbhhonfdefituo7pr206sqpmdl4ql6.apps.googleusercontent.com",
    "tLyJNAGybUV33JZvlpaLMSU2",
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: "1//04v_p73yVXSMZCgYIARAAGAQSNwF-L9Ir0KBmspuZRcxLIDHTrnqKTbK8o6HC1oo-rrSLlhjDtOnnK5Ys_PoqhnCx2doCRcITzsY"
});
const accessToken = oauth2Client.getAccessToken()

const smtpTransport = nodemailer.createTransport({
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

const mailOptions = {
    from: "madhavaneee08@gmail.com",
    to: "madhavan@growsmartsmb.com",
    subject: "Node.js Email with Secure OAuth",
    generateTextFromHTML: true,
    html: "<b>test</b>"
};


app.get('/',(req,res)=>{
    smtpTransport.sendMail(mailOptions, (error, response) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
    });
    res.send("received");
})

app.listen(port,()=>console.log(`app is listening on port ${port}`));