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
			request.query("SELECT Revenue.*,company.company FROM (SELECT * FROM Revenue WHERE code = '"+code+"') AS Revenue INNER JOIN (SELECT code,company FROM CompanyProfile WHERE code ='"+code+"') AS company ON Revenue.code = company.code ORDER BY Revenue.r_montly DESC",function(err,result){
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

module.exports = router;