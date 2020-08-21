const cpus = require('os').cpus();
const express = require('express');
const app = express();
const cluster = require('cluster');
const port = 6070;


if(cluster.isMaster){
    console.log(`this is a master process : ${process.pid}`);
    for (let i=0;i<cpus.length;i++){
        cluster.fork();
    }
}else{

    app.get('/',(req,res)=>{
        console.log(`worker pids are ${process.pid}`);
       res.send(`Process pid is:${process.pid}`)
    })
    app.listen(port,()=>console.log(`app is listening on port ${port}`));
}

//note : we can check the traffic based on loadtest npm by simulating an injection of multiple rquests using loadtest -n 500 http://localhost:6070