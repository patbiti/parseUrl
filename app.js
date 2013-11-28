var sendmail = require('./util/sendmail');
var http = require('http');
var qs=require('querystring');

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

var timeEval = 1000 * 60 * 10;
var mailOptions = {
	from: "pat's机票订阅服务", // sender address
	to: 'huajian_wen@163.com', 
	subject: '春节前一周低于700的机票', // Subject line
	text: "", // plaintext body
	html: "" // html body,
}
function queryData(){
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
	    	//数据处理开始
	    	var maildata = [];
	    	for(var x in datas){
	    		var price = datas[x].price;
	    		if(price <= 700){
	    			maildata.push({
	    				'day' : x,
	    				'price' : price,
	    				'weeksome' : datas[x].value[2]
	    			});
	    		}
	    	}
	    	if(maildata.length){
	    		var mailhtml = '';
	    		var lowerPrice = 700;
	    		for(var j=0;j<maildata.length;j++){
	    			lowerPrice = lowerPrice > maildata[j].price ? maildata[j].price: lowerPrice;
	    			mailhtml += '<p>' + maildata[j].day + ', ' + maildata[j].weeksome + ',最低价' + maildata[j].price + '</p>'
	    		}
	    		mailOptions.subject = '春节前一周低于700的机票'+'最低'+lowerPrice;  
	    		mailOptions.html = mailhtml;
	    		sendEmail(mailOptions);
	    	}
	    	//下一次
	    	setTimeout(queryData, timeEval);
	    });
	});
	req.on('error', function(e) {
	    console.log('problem with request: ' + e.message);
	});
	req.write(post_data);
	req.end();
}


function sendEmail(options){
	
	sendmail.sendMail(options, function(value,flag){
		console.log(flag, value);
	});
}
queryData();
