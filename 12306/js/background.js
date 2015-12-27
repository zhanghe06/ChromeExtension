//消息通信
chrome.runtime.sendMessage('fuck', function(response) {
    console.log(response);

    //设置参数
    var from_station_text = response.from_station_text;  //出发车站 WHN 武汉
    var from_station = response.from_station;  //出发车站 WHN 武汉
    var to_station_text = response.to_station_text;  //到达车站 SHH 上海
    var to_station = response.to_station;  //到达车站 SHH 上海
    var start_date = response.start_date;
    var username = response.username;
    var password = response.password;
    var start_time = response.start_time;  //发车时间段：12点-18点
    var prior = response.prior;  //优先类别 1：席别优先; 2：车次优先
    var prior_site = response.prior_site.split(",");  //优先席别
    var prior_train = response.prior_train.split(",");  //优先车次
    var train_type = response.train_type.split(",");  //车次类型 G:GC-高铁/城际; D:D-动车; Z:Z-直达; T:T-特快; K:K-快速; QT:其他
    var passenger = response.passenger.split(",");  //乘客信息

    function setCookie(c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
    }

    //设置cookie(全站有效，过期时间1年)
    setCookie("_jc_save_fromDate", start_date, 365);
    setCookie("_jc_save_fromStation", from_station_text+','+from_station, 365);
    setCookie("_jc_save_toStation", to_station_text+','+to_station, 365);
    setCookie("_jc_save_wfdc_flag", 'dc', 365);  //车票类型：dc:单程；wf:往返。这里统一设置单程

    //登陆表单
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
    document.getElementById('username').focus();

    //设置出行计划
    document.getElementById('fromStation').value = from_station;  //出发车站
    document.getElementById('toStation').value = to_station;  //到达车站

    //打开更多选项
    document.getElementById('show_more').click();

    //设置弹窗选项
    var option_btns = document.getElementsByClassName('btn-small');
    if(passenger != '' && passenger.length > 0){
        //乘车人员
        //打开弹窗
        option_btns[0].click();
        var ul=document.getElementById('buyer-list');
        var lis=ul.childNodes;
        for(var i_li=0;i_li<lis.length;i_li++){
            if(passenger.indexOf(lis.item(i_li).textContent)>-1){
                lis.item(i_li).firstChild.click();
            }
        }
        //关闭弹窗
        document.getElementsByClassName('quick-box-hd').item(0).firstChild.click();
    }
    if(prior_site != '' && prior_site.length > 0){
        //优先席别
        //打开弹窗
        option_btns[1].click();
        prior_site.forEach(function (element) {
            document.getElementsByName(element)[0].click();
        });
        //关闭弹窗
        document.getElementsByClassName('quick-box-hd').item(1).firstChild.click();
    }


    //车次类型
    var train_type_node = document.getElementsByName('cc_type');
    for(var i_type=0; i_type<train_type_node.length; i_type++){
        if(train_type.indexOf(train_type_node.item(i_type).value)>-1){
            train_type_node.item(i_type).click();
        }
    }

    //优先车次(最多能设置5个)
    if(prior_train == '' || prior_train.length == 0){
        prior_train.forEach(function (element) {
            document.getElementById('inp-train').value = element;
            document.getElementById('add-train').click();
        });
    }

    //备选日期

    //优先设置
    document.getElementById('_prior').checked = true;
    var select_prior = document.getElementById("_prior");
    for(var i_prior=0; i_prior<select_prior.options.length; i_prior++){
        if(select_prior.options[i_prior].value == prior){
            select_prior.options[i_prior].selected = true;
            break;
        }
    }

    //自动提交
    document.getElementById('autoSubmit').checked = true;

    //余票不足部分提交
    document.getElementById('partSubmit').checked = true;

    //发车时间
    var select_start_time = document.getElementById("cc_start_time");
    for(var i=0; i<select_start_time.options.length; i++){
        if(select_start_time.options[i].value == start_time){
            select_start_time.options[i].selected = true;
            break;
        }
    }

    //仅仅显示可以预订车票
    document.getElementById('avail_ticket').checked = true;

    //开启自动查询(默认间隔时间5秒)
    document.getElementById('auto_query').click();
    document.getElementById('query_ticket').click();

    //刷新车票(2秒刷新一次，有bug，订单提交时也会刷新页面)
    //function refresh_ticket(){
    //    document.getElementById('query_ticket').click();
    //    setTimeout(refresh_ticket, 2000);
    //}
    //refresh_ticket();

    //触发自动提交按钮
    document.getElementById('qr_submit').click();

    //提交按钮点击后会再次弹出验证码确认
});
