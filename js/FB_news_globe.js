var http = require('https');
var querystring = require('querystring'); //--
var config = require('./configfacebook');
var facebooknewstopic = 1249; //設定topic編號
var facebookglobetopic = 1258; //設定topic編號
var newserror = 1359;
var arounderror = 1398;


//**************主程式************************ */
main();

async function main() {
    /*************FACEBOOK NEWs[新聞快遞]爬蟲程式**********/
    var DiscourseNews = await GetData(GetDiscourseOptions('facebook', facebooknewstopic)); //抓取DiscourseNews最後一筆資料-函數設定GetDiscourseOptions(topicname,topicid)
    var DiscourseNewsError = await GetData(GetDiscourseOptions('news-error-report', newserror))
    var timestamp = await Timestamp(DiscourseNews, DiscourseNewsError); //最一筆po文時間轉為timestamp
    var FacebookOptions = await GetFacebookOptions(timestamp + 1); //使用discourse最後一筆時間抓取Facebook粉絲頁PO文設定
    var FacebookNews = await GetData(FacebookOptions); //抓取Facebook粉絲頁最新PO文[新聞快遞]
    var AnalyFacebookNews = await AnalysisFacebookNews(FacebookNews) //將抓取到的資料做分析處理
    var post = await PostData(AnalyFacebookNews, PostDiscourseOptions, facebooknewstopic) //寫回discourse news -函數設定(data,option,topicid)

    // //*************FACEBOOK [新聞觀測]爬蟲程式**********/
    var DiscourseGlobe = await GetData(GetDiscourseOptions('around-the-globe', facebookglobetopic)); //抓取DiscourseNews最後一筆資料-函數設定GetDiscourseOptions(topicid)
    var DiscourseGlobeError = await GetData(GetDiscourseOptions('around-the-globe-error-report', arounderror))
    var timestampGlobe = await Timestamp(DiscourseGlobe, DiscourseGlobeError); //最一筆po文時間轉為timestamp
    var FacebookOptionsGlobe = await GetFacebookAroundOptions(timestampGlobe + 1); //使用discourse最後一筆時間抓取Facebook粉絲頁PO文設定
    var FacebookGlobe = await GetData(FacebookOptionsGlobe); //抓取Facebook粉絲頁最新PO文[新聞觀測]
    var AnalyFacebookGlobe = await AnalysisFacebookGlobe(FacebookGlobe) //將抓取到的資料做分析處理
    var postGlob = await PostData(AnalyFacebookGlobe, PostDiscourseOptions, facebookglobetopic) //寫回discourse news -函數設定(data,option,topicid)  

}

