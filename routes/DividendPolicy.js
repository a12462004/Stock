var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');

router.get('/', function(req, res, next) {
	var code = req.query.code;
	if(code == undefined){ //若為undefined代表沒有輸入code，直接跳轉頁面到DividenPolicy的1101
		res.redirect("/DividendPolicy?code=1101");
	}
	else{
		new sql.ConnectionPool(db).connect().then(pool => {
        //CAST將數值轉換成money型態
        //CONVERT(NVARCHAR(20),value,1)轉換成三位一個逗號分隔
        //Replace(value,'.00','')將money型態產生的小數點後面刪掉
        //YEAR()-1因股東會日期都會在後一年開，因此需減一
        //surplus+plot等於股票股利
        //資料顯示為最新一個月在最上面
  			return pool.request().query("SELECT DividendPolicy.*,Replace(CONVERT(NVARCHAR(20),CEILING(CAST(CompanyProfile.capital AS money)/1000000),1),'.00','') AS capital,CAST ( YEAR(StockPrice.price_date) AS VARCHAR(10) )+'/'+CAST ( MONTH(StockPrice.price_date) AS VARCHAR(10) )+'/'+CAST ( DAY(StockPrice.price_date) AS VARCHAR(10) ) AS updateDate,StockPrice.[open],StockPrice.up,StockPrice.down,StockPrice.clos,Replace(CONVERT(NVARCHAR(20),CAST(StockPrice.trading_volume AS money),1),'.00','') AS trading_volume,IndustryType.industry_name FROM (SELECT [code],[company],[cash_dividend],[surplus],[plot],YEAR([shareholders_date])-1 as date,(surplus+plot) as stock_dividend FROM [DividendPolicy] WHERE [DividendPolicy].code='"+code+"') AS DividendPolicy INNER JOIN (SELECT code,industry,capital FROM CompanyProfile WHERE code='"+code+"') AS CompanyProfile ON [DividendPolicy].code = CompanyProfile.code INNER JOIN (SELECT TOP 1 * FROM StockPrice WHERE code = '"+code+"' ORDER BY StockPrice.price_date DESC) AS StockPrice ON CompanyProfile.code = StockPrice.code INNER JOIN (SELECT * FROM IndustryType) AS IndustryType ON CompanyProfile.industry = IndustryType.industry_id ORDER BY DividendPolicy.[date] DESC")
  		}).then(result => {
    		let rows = result.recordset
   			 res.setHeader('Access-Control-Allow-Origin', '*')
   		 	// res.status(200).json(rows);
   			 // sql.close();
   			 if(result.rowsAffected =='0'){ //若為0代表輸入的code並沒有資料可以顯示，跳轉頁面到DividenPolicy的1101
          res.redirect("/DividendPolicy?code=1101");
			 }
			 else{
				res.render('./DividendPolicy', {title: '股起勇氣', data: rows });
			 }
  			}).catch(err => {
   			 res.status(500).send({ message: err})
   			 // sql.close();
  			});
	}
});
/*圖表資料*/
router.post('/getChartData',function(req,res,next){
	var code = req.body.code;
	// console.log(code);
	new sql.ConnectionPool(db).connect().then(pool => {
  			return pool.request().query("SELECT YEAR([shareholders_date])-1 as year,cash_dividend,(surplus+plot) as stock_dividend FROM [DividendPolicy] WHERE code='"+code+"'")
  		}).then(result => {
    		let rows = result.recordset
   			 res.setHeader('Access-Control-Allow-Origin', '*')
   		 	// res.status(200).json(rows);
   			 // sql.close();
   			 // console.log(result.recordset);
			 res.send(rows);
  			}).catch(err => {
   			 res.status(500).send({ message: err})
   			 // sql.close();
  			});
});
module.exports = router;