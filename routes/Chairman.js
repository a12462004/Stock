var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');

router.get('/', function(req, res, next) {
	var code = req.query.code;
	if(code == undefined){ //若為undefined代表沒有輸入code，直接跳轉頁面到Chairman的1101
		res.redirect("/Chairman?code=1101");
	}
	else{
		new sql.ConnectionPool(db).connect().then(pool => {
			// 抓取Chairman的資料和上方藍色區塊資料
  			return pool.request().query("SELECT Chairman.*,max_Chairman.max_date,CompanyProfile.company,Replace(CONVERT(NVARCHAR(20),CEILING(CAST(CompanyProfile.capital AS money)/1000000),1),'.00','') AS capital,CAST ( YEAR(StockPrice.price_date) AS VARCHAR(10) )+'/'+CAST ( MONTH(StockPrice.price_date) AS VARCHAR(10) )+'/'+CAST ( DAY(StockPrice.price_date) AS VARCHAR(10) ) AS updateDate,StockPrice.[open],StockPrice.up,StockPrice.down,StockPrice.clos,Replace(CONVERT(NVARCHAR(20),CAST(StockPrice.trading_volume AS money),1),'.00','') AS trading_volume,IndustryType.industry_name FROM (SELECT * FROM Chairman) AS Chairman  INNER JOIN (SELECT code,MAX(h_date) AS max_date FROM Chairman GROUP BY code) AS max_Chairman ON Chairman.code = max_Chairman.code AND Chairman.h_date = max_Chairman.max_date INNER JOIN (SELECT code,company,industry,capital FROM CompanyProfile WHERE code ='"+code+"') AS CompanyProfile ON Chairman.code = CompanyProfile.code INNER JOIN (SELECT TOP 1 * FROM StockPrice WHERE code = '"+code+"' ORDER BY StockPrice.price_date DESC) AS StockPrice ON CompanyProfile.code = StockPrice.code INNER JOIN (SELECT * FROM IndustryType) AS IndustryType ON CompanyProfile.industry = IndustryType.industry_id WHERE Chairman.code = '"+code+"' AND [Chairman].[owner] NOT LIKE '%合計%' AND [Chairman].[identity] NOT LIKE '%揭露%' ORDER BY [Chairman].[identity] DESC ")}).then(result => {
    		let rows = result.recordset
   			 res.setHeader('Access-Control-Allow-Origin', '*')
   		 	// res.status(200).json(rows);
   			 // sql.close();
   			 if(result.rowsAffected =='0'){ //若為0代表輸入的code並沒有資料可以顯示，跳轉頁面到Chairman的1101
					console.log('沒有資料可顯示');
					res.redirect("/Chairman?code=1101");
				}
				else{
				res.render('./Chairman', {title: '股起勇氣', data: result.recordset });
			}
  			}).catch(err => {
   			 res.status(500).send({ message: err})
   			 // sql.close();
  			});
	}
});

module.exports = router;