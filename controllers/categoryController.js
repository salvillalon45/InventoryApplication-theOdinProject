const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const { body, validationResult } = require('express-validator');

// Display list of all category.
exports.category_list = function (req, res, next) {
	Category.find().exec(function (err, category_list) {
		if (err) {
			return next(err);
		}

		res.render('category_list', {
			title: 'Video Game Categories',
			category_list: category_list
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
					{ category: req.params.id },
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
				video_games: results.video_games
			});
		}
	);
};

// Display category create form on GET.
exports.category_create_get = function (req, res) {
	res.render('category_form', {
		category: null,
		title: 'Create A New Category',
		errors: null
	});
};

// Handle category create on POST.
exports.category_create_post = [
	// Validate and sanitize fields.
	body('name').trim().isLength({ min: 1 }).escape(),
	body('description').trim().isLength({ min: 1 }).escape(),

	// Process request after validation and sanitization
	(req, res, next) => {
		// Extract the validation errors from a request
		const errors = validationResult(req);

		// Create a Category object with escaped and trimmed data
		const category = new Category({
			name: req.body.name,
			description: req.body.description
		});

		if (!errors.isEmpty()) {
			// There are errors. Render the form again with sanitized
			// values/error messages
			res.render('category_form', {
				title: 'Create A New Category',
				category: category,
				errors: errors.array()
			});
		} else {
			// Data from form is valid
			// Check if Category with the same name already exists
			Category.findOne({ name: req.body.name }).exec(function (
				err,
				found_category
			) {
				if (err) {
					return next(err);
				}

				if (found_category) {
					// Category exists, redirect to its detail page
					console.log('Category exists, redirect to its detail page');

					res.redirect(found_category.url);
				} else {
					category.save(function (err) {
						if (err) {
							return next(err);
						}
						console.log('Going to redirect');
						console.log('what is url');
						console.log(category.url);
						console.log('/home' + category.url);
						res.redirect(category.url);
					});
				}
			});
		}
	}
];

// Display category delete form on GET.
exports.category_delete_get = function (req, res, next) {
	async.parallel(
		{
			category: function (callback) {
				Category.findById(req.params.id).exec(callback);
			},
			video_games: function (callback) {
				Item.find({ category: req.params.id }).exec(callback);
			}
		},
		function (err, results) {
			console.log('What are videoGames');
			console.log(results.category);
			console.log(results.video_games.length);

			if (err) {
				return next(err);
			}
			if (results.category === null) {
				// No results.
				res.redirect('/home/categories');
			}
			// Successful, so render.
			console.log('GOing to render');
			res.render('category_delete', {
				title: 'Delete Category',
				category: results.category,
				video_games: results.video_games
			});
		}
	);
};

// Handle category delete on POST.
exports.category_delete_post = function (req, res, next) {
	async.parallel(
		{
			category: function (callback) {
				Category.findById(req.body.categoryId).exec(callback);
			},
			video_games: function (callback) {
				Item.find({ category: req.body.categoryId }).exec(callback);
			}
		},
		function (err, results) {
			if (err) {
				return next(err);
			}
			// Success
			if (results.video_games.length > 0) {
				// Category has video games. Render in same way as for GET route.
				res.render('category_delete', {
					title: 'Delete Category',
					category: results.category,
					video_games: results.video_games
				});
				return;
			} else {
				// Category has video games. Delete object and redirect to the list of categories.
				Category.findByIdAndRemove(
					req.body.categoryId,
					function deleteCategory(err) {
						if (err) {
							return next(err);
						}

						// Success go to category list
						res.redirect('/home/category');
					}
				);
			}
		}
	);
};

// Display category update form on GET.
exports.category_update_get = function (req, res, next) {
	Category.findById(req.params.id).exec(function (err, results) {
		if (err) {
			return next(err);
		}

		if (results.category === null) {
			// No results.
			const err = new Error('Category not found');
			err.status = 404;
			return next(err);
		}

		res.render('category_form', {
			category: results,
			title: 'Update Category',
			errors: null
		});
	});
};

// Handle category update on POST.
exports.category_update_post = [
	// Validate and sanitize fields.
	body('name').trim().isLength({ min: 1 }).escape(),
	body('description').trim().isLength({ min: 1 }).escape(),

	// Process request after validation and sanitization
	(req, res, next) => {
		console.log('Going to begin');
		// Extract the validation errors from a request
		const errors = validationResult(req);

		// Create a Category object with escaped and trimmed data
		const category = new Category({
			name: req.body.name,
			description: req.body.description,
			_id: req.params.id //This is required, or a new ID will be assigned!
		});
		console.log('The new Categoryu');
		console.log(category);
		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			res.render('category_form', {
				title: 'Update Category',
				category: category,
				errors: errors.array()
			});
		} else {
			// Data from form is valid
			// Check if Category with the same name already exists
			Category.findByIdAndUpdate(
				req.params.id,
				category,
				{},
				function (err, thecategory) {
					if (err) {
						console.log('What is err when finding');
						console.log(err);
						return next(err);
					}
					// Successful - redirect to caetgory detail page.
					console.log('GOing to redirect!');
					res.redirect(thecategory.url);
				}
			);
		}
	}
];
