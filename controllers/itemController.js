const Item = require('../models/item');

// Display detail page for an specific item
exports.item_detail = function (req, res) {
	console.log('HERE ');
	// res.send('Not implemented', req.params.id);
	res.status(200).send('Not implemented: ' + req.params.id);
};

// Display item create form on GET.
exports.item_create_get = function (req, res) {
	res.send('NOT IMPLEMENTED: item create GET');
};

// Handle item create on POST.
exports.item_create_post = function (req, res) {
	res.send('NOT IMPLEMENTED: item create POST');
};

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
