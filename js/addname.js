var jsdom = require("jsdom")
var fs = require('fs');
 // , nu = require('nodeutil')
var http = require('https');
 var readjson='';
 var jsondata=[];
var querystring = require('querystring'); //--
var check=0;
dispost();
function dispost(){
    
      
      fs.readFile('./final.json', 'utf8', function(err,data){
          if (err){
              console.log(err);
          } 
          else {
              readjson=JSON.parse(data)

              for(var i=0;i<readjson.length;i++){
                  readjson[i]["name"] = 0;
                  var test=[];
                  test=readjson[i].data.replace(/新聞名稱:<br>/,"");
                  test=test.replace(/<br>(\W(.*))+/,"")
                  readjson[i]["name"]=test;    
              }
              post(readjson)  
      }});  
}
function post(data1){
  
  console.log(data1)
        
  var jsonText = JSON.stringify(data1, null, '   ');
         fs.writeFile('./addname.json',jsonText,function(err){
              if(err) {
                console.log(err);
              }

          })
}