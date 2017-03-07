var http = require('https');
var querystring = require('querystring'); //--
var config = require('./configfacebook');
var fbinfo=[];

var postdisoptions = {//--
  host: 'talk.vtaiwan.tw',
  
  method: 'POST',
  path: config.discoursekey,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
};
var getdisoptions = {//--
  host: 'talk.vtaiwan.tw',
  path: '/t/facebook/1249/last.json',
};


// ---------------
callback = function(response) {
     
    disget(response)

}
function disget(response){ //抓取discourse 最後一篇時間
  var str = '';
    var jsonfile='';
    var info='';
    var sleep='';
    var lastpost ='';
    var lasttime = '';
    var timestamp = '';

    response.on('data', function(chunk) {
        str += chunk;
    });

    response.on('end', function() {

        jsonfile=JSON.parse(str)
        lastpost =jsonfile.post_stream.posts[jsonfile.post_stream.posts.length-1].cooked
        lasttime = lastpost.replace(/(\W(.*))+建立時間:<br>/,"").replace(/[+].*(\W(.*))+/,"");
        timestamp = new Date(lasttime).getTime()/1000;
        var  gtoption=getfaceboptions(timestamp+1);
        console.log("上一篇時間"+lasttime);
        http.request(gtoption, fbget).end();
    });
    
       
    
   
    
}
function fbget(response){ //抓取fb 新聞po文 使用discourse最後一筆時間
  var str = '';
    var jsonfile='';
    
    var sleep='';

    response.on('data', function(chunk) {
        str += chunk;
    });


    response.on('end', function() {
      
        jsonfile=JSON.parse(decode(str))

        var counter='';
        counter=0;
        for(var i = 0 ;i <jsonfile.data.length; i++)
        {
          if(jsonfile.data[(jsonfile.data.length-i)-1].message!=undefined && jsonfile.data[(jsonfile.data.length-i)-1].message.indexOf('【新聞快遞】')==0){
            
            fbinfo[counter]="新聞名稱:<br>"+jsonfile.data[(jsonfile.data.length-i)-1].name+"<br>";
            fbinfo[counter]+="新聞內文:<br>"+jsonfile.data[(jsonfile.data.length-i)-1].description+"<br>";
            fbinfo[counter]+="新聞圖片:<br>"+jsonfile.data[(jsonfile.data.length-i)-1].full_picture+"<br>";
            fbinfo[counter]+="新聞來源:<br>"+jsonfile.data[(jsonfile.data.length-i)-1].caption+"<br>";
            fbinfo[counter]+="新聞關鍵字:<br>"+jsonfile.data[(jsonfile.data.length-i)-1].message.replace(/#/,"")+"<br>";
            fbinfo[counter]+="新聞連結:<br>"+jsonfile.data[(jsonfile.data.length-i)-1].link+"<br>";
            fbinfo[counter]+="建立時間:<br>"+jsonfile.data[(jsonfile.data.length-i)-1].created_time+"<br>";
            
            counter++;
            
          }
        }       
        dispost(fbinfo)
                // console.log(fbinfo)
    });
   
    
}

function dispost(data){ //寫新聞到discourse
  (function fetchData(i){
    if(i<data.length){

      
      var req = http.request(postdisoptions, function (res) {
      var result = '';
        res.on('data', function (chunk) {
          result += chunk;
        
        });
        res.on('end', function () {
          console.log("**第"+(i+1)+"篇**********************");
          console.log(data[i]);
          
        });
        res.on('error', function (err) {
          console.log(err);
        })
      });
      req.write(sub(data[i]));
      req.end();
      setTimeout(function(){ 
        fetchData(i+1);
      }, 5000);
    }
    if(i==data.length){
      console.log("一共上傳"+data.length+"篇");
      console.log("上傳完成"); 
    }
    
  })(0);  
  
    
}
function decode(s) {
    return unescape(s.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1'));
}
function sub(data) {   
    var postData = querystring.stringify({topic_id:1249,raw:data,category:170});//--      
  return postData;
}
function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

function getfaceboptions(timestamp){
  var timepath =config.fbkey+'&since='+timestamp;
  var getfboptions = {
    host: 'graph.facebook.com',
    path: timepath,
};
return getfboptions;
}


http.request(getdisoptions, callback).end();