var http = require('https');
var querystring = require('querystring'); //--
var config = require('./configfacebook');
var fs = require('fs');
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
     
    var  gtoption=getfaceboptions();

    http.request(gtoption, fbget).end();

}

        

    
       
function fbget(response){ //抓取fb 新聞po文 使用discourse最後一筆時間
  var str = '';
    var jsonfile='';
    
    var sleep='';
    var fbdate=[];
    response.on('data', function(chunk) {
        str += chunk;
    });


    response.on('end', function() {
      
        jsonfile=JSON.parse(decode(str))

        var counter='';
        counter=0;
        for(var i = 0 ;i <jsonfile.data.length; i++)
        {
          if(jsonfile.data[(jsonfile.data.length-i)-1].message!=undefined && jsonfile.data[(jsonfile.data.length-i)-1].message.indexOf('#')==0){
            
            fbinfo[counter]="新聞名稱:<br>"+jsonfile.data[(jsonfile.data.length-i)-1].name+"<br>";
            fbinfo[counter]+="新聞內文:<br>"+jsonfile.data[(jsonfile.data.length-i)-1].description+"<br>";
            fbinfo[counter]+="新聞圖片:<br>"+jsonfile.data[(jsonfile.data.length-i)-1].full_picture+"<br>";
            fbinfo[counter]+="新聞來源:<br>"+jsonfile.data[(jsonfile.data.length-i)-1].caption+"<br>";
            fbinfo[counter]+="新聞關鍵字:<br>"+jsonfile.data[(jsonfile.data.length-i)-1].message+"<br>";
            fbinfo[counter]+="新聞連結:<br>"+jsonfile.data[(jsonfile.data.length-i)-1].link+"<br>";
            fbinfo[counter]+="建立時間:<br>"+jsonfile.data[(jsonfile.data.length-i)-1].created_time+"<br>";
            fbdate[counter]=jsonfile.data[(jsonfile.data.length-i)-1].created_time;
            counter++;
            
          }
        }       
        dispost(fbinfo,fbdate)
        // console.log(fbdate);
        
                
    });
   
    
}




function dispost(data1,date){
    
      
      fs.readFile('./vtaiwan.json', 'utf8', function(err,data){
          if (err){
              console.log(err);
          } 
          else {
              readjson=JSON.parse(data)
              var i=0;
              var defulid=readjson[readjson.length-1].id;
              a(0,function(result){});
              function a(i,callback){
                  while(i<data1.length){
                  var contact = new Object();
                  contact.data=data1[i];
                  contact.id=defulid+i+1;
                  contact.time = date[i];
                  readjson.push(contact)
                  i++;
                }
                callback(i);
              }
              post(readjson)
      }});  
}
function post(data1){
  
  console.log(data1)
        
  var jsonText = JSON.stringify(data1, null, '   ');
         fs.writeFile('./vtaiwan.json',jsonText,function(err){
              if(err) {
                console.log(err);
              }

          })
        
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
  var timepath =config.fbkey+'&since='+1488504840;
  var getfboptions = {
    host: 'graph.facebook.com',
    path: timepath,
};
return getfboptions;
}


http.request(getdisoptions, callback).end();