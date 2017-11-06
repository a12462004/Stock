var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');
/* GET company page. */
router.get('/', function(req, res, next) {
	var code = req.query.code;
	if(code == undefined){ //若為undefined代表沒有輸入code，直接跳轉頁面到CompanyProfile的1101
		res.redirect("/CompanyProfile?code=1101");
	}
	else{
		sql.connect(db,function(err){
			if(err) console.log(err);
			var request = new sql.Request();
			request.query("SELECT * FROM CompanyProfile WHERE code='"+code+"'",function(err,result){
				if(err){
					console.log(err);
					res.send(err);
				}
				sql.close();
				if(result.rowsAffected =='0'){ //若為0代表輸入的code並沒有資料可以顯示，跳轉頁面到CompanyProfile的1101
					res.redirect("/CompanyProfile?code=1101");
				}
				else{
				res.render('./CompanyProfile', {title: '股起勇氣', data: result.recordset });
			}
			});
		});
	}
});
/*GET companyinfo page*/
// router.get('/:code',function(req,res,next){
// 	sql.connect(db,function(err){
// 		if(err) console.log(err);
// 		var request = new sql.Request();
// 		request.input('code',sql.NVarChar(50),req.params.code);
// 		request.query("SELECT * FROM CompanyProfile WHERE code=@code",function(err,result){
// 			if(err){
// 				console.log(err);
// 				res.send(err);
// 			}
// 			sql.close();
// 			res.render('./CompanyProfile', {title: '股起勇氣', data: result.recordset });
// 		});
// 	});
// });

/*收藏功能*/
router.post('/conllection',function(req,res,next){
	var act = req.body.act;
	var CollectedId = req.body.code;
	var id = req.headers.cookie.split(';'); //split 切割字串
	id = id[1].slice(4); //取fb的id，slice(字串從第幾位開始取)
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