const Item = require('../models/item');

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
		title: 'Create A New Item'
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

		// Create a Category object with escaped and trimmed data
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
			// There are errors. Render the form again with sanitized
			// values/error messages
			res.render('item_form', {
				title: 'Create A New Item',
				item: item,
				errors: errors.array()
			});
		} else {
			// Data from form is valid
			// Check if Category with the same name already exists
			Item.findOne({ name: req.body.name }).exec(function (
				err,
				found_item
			) {
				if (err) {
					return next(err);
				}

				if (found_item) {
					// Category exists, redirect to its detail page
					console.log('Item exists, redirect to its detail page');

					res.redirect(found_item.url);
				} else {
					item.save(function (err) {
						if (err) {
							return next(err);
						}
						console.log('Going to redirect');
						console.log('what is url');
						console.log(item.url);
						console.log('/home' + category.url);
						res.redirect(item.url);
					});
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
