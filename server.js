const express = require('express');
const axios = require('axios');
const redis = require('redis');

const port = 6070;
const redis_port = 6379;

const client = redis.createClient(redis_port);

const app = express();

function setResponse(username,repos){
    return `<h3>${username} has ${repos} repositories in git hub</h3>`
}

function getRepos(req,res,next){
    try{
        console.log('fetching data ..........');
        axios.get(`https://api.github.com/users/${req.params.username}`).then(response=>{
            //console.log(response.data);

            const repos = response.data.public_repos;

            //set data to Redis
            client.setex(req.params.username,3600,repos);
            res.send(setResponse(req.params.username,repos));
        }).catch(err=>console.log(`axios fetching data error ${err}`))
    }
    catch(err){res.send(500)}
}

//cache the response
function cache(req,res,next){
    const { username } = req.params;
    client.get(username,(err,data)=>{
        if(err){
            console.log(`error in caching get data ${err}`)
        }else if(data !== null){
            res.send(setResponse(username, data))
        }else{
            next();
        }
    })
}
app.get('/repos/:username',cache,getRepos);

app.get('/redis/flushall',(req,res)=>{
    client.flushall((err,reply)=>{
        if(err){
            console.log(`error in flushing ${err}`)
        }else{
            console.log(reply);
            res.send(reply);
        }
    })
})

app.listen(port, ()=>console.log(`app is listening on ${port}`));