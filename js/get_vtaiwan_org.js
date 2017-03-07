
var jsdom = require("jsdom")
var fs = require('fs');
 // , nu = require('nodeutil')
 var config = require('./configfacebook');
var http = require('https');
 var readjson='';
 var jsondata=[];
var querystring = require('querystring'); //--
var check=0;
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
    var postData = querystring.stringify({topic_id:1250,raw:data,category:170});//--      
  return postData;
}


     
    var page=1;
    console.log(page)
    jsdom.env(
    "http://www.vtaiwan.org.tw/ajax/infoWall.aspx?&pg="+page,
    ["http://code.jquery.com/jquery.js"],
    /**
     * 這邊是想要透過jQuery取出頁面上所有鏈結的位置
     */
    
    function (errors, window) {
      var $ = window.$;
      var news=[];
      var date=[];
      var name=[];
      var len=""; 
      $(".lt9I").each(function(i, a){
          len=i;
      })
      $(".title").each(function(i, a){
          news[len-i]="新聞名稱:<br>"+$(this).text()+"<br>";
          name[len-i]=$(this).text();
      })

      $(".note").each(function(i, a){  
          news[len-i]+="新聞內文:<br>"+$(this).text()+"<br>";
      })
      $("img").each(function(i, a){  
          news[len-i]+="新聞圖片:<br>"+a.src+"<br>";
      })
      $(".source").each(function(i, a){  
          news[len-i]+="新聞來源:<br>"+$(this).find("a").text()+"<br>";
      })
      $(".source").each(function(i, a){  
          news[len-i]+="新聞關鍵字:<br>"+$(this).find("b").text()+"<br>";
      })
      $(".source").find("a").each(function(i, a){  
          news[len-i]+="新聞連結:<br>"+a.href.replace(/.*(http)/,"http").replace(/'.*/,"")+"<br>";
          

      })
      $(".source").find("p").each(function(i, a){ 
        
          if($(this).text().split(/建立日期：/)[1]!=undefined){
            var s=Math.floor(i/3);
          news[len-s]+="新聞時間:<br>"+$(this).text().split(/建立日期：/)[1]+"<br>";
          date[len-s]=$(this).text().split(/建立日期：/)[1];        
          }
      })
    //   console.log(name)
    //   dispost(news,date)
    }
  );                



  // jsdom.env(
  //   "http://www.vtaiwan.org.tw/ajax/infoWall.aspx?&pg=34",
  //   ["http://code.jquery.com/jquery.js"],
  //   /**
  //    * 這邊是想要透過jQuery取出頁面上所有鏈結的位置
  //    */
    
  //   function (errors, window) {
  //     var $ = window.$;
  //     var news=[];
  //     var date=[];
  //     var len=""; 
  //     $(".lt9I").each(function(i, a){
  //         len=i;
  //     })
  //     $(".title").each(function(i, a){
  //         news[len-i]="新聞名稱:<br>"+$(this).text()+"<br>";
  //     })

  //     $(".note").each(function(i, a){  
  //         news[len-i]+="新聞內文:<br>"+$(this).text()+"<br>";
  //     })
  //     $("img").each(function(i, a){  
  //         news[len-i]+="新聞圖片:<br>"+a.src+"<br>";
  //     })
  //     $(".source").each(function(i, a){  
  //         news[len-i]+="新聞來源:<br>"+$(this).find("a").text()+"<br>";
  //     })
  //     $(".source").each(function(i, a){  
  //         news[len-i]+="新聞關鍵字:<br>"+$(this).find("b").text()+"<br>";
  //     })
  //     $(".source").find("a").each(function(i, a){  
  //         news[len-i]+="新聞連結:<br>"+a.href.replace(/.*(http)/,"http").replace(/'.*/,"")+"<br>";
          

  //     })
  //     $(".source").find("p").each(function(i, a){ 
        
  //         if($(this).text().split(/建立日期：/)[1]!=undefined){
  //           var s=Math.floor(i/3);
  //         news[len-s]+="新聞時間:<br>"+$(this).text().split(/建立日期：/)[1]+"<br>";
  //         date[len-s]=$(this).text().split(/建立日期：/)[1];        
  //         }
  //     })
    
  //     dispost(news,date)
  //   }
  // );

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
              else{
                check++;
              }
          })
        
}

  
    

// function dispost(data){
//     // console.log(data[0])
//   (function fetchData(i){
//     if(i<data.length){

      
//       var req = http.request(postdisoptions, function (res) {
//       var result = '';
//         res.on('data', function (chunk) {
//           result += chunk;
        
//         });
//         res.on('end', function () {
//           console.log("**第"+(i+1)+"篇**********************");
//           console.log(data[i]);
          
//         });
//         res.on('error', function (err) {
//           console.log(err);
//         })
//       });
//       req.write(sub(data[i]));
//       req.end();
//       setTimeout(function(){ 
//         fetchData(i+1);
//       }, 500);
//     }
//     if(i==data.length){
//       console.log("一共上傳"+data.length+"篇");
//       console.log("上傳完成"); 
//     }
    
//   })(0);  
  
    
// }

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
