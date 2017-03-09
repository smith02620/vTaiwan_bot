var config = require('../configfacebook.js');
var http = require('https');
var querystring = require('querystring'); //--
var news = [];
var table = [];
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


get(40);

         
 function get(number) {

  (function fetchData(i) {
    if (i < number ) {

      jsdom.env(
        "http://www.vtaiwan.org.tw/international_detail.aspx?no=83&d=" + (i),
        ["http://code.jquery.com/jquery.js"],
        /**
         * 這邊是想要透過jQuery取出頁面上所有鏈結的位置
         */
          
        function (errors, window) {
          console.log("抓取資料中...")
          console.log("http://www.vtaiwan.org.tw/international_detail.aspx?no=83&d=" + (i ))
          var $ = window.$;
          var check = 0;
          var name = [];
          var len = "";
          $(".title4").each(function (t, a) {
            news[i] = "title:<br>" + $(this).text() + "<br>";
          })
          news[i] += "table:<br>"
          $("th").each(function (t, a) {
            table[t] = $(this).text().replace(/(\s)+|,/g, "") + ":";
          })

          $("td").each(function (t, a) {
            table[t] += $(this).text() + "<br>";
          })

          news[i] += table;
          news[i]=news[i].replace(/,/g, "");
          $(".para1").each(function (t, a) {
            news[i] += "content:<br>" + $(this).text() + "<br>";
          })
          
          if(news[i].indexOf("undefined")>-1){
                 news[i]=undefined;           
            }
          fetchData(i + 1);
          if(i==(number-1)){
            console.log("資料寫入中...")
            disposte(news)
          }
        }
      );
    }
  })(0);
}




function disposte(data) {
  (function fetchData(i) {
    if (i < data.length) {
      if (data[i]!=undefined){
        console.log(data[i]);
        var req = http.request(postdisoptions, function (res) {
          var result = '';
          res.on('data', function (chunk) {
            result += chunk;

          });
          res.on('end', function () {
            console.log("**第" + (i + 1) + "篇**********************");
            console.log(data[i]);

          });
          res.on('error', function (err) {
            console.log(err);
          })
        });
          req.write(sub(data[i]));
          req.end();
      }
      setTimeout(function () {
        fetchData(i + 1);
      }, 1000);
    }
    if (i == data.length) {
      console.log("一共上傳" + data.length + "篇");
      console.log("上傳完成");
    }

  })(0);
}

function sub(data) {
  var postData = querystring.stringify({ topic_id: 1258, raw: data, category: 170 });//--      
  return postData;
}