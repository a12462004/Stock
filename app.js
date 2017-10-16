var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var users = require('./routes/users');
var CompanyProfile = require('./routes/CompanyProfile');
var Schedule = require('./routes/Schedule');
var Collection = require('./routes/Collection');
var DividendPolicy = require('./routes/DividendPolicy');
var Revenue = require('./routes/Revenue');
var Chairman = require('./routes/Chairman');
var Stock = require('./routes/Stock');
var PER = require('./routes/PER');
var PBR = require('./routes/PBR');
var test = require('./routes/test');
var article = require('./routes/article');
var article_content = require('./routes/article_content');
var question = require('./routes/question');
var grade = require('./routes/grade');


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
app.use('/users', users);
app.use('/CompanyProfile', CompanyProfile);
app.use('/Schedule', Schedule);
app.use('/Collection',Collection);
app.use('/DividendPolicy',DividendPolicy);
app.use('/Revenue',Revenue);
app.use('/Chairman',Chairman);
app.use('/Stock',Stock);
app.use('/PER',PER);
app.use('/PBR',PBR);
app.use('/test',test);
app.use('/article',article);
app.use('/article_content',article_content);
app.use('/question',question);
app.use('/grade',grade);

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
