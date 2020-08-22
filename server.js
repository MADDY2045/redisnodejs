var cluster    = require('cluster');
const express = require('express');
const app = express();
var nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const cors = require('cors');
const { Worker, Scheduler, Queue } = require("node-resque");

app.use(cors());
const port = 6070;

const connectionDetails = {
    pkg: "ioredis",
    host: "127.0.0.1",
    password: null,
    port: 6379,
    database: 0,
    // namespace: 'resque',
    // looping: true,
    // options: {password: 'abc'},
  };

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

let jobstocomplete;
var jobs = {
    sendemail:async (to,subject,message)=>{
        jobstocomplete--
        boot()
        to}
    }

    async function tryShutdown(){
        if(jobstocomplete===0){

        }
    }

async function boot(){
    if(jobstocomplete === 0){
            console.log('entered if part ::::');
    }else{
        console.log(`entered boot`);
        const worker = new Worker(
            { connection: connectionDetails, queues: ["math"] },
            jobs
          );
          await worker.connect();
          worker.start();

          worker.on("start", () => {
            console.log("worker started");
          });
          worker.on("end", () => {
            console.log("worker ended");
          });
          worker.on("cleaning_worker", (worker, pid) => {
            console.log(`cleaning old worker ${worker}`);
          });
          worker.on("poll", (queue) => {
            console.log(`worker polling ${queue}`);
          });
          worker.on("ping", (time) => {
            console.log(`worker check in @ ${time}`);
          });
          worker.on("job", (queue, job) => {
            console.log(`working job ${queue} ${JSON.stringify(job)}`);
          });
          worker.on("reEnqueue", (queue, job, plugin) => {
            console.log(`reEnqueue job (${plugin}) ${queue} ${JSON.stringify(job)}`);
          });
          worker.on("success", (queue, job, result, duration) => {
            console.log(
              `job success ${queue} ${JSON.stringify(job)} >> ${result} (${duration}ms)`
            );
          });
          worker.on("failure", (queue, job, failure, duration) => {
            console.log(
              `job failure ${queue} ${JSON.stringify(
                job
              )} >> ${failure} (${duration}ms)`
            );
          });
          worker.on("error", (error, queue, job) => {
            console.log(`error ${queue} ${JSON.stringify(job)}  >> ${error}`);
          });
          worker.on("pause", () => {
            console.log("worker paused");
          });
    }

}



app.post('/:to/:subject/:text',async(req,res)=>{
    const { to,subject,text }= req.params;
    console.log(`to:${to},subject:${subject},text:${text}`);
    const queue = new Queue({ connection: connectionDetails }, jobs);
    queue.on("error", function (error) {
        console.log(error);
    });
  await queue.connect();
  await queue.enqueue("math", "sendemail", [to,subject,text]);
  jobstocomplete=1;
    res.send("reached safely");
})

app.listen(port,()=>console.log(`app is listening on port ${port}`));

boot();

app.get('/stopworkerservice',async(req,res)=>{
    console.log('entered get stop');
    await queue.end()
    await worker.end()
    res.send("service stopped");

})