const Item = require('../models/item');
const Category = require('../models/category');
const async = require('async');
const { body, validationResult } = require('express-validator');

// Display detail page for an specific item
exports.item_detail = function (req, res, next) {
	Item.findById(req.params.id).exec(function (err, item) {
		if (err) {
			return next(err);
		}

		res.render('item_detail', {
			item: item
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
exports.item_delete_get = function (req, res, next) {
	Item.findById(req.params.id).exec(function (err, item) {
		console.log('Inside item_delete_get()');
		console.log('What is item');
		console.log(item);
		if (err) {
			return next(err);
		}

		if (item === null) {
			// No results.
			res.redirect('/home/categories');
		}
		// Successful, so render.
		console.log('GOing to render');
		res.render('item_delete', {
			title: 'Delete Item',
			item: item
		});
	});
};

// Handle item delete on POST.
exports.item_delete_post = function (req, res, next) {
	Item.findById(req.params.id).exec(function (err, item) {
		if (err) {
			return next(err);
		}

		// Category has video games. Delete object and redirect to the list of categories.
		Item.findByIdAndRemove(req.params.id, function deleteCategory(err) {
			if (err) {
				return next(err);
			}

			// Success go to category list
			res.redirect('/home/category');
		});
	});
};

// Display item update form on GET.
exports.item_update_get = function (req, res, next) {
	Item.findById(req.params.id).exec(function (err, item) {
		if (err) {
			return next(err);
		}

		if (item === null) {
			// No results.
			const err = new Error('Item not found');
			err.status = 404;
			return next(err);
		}

		console.log('What are results from itemUpdate');
		console.log(item);
		Category.findById(item.category).then((category) => {
			console.log('Found category');
			console.log(category);

			item.category = category;

			res.render('item_form', {
				item: item,
				title: 'Update Item',
				errors: null
			});
		});
	});
};

// Handle item update on POST.
exports.item_update_post = [
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
		console.log('Going to begin');
		console.log('Category Check');
		console.log(req.body);
		console.log(req.body.category);
		// Extract the validation errors from a request
		const errors = validationResult(req);

		// Create a Category object with escaped and trimmed data
		const item = new Item({
			name: req.body.name,
			description: req.body.description,
			stock: req.body.stock,
			price: req.body.price,
			category: req.body.category,
			trailer_url: req.body.trailer_url,
			image_url: req.body.image_url,
			_id: req.params.id //This is required, or a new ID will be assigned!
		});

		console.log('The new Item');
		console.log(item);
		console.log(item.category);
		Category.find({ name: req.body.category }).then((category) => {
			console.log('Found category');
			console.log(category[0]);
			item.category = category[0];

			console.log('What is item after item.category');
			console.log(item);
			if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/error messages.
				res.render('item_form', {
					title: 'Update Item',
					item: item,
					errors: errors.array()
				});
			} else {
				// Data from form is valid

				// Check if Item with the same name already exists
				Item.findByIdAndUpdate(
					req.params.id,
					item,
					{},
					function (err, theitem) {
						if (err) {
							console.log('What is err when finding');
							console.log(err);
							return next(err);
						}
						// Successful - redirect to item detail page.
						console.log('GOing to redirect!');
						res.redirect(theitem.url);
					}
				);
			}
		});
	}
];
