var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');

router.get('/', function(req, res, next) {
	var code = req.query.code;
	if(code == undefined){ //若為undefined代表沒有輸入code，直接跳轉頁面到CompanyProfile的1101
		res.redirect("/Revenue?code=1101");
	}
	else{
		sql.connect(db,function(err){
			if(err) console.log(err);
			var request = new sql.Request();
			request.query("SELECT Revenue.*,company.company,SUBSTRING(r_montly, 1, 6) AS [date] FROM (SELECT * FROM Revenue WHERE code = '"+code+"') AS Revenue INNER JOIN (SELECT code,company FROM CompanyProfile WHERE code ='"+code+"') AS company ON Revenue.code = company.code ORDER BY Revenue.r_montly DESC",function(err,result){
				if(err){
					console.log(err);
					res.send(err);
				}
				sql.close();
				if(result.rowsAffected =='0'){ //若為0代表輸入的code並沒有資料可以顯示，跳轉頁面到CompanyProfile的1101
					res.redirect("/Revenue?code=1101");
				}
				else{
				res.render('./Revenue', {title: '股起勇氣', data: result.recordset });
			}
			});
		});
	}
});
router.post('/getChartData',function(req,res,next){
	var code = req.body.code;
	console.log(code);
	sql.connect(db,function(err) {
		if(err) console.log(err);
		var request = new sql.Request();
		request.query("SELECT * FROM (SELECT SUBSTRING(r_montly, 1, 4)+'/'+SUBSTRING(r_montly, 5, 2) as r_montly,a_growth_rate,revenue FROM Revenue WHERE code='"+code+"' ) AS Revenue INNER JOIN (SELECT SUBSTRING(StockPrice.price_date, 1, 4)+'/'+SUBSTRING(StockPrice.price_date, 6, 2) AS [year],StockPrice.clos FROM (SELECT * FROM StockPrice WHERE code='"+code+"') AS StockPrice INNER JOIN ( SELECT code,maxdate = CASE DATEPART(dw,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))) WHEN '1' THEN CONVERT(varchar(100),dateadd(dd,-2,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))), 23) WHEN '7' THEN CONVERT(varchar(100),dateadd(dd,-1,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))), 23) ELSE CONVERT(varchar(100),dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0)), 23) END FROM StockPrice WHERE code='"+code+"' GROUP BY dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0)),code) AS maxdata ON StockPrice.price_date = maxdata.maxdate) AS clos ON Revenue.r_montly = clos.[year] ORDER BY clos.[year]",function(err,result){
			if(err){
				console.log(err);
				res.send(err);
			}
			sql.close();
			console.log(result.recordset);
			res.send(result.recordset);
		});
	});
});

module.exports = router;