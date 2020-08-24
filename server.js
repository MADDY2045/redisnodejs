var async = require('async');

async.series([
  function(cb){
    setTimeout(() => {
      cb('null',null)
    }, 2000);
  },
  function(cb){
    setTimeout(() => {
      cb(null,9)
    }, 2000);
  }
],(err,results)=>{
  if(err){
    console.log(`error in parallel execution,${err}`);
  }
  console.log(results);
})