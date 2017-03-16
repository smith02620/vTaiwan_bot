# vTaiwan_bot

執行 node facebook.js

facebook.js 為vtaiwan粉絲頁新聞自動上稿至vtaiwan discourse news
FB_news_globe.js 為vtaiwan粉絲頁新聞以及新聞觀測自動上稿至vtaiwan discourse new & around the globe

合併；vtaiwan.org新聞資訊 與 vtaiwanFB粉絲頁新聞資訊 

    1.get_vtaiwan_org 抓取vtaiwan.org網站內的所有新聞資訊存成vtaiwan_org_data.json檔案
    2.json_facebook 將vtaiwan粉絲頁新聞 存成merrge_vtaiwan.json檔案
    3.addname.js json格式中新增name(新聞名稱) 作為之後比較用 存成addname.json檔案
    4.compare.js 1.比對陣列內是否有相同資料  2.按照年分排序 存成filter.json檔案
    5.post_merrg 將排序好的filter.json檔案上稿到vtaiwan discourse news

合併；vtaiwan.org重要觀測

    1.get_vtaiwan_org_Around_the_clobe.js抓取vtaiwan.org網站內的所有重要觀測存入vtaiwan discourse Around the Globe
    