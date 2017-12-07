var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');

router.get('/', function(req, res, next) {
	var code = req.query.code;
  console.log(code);
	if(code == undefined){ //若為undefined代表沒有輸入code，直接跳轉頁面到PER的1101
		res.redirect("/PER?code=1101");
	}
	else{
		new sql.ConnectionPool(db).connect().then(pool => {
        //CAST將數值轉換成money型態
        //CONVERT(NVARCHAR(20),value,1)轉換成三位一個逗號分隔
        //Replace(value,'.00','')將money型態產生的小數點後面刪掉
        //因StockPrice資料為每日資料，但本益比為月資料，所以透過maxDate找出每月的最後一天結算日等同於月資料
        //資料顯示為最新一個月在最上面

        //首先找出每個月的最後一天是星期幾，若是1等於星期日則-2到星期五，若是7等於星期六則-1到星期五
        // maxdate = CASE DATEPART(dw,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))) WHEN '1' THEN CONVERT(varchar(100),dateadd(dd,-2,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))), 23)  WHEN '7' THEN CONVERT(varchar(100),dateadd(dd,-1,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))), 23) ELSE CONVERT(varchar(100),dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0)), 23) END 
  			return pool.request().query("SELECT StockPrice.code,StockPrice.company,StockPrice.[open] AS m_open,StockPrice.up AS m_up,StockPrice.down AS m_down,StockPrice.clos AS m_clos,StockPrice.pe_ratio,StockPrice.net_ratio,CAST ( YEAR(StockPrice.price_date) AS VARCHAR(10) )+'/'+CAST ( MONTH(StockPrice.price_date) AS VARCHAR(10) ) AS [date],CAST ( YEAR(NewStockPrice.price_date) AS VARCHAR(10) )+'/'+CAST ( MONTH(NewStockPrice.price_date) AS VARCHAR(10) )+'/'+CAST ( DAY(NewStockPrice.price_date) AS VARCHAR(10) ) AS updateDate,NewStockPrice.[open],NewStockPrice.up,NewStockPrice.down,NewStockPrice.clos,Replace(CONVERT(NVARCHAR(20),CAST(NewStockPrice.trading_volume AS money),1),'.00','') AS trading_volume,Replace(CONVERT(NVARCHAR(20),CEILING(CAST(CompanyProfile.capital AS money)/1000000),1),'.00','') AS capital,IndustryType.industry_name FROM (SELECT * FROM StockPrice WHERE code='"+code+"') AS StockPrice INNER JOIN (SELECT code,maxdate = CASE DATEPART(dw,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))) WHEN '1' THEN CONVERT(varchar(100),dateadd(dd,-2,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))), 23)  WHEN '7' THEN CONVERT(varchar(100),dateadd(dd,-1,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))), 23) ELSE CONVERT(varchar(100),dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0)), 23) END FROM StockPrice WHERE code='"+code+"'  GROUP BY dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0)),code) AS maxdata ON StockPrice.price_date = maxdata.maxdate INNER JOIN (SELECT code,industry,capital FROM CompanyProfile WHERE code='"+code+"') AS CompanyProfile ON StockPrice.code = CompanyProfile.code INNER JOIN (SELECT TOP 1 * FROM StockPrice WHERE code='"+code+"' ORDER BY price_date DESC) AS NewStockPrice ON StockPrice.code = NewStockPrice.code INNER JOIN (SELECT * FROM IndustryType) AS IndustryType ON CompanyProfile.industry = IndustryType.industry_id ORDER BY StockPrice.price_date DESC")
  		}).then(result => {
    		let rows = result.recordset
   			 res.setHeader('Access-Control-Allow-Origin', '*')
   		 	// res.status(200).json(rows);
   			 // sql.close();
         // console.log(result.rowsAffected);
   			 if(result.rowsAffected =='0'){ //若為0代表輸入的code並沒有資料可以顯示，跳轉頁面到PER的1101
					res.redirect("/PER?code=1101");
				}
				else{
				res.render('./PER', {title: '股起勇氣', data: rows });
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
  			return pool.request().query("SELECT StockPrice.*,CAST ( YEAR(price_date) AS VARCHAR(10) )+'/'+CAST ( MONTH(price_date) AS VARCHAR(10) ) AS date  FROM (SELECT * FROM StockPrice WHERE code='"+code+"') AS StockPrice INNER JOIN (  SELECT code,maxdate = CASE DATEPART(dw,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))) WHEN '1' THEN CONVERT(varchar(100),dateadd(dd,-2,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))), 23) WHEN '7' THEN CONVERT(varchar(100),dateadd(dd,-1,dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0))), 23) ELSE CONVERT(varchar(100),dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0)), 23) END FROM StockPrice WHERE code='"+code+"'  GROUP BY dateadd(ms,-3,DATEADD(mm,  DATEDIFF(m,0,price_date)+1,  0)),code) AS maxdata ON StockPrice.price_date = maxdata.maxdate ORDER BY price_date")
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