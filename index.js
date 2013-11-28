var sendmail = require('./util/sendmail')
	,getUrl;
var $ = require('jquery'); 
var http = require('http');
var options = {
	host: 'www.china-sss.com',
	path: '/AirFlights/SearchFlights?OriCityCode=SJW&DestCityCode=XMN&FlightDate=2014-01-23&FlightDateReturn=2014-01-24&IsReturn=False&MoneyType=0&AdultNum=0&ChildNum=0&InfantNum=0',
	method: 'GET',
	headers: {
		'Accept': 'text/html'
	}
};
var data = {
	OriCityCode:"SJW",
	DestCityCode:"XMN",
	MinPriceDate:"2014-01-23",
	MinPriceReturnDate:"2014-01-24",
	MoneyClassID:"0",
	FlightDate:"2014-01-05",
	FlightDateReturn:"2014-01-24",
	IsReturn:"false"
}
var qs=require('querystring');
// var post_data = qs.stringify({
// 	type: "text",
// 	content : data
// })
var post_data = qs.stringify(data);
var options1 = {
	host: 'www.china-sss.com',
	path: '/AirFlights/Query9DayLowPrice',
	method: 'POST',
	headers: {
		'Accept': 'text/html',
		'Content-Type': 'application/x-www-form-urlencoded',
     	'Content-Length': post_data.length
	}

}
var html = '';
var req = http.request(options1, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
    	html += chunk;
    	var returnData = JSON.parse(html);
    	var datas = {};
    	var values;
    	for(var x in returnData){
    		if(x !='PDOMinPriceTickets'){
    			// datas.push({
    			// 	'day' : x,
    			// 	'value' : returnData[x];
    			// });
    			datas[x] = {
    				'value' : returnData[x]
    			}
    		}else{
    			values = returnData[x];
    		}
    	}
    	for(var i=0;i<values.length;i++){
    		var day = values[i].FlightDateOfLocal;
    		datas[day].price = values[i].MinPrice;
    	}
    	console.log(datas);
    });
});
req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
});

req.write(post_data);
req.end();


// var req = http.request(options, function(res) {
// 	res.setEncoding('utf8');
// 	res.on('data', function(data) {
// 		var html = $(data).find('div').length;
// 		console.log(data);
// 	});
// });
// req.on('error',function(e){
// 	console.log(e.message);
// })
// req.end();
// var html = '';  
// http.get(options1, function(res) {  
//     res.on('data', function(data) {  
//         // collect the data chunks to the variable named "html"  
//         html += data;  
//     }).on('end', function() {  
//         console.log(html);
//         // the whole of webpage data has been collected. parsing time!  
//         // console.log($(html).find('li').length);
//         // var zone = $(html).find('li').each(function(i){
//         // 	console.log($(this).html())
//         // 	var day = $(this).attr('title');
//         // 	var money = $(this).find('font').text();
//         // 	console.log(i,day,money);
//         // });
//         // var title = $(html).find('div h3 span').each(function($this){  
//         //     var a = $(this).children('a').attr('href');  
//         //     var b = $(this).children('a').text();  
//         //     console.log(b + ":" + options.host + a);  
//         // });  
//         // console.log("over");  
//      });  
// });
getUrl = function(url){

}
getUrl('http://www.baidu.com');