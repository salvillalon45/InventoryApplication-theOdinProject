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

		res.render('item/item_detail', {
			item: item
		});
	});
};

// Display item create form on GET.
exports.item_create_get = function (req, res) {
	Category.find().exec(function (err, category_list) {
		if (err) {
			return next(err);
		}

		res.render('item/item_form', {
			item: undefined,
			category_list: category_list,
			title: 'Create A New Item',
			errors: null
		});
	});
};

// Handle item create on POST.
exports.item_create_post = [
	body('name').trim().isLength({ min: 1 }).escape(),
	body('stock').trim().isLength({ min: 1 }).escape(),
	body('price').trim().isLength({ min: 1 }).escape(),
	body('description').trim().isLength({ min: 1 }).escape(),
	body('category').trim().isLength({ min: 1 }).escape(),
	body('trailer_url').trim().isLength({ min: 1 }).escape(),
	body('image_url').trim().isLength({ min: 1 }).escape(),

	(req, res, next) => {
		const errors = validationResult(req);
		const item = new Item({
			name: req.body.name,
			description: req.body.description,
			stock: req.body.stock,
			price: req.body.price,
			category: req.body.category,
			trailer_url: req.body.trailer_url,
			image_url: req.body.image_url
		});

		if (!errors.isEmpty()) {
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

					res.render('item/item_form', {
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
							designatedCategory = category;
							item.category = designatedCategory;

							item.save(function (err) {
								if (err) {
									return next(err);
								}

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
		if (err) {
			return next(err);
		}

		if (item === null) {
			// No results
			res.redirect('/home/categories');
		}

		// Successful, so render.
		res.render('item/item_delete', {
			title: 'Delete Item',
			item: item
		});
	});
};

// Handle item delete on POST.
exports.item_delete_post = function (req, res, next) {
	Item.findById(req.params.id).exec(function (err) {
		if (err) {
			return next(err);
		}

		// Category has video games. Delete object and redirect to the list of categories.
		Item.findByIdAndRemove(req.params.id, function (err) {
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

		async.parallel(
			{
				category: function (callback) {
					Category.findById(item.category).exec(callback);
				},
				category_list: function (callback) {
					Category.find().exec(callback);
				}
			},
			function (err, results) {
				if (err) {
					return next(err);
				}

				if (results === null) {
					// No results.
					const err = new Error('Categories not found');
					err.status = 404;
					return next(err);
				}

				item.category = results.category;

				// Successful, so render.
				res.render('item/item_form', {
					item: item,
					title: 'Update Item',
					errors: null,
					category_list: results.category_list
				});
			}
		);
		// Category.findById(item.category).then((category) => {
		// 	item.category = category;
		// 	Category.find().exec(function (err, category_list) {
		// res.render('item/item_form', {
		// 	item: item,
		// 	title: 'Update Item',
		// 	errors: null,
		// 	category_list: null
		// });
	});
};
// };

// Handle item update on POST.
exports.item_update_post = [
	body('name').trim().isLength({ min: 1 }).escape(),
	body('stock').trim().isLength({ min: 1 }).escape(),
	body('price').trim().isLength({ min: 1 }).escape(),
	body('description').trim().isLength({ min: 1 }).escape(),
	body('category').trim().isLength({ min: 1 }).escape(),
	body('trailer_url').trim().isLength({ min: 1 }).escape(),
	body('image_url').trim().isLength({ min: 1 }).escape(),

	(req, res, next) => {
		const errors = validationResult(req);
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

		Category.find({ name: req.body.category }).then((results) => {
			item.category = results[0];

			if (!errors.isEmpty()) {
				res.render('item/item_form', {
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
							return next(err);
						}
						// Successful - redirect to item detail page.
						res.redirect(theitem.url);
					}
				);
			}
		});
	}
];
