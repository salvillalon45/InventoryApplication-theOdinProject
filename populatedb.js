#! /usr/bin/env node

console.log(
	'This script populates some test books, authors, genres and bookinstances to your database'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Item = require('./models/item');
var Category = require('./models/category');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = [];
var categories = [];

function itemCreate(
	name,
	stock,
	price,
	description,
	category,
	trailer_url,
	image_url,
	cb
) {
	var itemDetail = {
		name,
		stock,
		price,
		description,
		category,
		trailer_url,
		image_url
	};
	var item = new Item(itemDetail);

	item.save(function (err) {
		if (err) {
			console.log('error in item create');
			console.log(err);
			cb(err, null);
			return;
		}
		console.log('New item: ' + item);
		console.log(item);
		items.push(item);
		cb(null, item);
	});
}

function categoryCreate(name, description, cb) {
	var category = new Category({ name, description });

	category.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log('New category: ' + category);
		console.log(category);
		categories.push(category);
		cb(null, category);
	});
}

function createItems(cb) {
	async.parallel(
		[
			function (callback) {
				itemCreate(
					'Pokemon Ultra Moon',
					100,
					'$39.99',
					'The game after Moon',
					// 'Nintendo 3DS',
					categories[0],
					'https://www.youtube.com/',
					'https://www.youtube.com/',
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Pokemon Crystal',
					100,
					'$39.99',
					'CRYSTAL',
					// 'Game Boy Color',
					categories[1],
					'https://www.youtube.com/',
					'https://www.youtube.com/',
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Golden Sun',
					100,
					'$39.99',
					'Great RPG Game',
					// 'Game Boy Advance',
					categories[2],
					'https://www.youtube.com/',
					'https://www.youtube.com/',
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Pokemon Sword',
					100,
					'$59.99',
					'The game for switch',
					// 'Nintendo Switch',
					categories[3],
					'https://www.youtube.com/',
					'https://www.youtube.com/',
					callback
				);
			},
			function (callback) {
				itemCreate(
					'The Legend of Zelda: Twilight Princess',
					100,
					'$39.99',
					'Great ZELDA',
					// 'Nintendo Wii',
					categories[4],
					'https://www.youtube.com/',
					'https://www.youtube.com/',
					callback
				);
			}
		],
		// optional callback
		cb
	);
}

function createCategory(cb) {
	async.parallel(
		[
			function (callback) {
				categoryCreate('Nintendo 3DS', 'The 3ds console!', callback);
			},
			function (callback) {
				categoryCreate(
					'Game Boy Color',
					'The Game Boy console!',
					callback
				);
			},
			function (callback) {
				categoryCreate(
					'Game Boy Advance',
					'The Game Boy Advance console!',
					callback
				);
			},
			function (callback) {
				categoryCreate(
					'Nintendo Switch',
					'The nintendo newest',
					callback
				);
			},
			function (callback) {
				categoryCreate(
					'Nintendo Wii',
					'The nintendo in 2007',
					callback
				);
			}
		],
		// Optional callback
		cb
	);
}

async.series(
	[createCategory, createItems],
	// Optional callback
	function (err, results) {
		if (err) {
			console.log('FINAL ERR: ' + err);
		} else {
			console.log('What are the results');
			console.log(results);
		}

		// All done, disconnect from database
		mongoose.connection.close();
	}
);
