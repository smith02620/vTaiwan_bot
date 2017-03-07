var jsdom = require("jsdom")
var fs = require('fs');
var http = require('https');
var readjson='';
var jsondata=[];
var querystring = require('querystring'); //--
var check=0;
dispost();
function dispost(){
    
      
      fs.readFile('./filter.json', 'utf8', function(err,data){
          if (err){
              console.log(err);
          } 
          else {
            readjson=JSON.parse(data)
            console.log(readjson.length)
            
            //  var Vehicles = readjson.sort(function (a, b) { //按照年排序
            //     return a.time < b.time ? 1 : -1;
            //     });
            //   console.log(Vehicles)
            //  post(Vehicles)
      }});  
}
function dedup(arr) { //比對陣列內是否有相同資料
	var hashTable = {};

	return arr.filter(function (el) {
		var key = JSON.stringify(el.name);
		var match = Boolean(hashTable[key]);

		return (match ? false : hashTable[key] = true);
	});
}


function post(data1){
  
  console.log(data1)
        
  var jsonText = JSON.stringify(data1, null, '   ');
         fs.writeFile('./filter.json',jsonText,function(err){
              if(err) {
                console.log(err);
              }

          })
        
}