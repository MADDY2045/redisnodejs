const express = require('express');
const axios = require('axios');
const redis = require('redis');
const { pool } = require('./dbConfig');
const cors = require('cors');
const port = 6070;
const redis_port = 6379;
const { v4: uuidv4 } = require('uuid');



const app = express();

app.use(express.json());
app.use(cors());
var exec = require('child_process').execFile;

    const client = redis.createClient(redis_port);
        exec('D:\\redis\\redis\\redis-server.exe',(err,output)=>{
            if(err){
                console.log(`error in starting redis : ${err}`)
            }else{
                console.log('output',output);
            }
        })

        client.on('ready',function() {
            console.log(`Redis is ready`);
           });

        client.on('error',function(err) {
            console.log(`Error in Redis ${err}`);
           });




// function setResponse(username,repos){
//     return `<h3>${username} has ${repos} repositories in git hub</h3>`
// }

// function getRepos(req,res,next){
//     try{
//         console.log('fetching data ..........');
//         axios.get(`https://api.github.com/users/${req.params.username}`).then(response=>{
//             //console.log(response.data);

//             const repos = response.data.public_repos;

//             //set data to Redis
//             client.setex(req.params.username,3600,repos);
//             res.send(setResponse(req.params.username,repos));
//         }).catch(err=>console.log(`axios fetching data error ${err}`))
//     }
//     catch(err){res.send(500)}
// }

// //cache the response
// function cache(req,res,next){
//     const { username } = req.params;
//     client.get(username,(err,data)=>{
//         if(err){
//             console.log(`error in caching get data ${err}`)
//         }else if(data !== null){
//             res.send(setResponse(username, data))
//         }else{
//             next();
//         }
//     })
// }

// app.get('/repos/:username',cache,getRepos);

// app.get('/redis/flushall',(req,res)=>{
//     client.flushall((err,reply)=>{
//         if(err){
//             console.log(`error in flushing ${err}`)
//         }else{
//             console.log(reply);
//             res.send(reply);
//         }
//     })
// })

app.post("/createevent",async(req,res)=>{
    //console.log(req.body);
    let recipientemail=null;
    let bcc=null;
    let emailsubjecttemplate=null;
    let emailbodytemplate=null;
    let recipientmobile=null;
    let smstemplate=null;
    let enablepush = false;
    let enablesms = false;
    let enablewhatsapp = false;
    let enableemail = false;
    let enabledesktop=false;

    const { name,description,activebox,flowtype,notificationtitle,conditionkey,conditionvalue,resource,action }=req.body.data;
    let channel = req.body.data.channel;
    let recipients = req.body.data.recipients;
    let templatebody = req.body.data.templatebody;
    let conditionjade = req.body.condiditonjadearray;

    channel.map(eachchannel=>{
        if(eachchannel==='whatsapp'){
            enablewhatsapp=true;
        }
        if(eachchannel==='sms'){
            enablesms=true;
        }
        if(eachchannel==='email'){
            enableemail=true;
        }
        if(eachchannel==='push'){
            enablepush=true;
        }
        if(eachchannel==='desktop'){
            enabledesktop=true;
        }
    })

    //email
    if (enableemail === true){
        if(recipients.length > 0){
            recipientemail = recipients[0];
        }
        if(recipients.length>1){
            bcc = recipients[1];
        }
        if(templatebody.length > 0){
            emailsubjecttemplate = templatebody[0];
        }
        if(templatebody.length > 1){
            emailbodytemplate = "hardcoded for now";
        }
    }

    //sms
    if(enablesms === true){
        if(recipients.length >2 ){
            recipientmobile = recipients[2];
            smstemplate = "hardcoded sms template for now"
        }
    }
    let eventid = uuidv4().substring(1,6);
    // let eventid = 1;
    let created = new Date;
    let createdby = 'Madhavan';
    let roleid = '1';
    let userid = '19';
    let eventname = 'Quotation Approved';
    let customerid = '26';
    let pushtemplate = "hardcoded pushtemplate for now";
    // console.log(`name:${name},description:${description},activebox:${activebox},flowtype:${flowtype},notificationtitle:${notificationtitle},conditionkey:${conditionkey},conditionvalue:${conditionvalue},resource:${resource},action:${action},recipientemail:${recipientemail},bcc:${bcc},emailsubjecttemplate:${emailsubjecttemplate},emailbodytemplate:${emailbodytemplate},recipientmobile:${recipientmobile},smstemplate:${smstemplate},enablepush:${enablepush},enablesms:${enablesms},enablewhatsapp:${enablewhatsapp},enableemail:${enableemail},eventid:${eventid},created:${created},createdby:${createdby},roleid:${roleid},userid:${userid},eventname:${eventname},customerid:${customerid}`);

    await pool.query(`INSERT INTO events (eventid,enablepush,enablesms,enabledesktop,enablewhatsapp,enableemail,
        pushtitle,pushtemplate,condition,created,createdby,isactive,resourcename,actionverb,roleid,userid,
        smstemplate,emailsubjecttemplate,emailbodytemplate,recipientmobile,recipientemail,bcc,eventname,customerid)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24) RETURNING eventid,customerid`,
        [eventid,enablepush,enablesms,enabledesktop,enablewhatsapp,enableemail,
            notificationtitle,pushtemplate,conditionvalue,created,createdby,activebox,resource,action,roleid,userid,
            smstemplate,emailsubjecttemplate,emailbodytemplate,recipientmobile,recipientemail,bcc,eventname,customerid],(err,results)=>{
                if(err){
                    console.log(`error while inserting data into events:${err}`)
                }else{
                    console.log('results',results.rows);
                    res.send("received");
                    invokeredisevent();
                    }
                })
            })

    async function invokeredisevent(req,res,next){
        await client.flushall(async(err,reply)=>{
            if(err){
                console.log(`error in flushing ${err}`)
            }else{
                console.log(`Is Flushed ? :${reply}`);
                await pool.query(`SELECT * from events`,(err,output)=>{
                    if(err){
                        console.log(`error in fetching events data from query :${err}`)
                    }
                    else{
                        console.log(output.rows.length);
                        client.hmset('test',
                                {'demo2': 'example3',
                                'demo3': 'example4',
                                'demo4': 'example5'
                            });
                            getAllRedisCacheData();
                    }
                })
            }
        })

    }

    function getAllRedisCacheData(req,res,next){
        console.log(`reached here`);
        client.hgetall('test', function(err, object) {
            console.log(object);
        });
    }

app.listen(port, ()=>console.log(`app is listening on ${port}`));