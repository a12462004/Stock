var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var CompanyProfile = require('./routes/CompanyProfile');
var Schedule = require('./routes/Schedule');
var Collection = require('./routes/Collection');
var DividendPolicy = require('./routes/DividendPolicy');
var Revenue = require('./routes/Revenue');
var Chairman = require('./routes/Chairman');
var PER = require('./routes/PER');
var PBR = require('./routes/PBR');
var exam = require('./routes/exam');
var article = require('./routes/article');
var article_content = require('./routes/article_content');
var question = require('./routes/question');
var grade = require('./routes/grade');
var Why_invest = require('./routes/Why_invest');
var video = require('./routes/video');
var What_is_the_stock = require('./routes/What_is_the_stock');
var What_is_the_K_line = require('./routes/What_is_the_K_line');
var What_is_ETF = require('./routes/What_is_ETF');
var Investment_and_speculation = require('./routes/Investment_and_speculation');
var How_to_buy_stock = require('./routes/How_to_buy_stock');
var Zero_start = require('./routes/Zero_start');
var One_stock = require('./routes/One_stock');


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/CompanyProfile', CompanyProfile);
app.use('/Schedule', Schedule);
app.use('/Collection',Collection);
app.use('/DividendPolicy',DividendPolicy);
app.use('/Revenue',Revenue);
app.use('/Chairman',Chairman);
app.use('/PER',PER);
app.use('/PBR',PBR);
app.use('/exam',exam);
app.use('/article',article);
app.use('/article_content',article_content);
app.use('/question',question);
app.use('/grade',grade);
app.use('/Why_invest',Why_invest);
app.use('/video',video);
app.use('/What_is_the_stock',What_is_the_stock);
app.use('/What_is_the_K_line',What_is_the_K_line);
app.use('/What_is_ETF',What_is_ETF);
app.use('/Investment_and_speculation',Investment_and_speculation);
app.use('/How_to_buy_stock',How_to_buy_stock);
app.use('/Zero_start',Zero_start);
app.use('/One_stock',One_stock);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
