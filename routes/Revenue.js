var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');

router.get('/', function(req, res, next) {
	var code = req.query.code;
	if(code == undefined){ //若為undefined代表沒有輸入code，直接跳轉頁面到Revenue的1101
		res.redirect("/Revenue?code=1101");
	}
	else{
		new sql.ConnectionPool(db).connect().then(pool => {
        //CAST將數值轉換成money型態
        //CONVERT(NVARCHAR(20),value,1)轉換成三位一個逗號分隔
        //Replace(value,'.00','')將money型態產生的小數點後面刪掉
  			return pool.request().query("SELECT Revenue.code,Replace(CONVERT(NVARCHAR(20),CAST(Revenue.revenue AS money),1),'.00','') AS revenue,Revenue.m_growth_rate,Revenue.a_growth_rate,Replace(CONVERT(NVARCHAR(20),CAST(Revenue.acc_revenue AS money),1),'.00','') AS acc_revenue,Replace(CONVERT(NVARCHAR(20),CAST(Revenue.acc_growth_rate AS money),1),'.00','') AS acc_growth_rate,Revenue.last_revenue,SUBSTRING(Revenue.r_montly,1,4)+'/'+SUBSTRING(Revenue.r_montly,5,2) AS [date],CompanyProfile.company,Replace(CONVERT(NVARCHAR(20),CEILING(CAST(CompanyProfile.capital AS money)/1000000),1),'.00','') AS capital,StockPrice.[open],StockPrice.up,StockPrice.down,StockPrice.price_date AS updateDate ,StockPrice.clos,Replace(CONVERT(NVARCHAR(20),CAST(StockPrice.trading_volume AS money),1),'.00','') AS trading_volume,IndustryType.industry_name FROM (SELECT * FROM Revenue WHERE code = '"+code+"') AS Revenue INNER JOIN (SELECT code,company,industry,capital FROM CompanyProfile  WHERE code ='"+code+"') AS CompanyProfile ON Revenue.code = CompanyProfile.code INNER JOIN (SELECT TOP 1 * FROM StockPrice WHERE code = '"+code+"' ORDER BY StockPrice.price_date DESC) AS StockPrice ON CompanyProfile.code = StockPrice.code INNER JOIN (SELECT * FROM IndustryType) AS IndustryType ON CompanyProfile.industry = IndustryType.industry_id ORDER BY Revenue.r_montly DESC")
  		}).then(result => {
    		let rows = result.recordset
   			 res.setHeader('Access-Control-Allow-Origin', '*')
   		 	// res.status(200).json(rows);
   			 // sql.close();
   			 if(result.rowsAffected =='0'){ //若為0代表輸入的code並沒有資料可以顯示，跳轉頁面到Revenue的1101
          res.redirect("/Revenue?code=1101");
				}
				else{
				res.render('./Revenue', {title: '股起勇氣', data: rows });
			}
  			}).catch(err => {
   			 res.status(500).send({ message: "${err}"})
   			 // sql.close();
  			});
		
	}
});

/*圖表資料*/
router.post('/getChartData',function(req,res,next){
	var code = req.body.code;
	// console.log(code);
	new sql.ConnectionPool(db).connect().then(pool => {
  			return pool.request().query("SELECT * FROM (SELECT SUBSTRING(r_montly, 1, 4)+'/'+SUBSTRING(r_montly, 5, 2) as r_montly,a_growth_rate,revenue FROM Revenue WHERE code='"+code+"' ) AS Revenue INNER JOIN (SELECT SUBSTRING(StockPrice.price_date, 1, 4)+'/'+SUBSTRING(StockPrice.price_date, 6, 2) AS [year],StockPrice.clos FROM (SELECT * FROM StockPrice WHERE code='"+code+"') AS StockPrice INNER JOIN ( SELECT code,maxdate = CASE DATEPART(dw,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))) WHEN '1' THEN CONVERT(varchar(100),dateadd(dd,-2,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))), 23) WHEN '7' THEN CONVERT(varchar(100),dateadd(dd,-1,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))), 23) ELSE CONVERT(varchar(100),dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0)), 23) END FROM StockPrice WHERE code='"+code+"' GROUP BY dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0)),code) AS maxdata ON StockPrice.price_date = maxdata.maxdate) AS clos ON Revenue.r_montly = clos.[year] ORDER BY clos.[year]")
  		}).then(result => {
    		let rows = result.recordset
   			 res.setHeader('Access-Control-Allow-Origin', '*')
   		 	// res.status(200).json(rows);
   			 // sql.close();
   			 res.send(rows);
  			}).catch(err => {
   			 res.status(500).send({ message: "${err}"})
   			 // sql.close();
  			});
});

module.exports = router;