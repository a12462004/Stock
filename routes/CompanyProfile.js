var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');
/* GET company page. */
router.get('/', function(req, res, next) {
	//若只輸入companys就轉到1101
	res.redirect("/CompanyProfile/1101", { title: '股起勇氣' });
});
/*GET companyinfo page*/
router.get('/:code',function(req,res,next){
	sql.connect(db,function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		request.input('code',sql.NVarChar(50),req.params.code);
		request.query("SELECT * FROM CompanyProfile WHERE code=@code",function(err,result){
			if(err){
				console.log(err);
				res.send(err);
			}
			sql.close();
			res.render('./CompanyProfile', {title: '股起勇氣', data: result.recordset });
		});
	});
});

module.exports = router;