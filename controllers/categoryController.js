const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
var helper = require('./utils1.js');

// Display list of all category.
exports.category_list = function (req, res, next) {
	console.log('Inside category_list()');
	Category.find().exec(function (err, category_list) {
		if (err) {
			return next(err);
		}
		console.log(category_list[0].url);
		res.render('category_list', {
			title: 'Video Game Categories',
			category_list: category_list
			// category_detail_link:
		});
	});
};

// Display detail page for a specific category.
exports.category_detail = function (req, res, next) {
	async.parallel(
		{
			category: function (callback) {
				Category.findById(req.params.id).exec(callback);
			},
			video_games: function (callback) {
				Item.find(
					{ category_ref: req.params.id },
					'name stock price description category'
				).exec(callback);
			}
		},
		function (err, results) {
			if (err) {
				return next(err);
			} // Error in API usage.

			if (results == null) {
				// No results.
				const err = new Error('Categories not found');
				err.status = 404;
				return next(err);
			}
			console.log('What are results');
			console.log(results);
			// Successful, so render.
			res.render('category_detail', {
				title: 'Category Detail Page',
				category: results.category,
				video_games: results.video_games,
				helper: helper
			});
		}
	);
	// Category.findById(req.params.id).exec(function (err, category_detail) {
	// 	if (err) {
	// 		return next(err);
	// 	}

	// 	if (category_detail === null) {
	// 		const err = new Error('Author not found');
	// 		err.status = 404;
	// 		return next(err);
	// 	}

	// 	res.render('category_detail', {
	// 		title: 'Category Detail Page',
	// 		category_detail: category_detail
	// 	});
	// });
};

// Display category create form on GET.
exports.category_create_get = function (req, res) {
	res.send('NOT IMPLEMENTED: category create GET');
};

// Handle category create on POST.
exports.category_create_post = function (req, res) {
	res.send('NOT IMPLEMENTED: category create POST');
};

// Display category delete form on GET.
exports.category_delete_get = function (req, res) {
	res.send('NOT IMPLEMENTED: category delete GET');
};

// Handle category delete on POST.
exports.category_delete_post = function (req, res) {
	res.send('NOT IMPLEMENTED: category delete POST');
};

// Display category update form on GET.
exports.category_update_get = function (req, res) {
	res.send('NOT IMPLEMENTED: category update GET');
};

// Handle category update on POST.
exports.category_update_post = function (req, res) {
	res.send('NOT IMPLEMENTED: category update POST');
};
