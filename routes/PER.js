var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');

router.get('/', function(req, res, next) {
	var code = req.query.code;
	if(code == undefined){ //若為undefined代表沒有輸入code，直接跳轉頁面到CompanyProfile的1101
		res.redirect("/PER?code=1101");
	}
	else{
		sql.connect(db,function(err){
			if(err) console.log(err);
			var request = new sql.Request();
			request.query("SELECT StockPrice.* FROM (SELECT * FROM StockPrice WHERE code='"+code+"') AS StockPrice INNER JOIN (  SELECT code,maxdate = CASE DATEPART(dw,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))) WHEN '1' THEN CONVERT(varchar(100),dateadd(dd,-2,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))), 23) WHEN '7' THEN CONVERT(varchar(100),dateadd(dd,-1,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))), 23) ELSE CONVERT(varchar(100),dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0)), 23) END FROM StockPrice WHERE code='"+code+"'  GROUP BY dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0)),code) AS maxdata ON StockPrice.price_date = maxdata.maxdate ORDER BY price_date",function(err,result){
				if(err){
					console.log(err);
					res.send(err);
				}
				sql.close();
				if(result.rowsAffected =='0'){ //若為0代表輸入的code並沒有資料可以顯示，跳轉頁面到CompanyProfile的1101
					res.redirect("/PER?code=1101");
				}
				else{
				res.render('./PER', {title: '股起勇氣', data: result.recordset });
			}
			});
		});
	}
});

module.exports = router;