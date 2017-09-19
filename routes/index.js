var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');

/* GET home page. */
router.get('/', function(req, res, next) {
  //直接跳轉到公司基本資料頁
  res.redirect("/CompanyProfile?code=1101");
});
//搜尋功能
router.post('/search',function(req,res,next){
	var keyword = req.body.keyword;
	console.log(req);

	sql.connect(db,function(err){
		if(err) console.log(err);
		var request =  new sql.Request();
		request.query("SELECT code,company FROM CompanyProfile WHERE code LIKE '%" + keyword+ "%' OR company LIKE '%" + keyword + "%'",function(err,result){
			if(err){
				console.log(err);
				res.send(err);
			}
			sql.close();
			console.log(result.recordset);
			var list = result.recordset;
			res.send(list);
		});
	});
});
module.exports = router;
