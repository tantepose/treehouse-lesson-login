var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var app = express();

// mongodb connection på localhost
mongoose.connect('mongodb://localhost:27017/bookworm', { useNewUrlParser: true });
var db = mongoose.connection;

// mongo errors
db.on('error', console.error.bind(console, 'connection error:'));

// use sessions for tracking logins
app.use(session({
  secret: 'treehouse loves you', // sign session id cookie
  resave: true, // resaves i session stores uansett
  saveUninitialized: false // forces en uinit session å IKKE lagres
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
  console.error(err);
});

// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
