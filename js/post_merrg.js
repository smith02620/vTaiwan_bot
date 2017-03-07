var jsdom = require("jsdom")
var fs = require('fs');
 // , nu = require('nodeutil')
var http = require('https');
 var readjson='';
 var jsondata=[];
var querystring = require('querystring'); //--
var check=0;
var config = require('./configfacebook');
var postdisoptions = {//--
  host: 'talk.vtaiwan.tw',
  
  //port: 443,
  method: 'POST',
  path: config.discoursekey,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    //'Content-Length': postData.length
  }
};
function sub(data) {   
    var postData = querystring.stringify({topic_id:1249,raw:data,category:170});//--      
  return postData;
}

dispost();
function dispost(){
    
      
      fs.readFile('./filter.json', 'utf8', function(err,data){
          if (err){
              console.log(err);
          } 
          else {
              readjson=JSON.parse(data)
               disposte(readjson)
      }});  
}

 function disposte(data){
    // console.log(data[0].data)
  (function fetchData(i){
    if(i<data.length){

      
      var req = http.request(postdisoptions, function (res) {
      var result = '';
        res.on('data', function (chunk) {
          result += chunk;
        
        });
        res.on('end', function () {
          console.log("**第"+(i+1)+"篇**********************");
          console.log(data[data.length-i-1].data);
          
        });
        res.on('error', function (err) {
          console.log(err);
        })
      });
      req.write(sub(data[data.length-i-1].data));
      req.end();
      setTimeout(function(){ 
        fetchData(i+1);
      }, 500);
    }
    if(i==data.length){
      console.log("一共上傳"+data.length+"篇");
      console.log("上傳完成"); 
    }
    
  })(0);  
}