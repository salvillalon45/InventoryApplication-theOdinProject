var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	console.log('Redirect to home!');
	res.redirect('/home');
});

module.exports = router;
