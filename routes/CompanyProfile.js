var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');
/* GET company page. */
router.get('/', function(req, res, next) {
	var code = req.query.code;
	if(code == undefined){ //若為undefined代表沒有輸入code，直接跳轉頁面到CompanyProfile的1101
		console.log('undefined!!');
		res.redirect("/CompanyProfile?code=1101");
	}
	else{
		new sql.ConnectionPool(db).connect().then(pool => {
  			return pool.request().query("SELECT TOP 1 CompanyProfile.code,CompanyProfile.company,CompanyProfile.listed_type,convert(varchar,CompanyProfile.listed_date, 111)AS listed_date ,CompanyProfile.industry,CompanyProfile.tax,CompanyProfile.isin,CompanyProfile.telephone,CompanyProfile.fax,CompanyProfile.website,CompanyProfile.e_mail,CompanyProfile.chairman,CompanyProfile.general,CompanyProfile.spokes,CompanyProfile.controller,CompanyProfile.employees,CompanyProfile.capital,convert(varchar,CompanyProfile.founded, 111)AS founded,StockPrice.price_date AS updateDate,StockPrice.trading_volume,StockPrice.clos,StockPrice.[open],StockPrice.up,StockPrice.down,IndustryType.industry_name FROM (SELECT * FROM CompanyProfile) AS CompanyProfile INNER JOIN (SELECT * FROM StockPrice) AS StockPrice ON CompanyProfile.code = StockPrice.code INNER JOIN (SELECT * FROM IndustryType) AS IndustryType ON CompanyProfile.industry = IndustryType.industry_id WHERE CompanyProfile.code='"+code+"' ORDER BY StockPrice.price_date DESC")
  		}).then(result => {
    		let rows = result.recordset
   			 res.setHeader('Access-Control-Allow-Origin', '*')
   		 	// res.status(200).json(rows);
   			 // sql.close();
   			 if(result.rowsAffected =='0'){ //若為0代表輸入的code並沒有資料可以顯示，跳轉頁面到CompanyProfile的1101
   			 		console.log('no data');
					res.redirect("/CompanyProfile?code=1101");
				}
				else{
				res.render('./CompanyProfile', {title: '股起勇氣', data: rows });}
  			}).catch(err => {
   			 res.status(500).send({ message: err})
   			 // sql.close();
  			});
	}
});

/*收藏功能*/
router.post('/conllection',function(req,res,next){
	var act = req.body.act;
	var CollectedId = req.body.code;
	var id = req.headers.cookie.split(';'); //split 切割字串
	id = id[2].slice(4); //取fb的id，slice(字串從第幾位開始取)
	// console.log(id);
	if(act =='add'){
		sql.connect(db,function(err){
			if (err) console.log(err);
			var request = new sql.Request();
			request.query("SELECT count(id) AS count FROM Collection WHERE fbId="+id+" AND CollectedId="+CollectedId,function(err,result){ //比對是否已經有收藏了
				if(err){
					console.log(err);
					res.send(err);
				}
				// console.log(result.recordset);
				var rowsCount = result.recordset[0].count; //筆數
				if(rowsCount == '0'){ //為0等於沒有收藏過，進行收藏
					request.query("INSERT INTO Collection(fbId,CollectedId) VALUES('"+id+"','"+CollectedId+"')",function(err,result){
						if(err){
							console.log(err);
							res.send(err);
						}
						else{
							res.send('已收藏');
							sql.close();
						}
					});
				}
				else if(rowsCount =='1'){ //為1等於已經收藏過
					res.send('已收藏');
					sql.close();
				}
				
			});
			
		});
	}
});

module.exports = router;