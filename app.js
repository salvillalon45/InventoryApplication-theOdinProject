// NPM Packages
// ---------------------------------------------------------
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var compression = require('compression');
require('dotenv').config();

// var helmet = require('helmet');
var favicon = require('serve-favicon');

// Routers
// ---------------------------------------------------------
var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');

var app = express();

// app.use(helmet());
app.use(favicon(path.join(__dirname, 'public', 'images', 'snes.ico')));

// Set Up Mongoose Connection
// ---------------------------------------------------------
const mongoose = require('mongoose');
// var dev_db_url =
// 'mongodb+srv://saltest:theOdinProjectNodeInventoryApplication@cluster-odininventoryap.fgmgk.mongodb.net/inventory?retryWrites=true&w=majority';
var mongoDB = process.env.MONGODB_URI || process.env.DEV_MONGODB_URI;
mongoose.connect(mongoDB, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// View Engine Setup
// ---------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use Middleware
// ---------------------------------------------------------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	sassMiddleware({
		src: path.join(__dirname, 'public'),
		dest: path.join(__dirname, 'public'),
		indentedSyntax: false, // true = .sass and false = .scss
		sourceMap: true
	})
);

app.use(compression()); //Compress all routes
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/home', homeRouter);

// Catch 404 and Forward To Error Handler
// ---------------------------------------------------------
app.use(function (req, res, next) {
	next(createError(404));
});

// Error Handler
// ---------------------------------------------------------
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error/error');
});

module.exports = app;