//**************抓取資料:使用不同option************************ */
async function GetData(option) {
    return new Promise((resolve, reject) => {
        http.request(option).on('response', function(response) {
            var data = '';
            response.on("data", function(chunk) {
                data += chunk;
            });
            response.on('end', function() {
                resolve(JSON.parse(data))
            });
        }).end();
    })
}
//**************日期轉換timestamp************************ */
async function Timestamp(data, errordata) {
    var errorlastdata = errordata.post_stream.posts[errordata.post_stream.posts.length - 1].cooked;
    var lastdata = data.post_stream.posts[data.post_stream.posts.length - 1].cooked;
    var topicid = data.post_stream.posts[0].topic_id
    if (topicid === 1249 || topicid === 1359) {
        var lasttime = lastdata.replace(/(\W(.*))+建立時間:<br>/, "").replace(/[+].*(\W(.*))+/, "");
        if (errorlastdata.indexOf("建立時間") > -1) {
            var errorlasttime = errorlastdata.replace(/(\W(.*))+建立時間:<br>/, "").replace(/[+].*(\W(.*))+/, "");
        } else var errorlasttime = 0;
    } else if (topicid == 1258 || topicid === 1398) {
        var lasttime = lastdata.indexOf("發佈日期");
        lasttime = lastdata.substr(lasttime, 27).replace(/發佈日期:/g, "").replace(/<.*/, "");
        var errorlasttime = errorlastdata.indexOf("發佈日期");
        if(errorlasttime > -1) {
            errorlasttime = errorlastdata.substr(lasttime, 27).replace(/發佈日期:/g, "").replace(/<.*/, "");
        } else errorlasttime = 0;
    }
    var time = new Date(lasttime).getTime() / 1000;
    var errortime = new Date(errorlasttime).getTime() / 1000;
    if (time > errortime) {return time} // 比較時間
    else {return errortime}
}
//*****************抓取facebook [新聞快遞]並且將資料解析*************
async function AnalysisFacebookNews(jsonfile) {
    var counter = '';
    var fbinfo = [];
    counter = 0;
    jsonfile.data = jsonfile.data.reverse()
    for (var i = 0; i < jsonfile.data.length; i++) {
        if (jsonfile.data[i].message != undefined && jsonfile.data[i].message.indexOf('【新聞快遞】') == 0) {
            if (jsonfile.data[i].description === undefined) {jsonfile.data[i].description = '新聞內文請點連結'}
            fbinfo[counter] = "新聞名稱:<br>" + jsonfile.data[i].name + "<br>";
            fbinfo[counter] += "新聞內文:<br>" + jsonfile.data[i].description + "<br>";
            fbinfo[counter] += "新聞圖片:<br>" + jsonfile.data[i].full_picture + "<br>";
            fbinfo[counter] += "新聞來源:<br>" + jsonfile.data[i].caption + "<br>";
            fbinfo[counter] += "新聞關鍵字:<br>" + jsonfile.data[i].message.replace(/#/, "") + "<br>";
            fbinfo[counter] += "新聞連結:<br>" + jsonfile.data[i].link + "<br>";
            fbinfo[counter] += "建立時間:<br>" + jsonfile.data[i].created_time + "<br>";
            counter++;
        }
    }
    return fbinfo;
}
//*****************抓取facebook [新聞觀測]並且將資料解析*************
async function AnalysisFacebookGlobe(jsonfile) {
    var counter = '';
    var fbinfo = [];
    var table = '';
    counter = 0;
    jsonfile.data = jsonfile.data.reverse()
    if (jsonfile.data != undefined) {
        for (var i = 0; i < jsonfile.data.length; i++) {
            if (jsonfile.data[i].attachments != undefined) {
                if (jsonfile.data[i].attachments.data[0] != undefined) {
                    if (jsonfile.data[i].attachments.data[0].description != undefined) {
                        var data = jsonfile.data[i].attachments.data[0];
                        if (data.description.indexOf('【國際觀測】') > -1) {
                            fbinfo[counter] = "title:<br>" + data.title + "<br>";
                            table = data.description.substr(data.description.indexOf("類別:")).replace(/\n.*/g, "") + "<br>";
                            data.description = data.description.replace(/類別:.*(\n)+/, "")
                            table += data.description.substr(data.description.indexOf("區域:")).replace(/\n.*/g, "") + "<br>";
                            data.description = data.description.replace(/區域:.*(\n)+/, "")
                            table += data.description.substr(data.description.indexOf("年度:")).replace(/\n.*/g, "") + "<br>";
                            data.description = data.description.replace(/年度:.*(\n)+/, "")
                            table += data.description.substr(data.description.indexOf("作者:")).replace(/\n.*/g, "") + "<br>";
                            data.description = data.description.replace(/作者:.*(\n)+/, "");
                            var table1 = data.description.substr(data.description.indexOf("組織機構和網址:")).replace(/\n.*/g, "").replace(/組織機構和網址:/g, "") + "\n<br>";
                            table1 = table1.split('http');
                            table += "組織機構名稱與網址:" + table1[0] + "\n\nhttp" + table1[1];
                            data.description = data.description.replace(/組織機構和網址:.*/, "");
                            fbinfo[counter] += "table:<br>" + table;
                            fbinfo[counter] += "發佈日期:" + jsonfile.data[i].created_time.replace(/[+].*/, "") + "<br>";
                            fbinfo[counter] += "content:<br>" + data.description.replace(/【國際觀測】/, "") + "<br>";
                            // console.log(fbinfo[counter])
                            counter++;
                        }
                    }
                }
            }
        }
    }
    return fbinfo;
}
//**************將資料寫入到discourse************************ */
async function PostData(data, option, topicid) {
    if (data.length > 0) {
        if (topicid == 1249) { console.log("\r\n***[新聞快遞]一共需上傳" + data.length + "篇***\r\n") }
        if (topicid == 1258) { console.log("\r\n***[國際觀測]一共需上傳" + data.length + "篇***\r\n") }
        var coun = 0;
        for (let i of data) {
            coun++;
            console.log("\r\n***目前上傳第" + coun + "篇***\r\n")
            console.log(option)
            if(i.indexOf(undefined) > -1) {
                if (topicid === facebooknewstopic) {
                    var contents = await PostDatatoDiscourse(i, option, newserror); //如果出現錯誤寫入到錯誤回報1359
                } else {
                    var contents = await PostDatatoDiscourse(i, option, arounderror); //如果出現錯誤寫入到錯誤回報arounderror
                }
            } else {
                var contents = await PostDatatoDiscourse(i, option, topicid);
            }
        }
        console.log("\r\n***上傳完成***\r\n")
    } else {
        if (topicid == 1249) { console.log("\r\n***[新聞快遞] 目前已更至最新***\r\n") }
        if (topicid == 1258) { console.log("\r\n***[國際觀測] 目前已更至最新***\r\n") }

    }
}
async function PostDatatoDiscourse(data, option, topicid) {
    return new Promise((resolve, reject) => {
        setTimeout(v => resolve(data), 3000);
        var req = http.request(option, function(res) {
            var result = '';
            res.on('data', function(chunk) {
                result += chunk;
            });
            res.on('end', function() {
                console.log(data + "\r\n");
            });
            res.on('error', function(err) {
                console.log(err);
            })
        });
        req.write(sub(data, topicid));
        req.end();
    })
}

//*****************Discourse POST 設定*************
var PostDiscourseOptions = { //--
    host: 'talk.vtaiwan.tw',
    method: 'POST',
    path: config.discoursekey,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
};

function sub(data, topicid) {
    var postData = querystring.stringify({ topic_id: topicid, raw: data, category: 170 }); //--      
    return postData;
}
//*****************Discourse get 設定*************
function GetDiscourseOptions(topicname, topicid) {
    var GetdiscourseOptions = { //--
        host: 'talk.vtaiwan.tw',
        path: '/t/' + topicname + '/' + topicid + '/last.json',
    };
    return GetdiscourseOptions
}
//*****************Facebook get 設定*************
async function GetFacebookOptions(timestamp) {
    var timepath = config.fbkey + '&since=' + timestamp;
    var getfboptions = {
        host: 'graph.facebook.com',
        path: timepath,
    };
    return getfboptions;
}
async function GetFacebookAroundOptions(timestamp) {
    var timepath = config.fbaroundkey + '&since=' + timestamp;
    var getfboptions = {
        host: 'graph.facebook.com',
        path: timepath,
    };
    return getfboptions;
}

//*****************unicode轉換*************
function decode(s) {
    return unescape(s.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1'));
}
//*****************discourse post 設定*************