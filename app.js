// NPM Packages
// ---------------------------------------------------------
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

// Routers
// ---------------------------------------------------------
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');

var app = express();

// Set Up Mongoose Connection
// ---------------------------------------------------------
const mongoose = require('mongoose');
const mongoDB =
	'mongodb+srv://saltest:theOdinProjectNodeInventoryApplication@cluster-odininventoryap.fgmgk.mongodb.net/inventory?retryWrites=true&w=majority';
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
		indentedSyntax: true, // true = .sass and false = .scss
		sourceMap: true
	})
);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
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
	res.render('error');
});

module.exports = app;
