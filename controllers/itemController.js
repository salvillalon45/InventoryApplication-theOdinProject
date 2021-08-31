const Item = require('../models/item');
const Category = require('../models/category');
const async = require('async');
const { body, validationResult } = require('express-validator');
const category = require('../models/category');

// Display detail page for an specific item
exports.item_detail = function (req, res, next) {
	Item.findById(req.params.id).exec(function (err, item_detail) {
		if (err) {
			return next(err);
		}

		res.render('item_detail', {
			item_detail: item_detail
		});
	});
};

// Display item create form on GET.
exports.item_create_get = function (req, res) {
	res.render('item_form', {
		item: null,
		title: 'Create A New Item',
		errors: null
	});
};

// Handle item create on POST.
exports.item_create_post = [
	// Validate and sanitize fields.
	body('name').trim().isLength({ min: 1 }).escape(),
	body('stock').trim().isLength({ min: 1 }).escape(),
	body('price').trim().isLength({ min: 1 }).escape(),
	body('description').trim().isLength({ min: 1 }).escape(),
	body('category').trim().isLength({ min: 1 }).escape(),
	body('trailer_url').trim().isLength({ min: 1 }).escape(),
	body('image_url').trim().isLength({ min: 1 }).escape(),

	// Process request after validation and sanitization
	(req, res, next) => {
		// Extract the validation errors from a request
		const errors = validationResult(req);

		// Create a Item object with escaped and trimmed data
		const item = new Item({
			name: req.body.name,
			description: req.body.description,
			stock: req.body.stock,
			price: req.body.price,
			category: req.body.category,
			trailer_url: req.body.trailer_url,
			image_url: req.body.image_url
		});

		console.log('what is item!');
		console.log(req.body.category);
		console.log(item);

		if (!errors.isEmpty()) {
			// There are errors. Render the form again with sanitized
			// values/error messages
			// console.log('THERE IS AN ERROR');
			// res.render('item_form', {
			// 	title: 'Create A New Item',
			// 	item: item,
			// 	errors: errors.array()
			// });
			// Get all authors and genres for form.
			async.parallel(
				{
					category: function (callback) {
						Category.find(callback);
					}
				},
				function (err, categories_db) {
					if (err) {
						return next(err);
					}
					console.log('What are categories_db');
					console.log(categories_db);
					// Mark our selected genres as checked.
					// for (let i = 0; i < categories_db.length; i++) {
					// 	if (categories_db[i].name === item.category.name) {
					// 		return;
					// 	}
					// }
					console.log('What are errors');
					console.log(errors);
					res.render('item_form', {
						title: 'Create Book',
						item: {
							name: req.body.name,
							description: req.body.description,
							stock: req.body.stock,
							price: req.body.price,
							category: req.body.category,
							trailer_url: req.body.trailer_url,
							image_url: req.body.image_url
						},
						errors: errors.array()
					});
				}
			);
			return;
		} else {
			// Data from form is valid
			// Check if Item with the same name already exists
			Item.findOne({ name: req.body.name }).exec(function (
				err,
				found_item
			) {
				if (err) {
					console.log('There is an error when trying to find one');
					return next(err);
				}

				if (found_item) {
					// Item exists, redirect to its detail page
					console.log('Item exists, redirect to its detail page');

					res.redirect(found_item.url);
				} else {
					let designatedCategory = '';

					Category.findOne({ name: req.body.category }).then(
						(category) => {
							console.log('Found category');
							console.log(category);

							designatedCategory = category;
							item.category = designatedCategory;

							item.save(function (err) {
								if (err) {
									console.log('Error when saving new item');
									console.log(err);
									return next(err);
								}
								console.log('Going to redirect');
								console.log('what is url');
								console.log(item.url);
								console.log('/home' + category.url);
								res.redirect(item.url);
							});
						}
					);
				}
			});
		}
	}
];

// Display item delete form on GET.
exports.item_delete_get = function (req, res) {
	res.send('NOT IMPLEMENTED: item delete GET');
};

// Handle item delete on POST.
exports.item_delete_post = function (req, res) {
	res.send('NOT IMPLEMENTED: item delete POST');
};

// Display item update form on GET.
exports.item_update_get = function (req, res) {
	res.send('NOT IMPLEMENTED: item update GET');
};

// Handle item update on POST.
exports.item_update_post = function (req, res) {
	res.send('NOT IMPLEMENTED: item update POST');
};
