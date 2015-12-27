//读取本地存储配置信息数据
var username = localStorage.username;
var password = localStorage.password;
var from_station_text = localStorage.from_station_text;
var from_station = localStorage.from_station;
var to_station_text = localStorage.to_station_text;
var to_station = localStorage.to_station;
var start_date = localStorage.start_date;
var start_time = localStorage.start_time;
var prior = localStorage.prior;
var prior_site = localStorage.prior_site;
var prior_train = localStorage.prior_train;
var train_type = localStorage.train_type;
var passenger = localStorage.passenger;

//配置信息参数处理
username = username?username:'';
password = password?password:'';
from_station_text = from_station_text?from_station_text:'';
from_station = from_station?from_station:'';
to_station_text = to_station_text?to_station_text:'';
to_station = to_station?to_station:'';
start_date = start_date?start_date:'';
start_time = start_time?start_time:'';
prior = prior?prior:'';
prior_site = prior_site?prior_site:'';
prior_train = prior_train?prior_train:'';
train_type = train_type?train_type:'';
passenger = passenger?passenger:'';

//文本输入框格式控制
var inputs=document.getElementsByTagName('input');
for (var i_input=0;i_input<inputs.length; i_input++) {
    if(inputs[i_input].getAttribute('type')=='text') {
        inputs[i_input].onkeyup=function(){
            //this.value=this.value.replace(/(^\s+)|\s+$/g,"");
            this.value=this.value.replace(/\s/g, '');  //去掉所有空格
            this.value=this.value.replace('，', ',');  //全角的逗号转半角逗号
            this.value=this.value.replace('（', '(');  //全角的括号转半角括号
            this.value=this.value.replace('）', ')');  //全角的括号转半角括号
        };
    }
}
//页面展示本地存储信息
document.getElementById('username').value = username;
document.getElementById('password').value = password;
document.getElementById('from_station_text').value = from_station_text;  //出发车站 WHN 武汉
document.getElementById('to_station_text').value = to_station_text;  //到达车站 SHH 上海
document.getElementById('start_date').value = start_date;  //出发日期
document.getElementById('start_time').value = start_time;  //发车时间段：12点-18点
document.getElementById('prior').value = prior;  //优先类别 1：席别优先; 2：车次优先
//优先席别
var prior_site_array = prior_site.split(',');
var prior_site_nodes = document.getElementsByName('prior_site');
for(var i=1; i<=prior_site_nodes.length; i+=1){
    console.log(prior_site_nodes[i-1].value);
    if(prior_site_array.indexOf(prior_site_nodes[i-1].value)>-1){
        prior_site_nodes[i-1].checked=true;
    }
}
//优先车次
document.getElementById('prior_train').value = prior_train;
//车次类型 G:GC-高铁/城际; D:D-动车; Z:Z-直达; T:T-特快; K:K-快速; QT:其他
var train_type_array = train_type.split(',');
var train_type_nodes = document.getElementsByName('train_type');
for(var j=1; j<=train_type_nodes.length; j+=1){
    console.log(train_type_nodes[j-1].value);
    if(train_type_array.indexOf(train_type_nodes[j-1].value)>-1){
        train_type_nodes[j-1].checked=true;
    }
}
//乘客编号 起始编号0，也就是自己
document.getElementById('passenger').value = passenger;

//保存配置信息
document.getElementById('save').onclick = function(){
    localStorage.clear();  //调试专用，清理本地数据
    localStorage.username = document.getElementById('username').value;
    localStorage.password = document.getElementById('password').value;
    from_station = station_name[document.getElementById('from_station_text').value];
    if(typeof(from_station) == 'undefined'){
        alert('请检查始发车站名称');
        return;
    }
    localStorage.from_station_text = document.getElementById('from_station_text').value;
    localStorage.from_station = from_station;
    to_station = station_name[document.getElementById('to_station_text').value];
    if(typeof(to_station) == 'undefined'){
        alert('请检查到达车站名称');
        return;
    }
    localStorage.to_station_text = document.getElementById('to_station_text').value;
    localStorage.to_station = to_station;
    localStorage.start_date = document.getElementById('start_date').value;
    localStorage.start_time = document.getElementById('start_time').value;
    localStorage.prior = document.getElementById('prior').value;
    var prior_site_nodes = document.getElementsByName('prior_site');
    var prior_site = [];
    for(var i=1; i<=prior_site_nodes.length; i+=1){
        if(prior_site_nodes[i-1].checked){
            prior_site.push(prior_site_nodes[i-1].value);
        }
    }
    localStorage.prior_site = prior_site;
    localStorage.prior_train = document.getElementById('prior_train').value;
    var train_type_nodes = document.getElementsByName('train_type');
    var train_type = [];
    for(var j=1; j<=train_type_nodes.length; j+=1){
        if(train_type_nodes[j-1].checked){
            train_type.push(train_type_nodes[j-1].value);
        }
    }
    localStorage.train_type = train_type;
    localStorage.passenger = document.getElementById('passenger').value;
    console.log(localStorage);
};

//消息通信
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log(message);
    sendResponse(localStorage);
});
