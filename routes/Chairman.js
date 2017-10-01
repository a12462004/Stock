var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');

router.get('/', function(req, res, next) {
	var code = req.query.code;
	if(code == undefined){ //若為undefined代表沒有輸入code，直接跳轉頁面到CompanyProfile的1101
		res.redirect("/Chairman?code=1101");
	}
	else{
		sql.connect(db,function(err){
			if(err) console.log(err);
			var request = new sql.Request();
			request.query("SELECT Chairman.*,company.company FROM Chairman AS Chairman INNER JOIN (SELECT code,MAX(h_date) AS max_date FROM Chairman GROUP BY code) AS max_Chairman ON Chairman.code = max_Chairman.code AND Chairman.h_date = max_Chairman.max_date INNER JOIN (SELECT code,company FROM CompanyProfile WHERE code ='"+code+"') AS company ON Chairman.code = company.code WHERE Chairman.code = '"+code+"' AND [Chairman].[owner] NOT LIKE '%合計%' AND [Chairman].[identity] NOT LIKE '%揭露%' ORDER BY [Chairman].[identity] DESC",function(err,result){
				if(err){
					console.log(err);
					res.send(err);
				}
				sql.close();
				if(result.rowsAffected =='0'){ //若為0代表輸入的code並沒有資料可以顯示，跳轉頁面到CompanyProfile的1101
					res.redirect("/Chairman?code=1101");
				}
				else{
				res.render('./Chairman', {title: '股起勇氣', data: result.recordset });
			}
			});
		});
	}
});

module.exports = router;