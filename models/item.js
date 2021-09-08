const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	stock: {
		type: Number,
		required: true
	},
	price: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
		required: true
	},
	trailer_url: {
		type: String,
		required: true
	},
	image_url: {
		type: String,
		required: true
	}
});

ItemSchema.virtual('url').get(function () {
	return '/home/item/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);
