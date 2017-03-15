var http = require('https');
var querystring = require('querystring'); //--
var config = require('../configfacebook');
var fbinfo = [];
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
  path: '/t/around-the-globe/1258/last.json',
};

//************主程式開始***********************
callback = function (response) {
  disget(response)
}

//***********抓取discourse 最後一篇時間***********
function disget(response) { 
  var str = '';
  var jsonfile = '';
  var lastpost = '';
  var lasttime = '';
  var timestamp = '';
  response.on('data', function (chunk) {
    str += chunk;
  });
  response.on('end', function () {
    jsonfile = JSON.parse(str)
    lastpost = jsonfile.post_stream.posts[jsonfile.post_stream.posts.length - 1].cooked
    lasttime = lastpost.indexOf("發佈日期");
    lasttime = lastpost.substr(lasttime,27).replace(/發佈日期:/g,"").replace(/[+].*/,"")
    timestamp = new Date(lasttime).getTime() / 1000;
    var gtoption = getfaceboptions(timestamp + 1);
    // console.log(timestamp);
    http.request(gtoption, fbget).end();
  });
}

//*****************抓取fb 新聞po文 使用discourse最後一筆時間*************
function fbget(response) { 
  var str = '';
  var jsonfile = '';
  response.on('data', function (chunk) {
    str += chunk;
  });
  response.on('end', function () {
    jsonfile = JSON.parse(decode(str))
    var counter = '';
    counter = 0;
    for (var i = 0; i < jsonfile.data.length; i++) {
      if (jsonfile.data[(jsonfile.data.length - i) - 1].message != undefined && jsonfile.data[(jsonfile.data.length - i) - 1].message.indexOf('【新聞快遞】') == 0) {
        fbinfo[counter] = "title:<br>" + jsonfile.data[(jsonfile.data.length - i) - 1].name + "<br>";
        fbinfo[counter] += "table:<br>" + jsonfile.data[(jsonfile.data.length - i) - 1].description + "<br>";
        fbinfo[counter] += "新聞圖片:<br>" + jsonfile.data[(jsonfile.data.length - i) - 1].full_picture + "<br>";
        fbinfo[counter] += "發佈日期:<br>" + jsonfile.data[(jsonfile.data.length - i) - 1].created_time + "<br>";
        fbinfo[counter] += "content:<br>" + jsonfile.data[(jsonfile.data.length - i) - 1].caption + "<br>";
        counter++;
      }
    }
    // dispost(fbinfo)
  });
}
//*****************寫新聞到discourse*************
function dispost(data) { 
  (function fetchData(i) {
    if (i < data.length) {
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
      setTimeout(function () {
        fetchData(i + 1);
      }, 5000);
    }
    if (i == data.length) {
      console.log("一共上傳" + data.length + "篇");
      console.log("上傳完成");
    }
  })(0);
}
//*****************unicode轉換*************
function decode(s) {
  return unescape(s.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1'));
}
//*****************discourse post 設定*************
function sub(data) {
  var postData = querystring.stringify({ topic_id: 1258, raw: data, category: 170 });//--      
  return postData;
}
//*****************Facebook get 設定*************
function getfaceboptions(timestamp) {
  var timepath = config.fbkey + '&since=' + timestamp;
  var getfboptions = {
    host: 'graph.facebook.com',
    path: timepath,
  };
  return getfboptions;
}

  http.request(getdisoptions, callback).end();
