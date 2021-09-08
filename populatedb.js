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

function categoryCreate(name, description, image_url, cb) {
	var category = new Category({ name, description, image_url });

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
					'A new light shines on the Alola region! Take on the role of a Pokemon Trainer and encounter Pokemon, uncover new tales, and Unravel the mystery behind the two forms reminiscent of the legendary Pokemon. These new titles power up the Pokemon Sun and Pokemon moon content with new story additions and features, earning them the name “ultra!” another adventure is about to begin!',
					// 'Nintendo 3DS',
					categories[0],
					'https://youtu.be/N--MPAhxb50',
					'https://m.media-amazon.com/images/I/813LRbp3EkL._SL1500_.jpg',
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Pokemon Crystal',
					100,
					'$39.99',
					'Originally released for the Game Boy™ Color system in 2000, the Pokémon™ Crystal game added several new features to the Pokémon franchise. For the first time, players could choose a female or male character, Pokémon battles featured animation, and more. And now, this Virtual Console release invites you to explore the Johto region again—or for the first time.',
					// 'Game Boy Color',
					categories[1],
					'https://upload.wikimedia.org/wikipedia/en/a/af/Pokemon_Crystal_Box.png',
					'https://youtu.be/4RA_cS4aXUY',
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Golden Sun',
					100,
					'$39.99',
					"In a dark time, an epic adventure dawns… Alchemy served in the building of Weyard's great civilizations. But when war began to consume the land, the power of Alchemy was sealed into four Elemental Stars. Forces of darkness are now pursuing the lost art of Alchemy, and as they draw ever closer to their foul purpose, mankind hangs in the balance. You and your companions are the last hope. Use noble weapons, magical Psynergy and elemental creatures known as Djinn for the upper hand in dangerous battles. Combining Djinn in different ways will allow you to create powerful spells and attacks against deadly foes. Can you prevent the oncoming darkness?",
					// 'Game Boy Advance',
					categories[2],
					'https://youtu.be/XYFJCXcdhb0',
					'https://m.media-amazon.com/images/I/61X40TFMPTL.jpg',
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Pokemon Sword',
					100,
					'$59.99',
					'A new generation of Pokémon is coming to the Nintendo Switch™ system. Begin your adventure as a Pokémon Trainer by choosing one of three new partner Pokémon: Grookey, Scorbunny, or Sobble. Then embark on a journey in the new Galar region, where you’ll challenge the troublemakers of Team Yell, while unraveling the mystery behind the Legendary Pokémon Zacian and Zamazenta! Explore the Wild Area, a vast expanse of land where the player can freely control the camera. Team up with three other players locally or online in the new multiplayer co-op Max Raid Battles* in which players will face off against gigantic and super-strong Pokémon known as Dynamax Pokémon.',
					// 'Nintendo Switch',
					categories[3],
					'https://youtu.be/uBYORdr_TY8',
					'https://m.media-amazon.com/images/I/81F1eKUToxL._SL1500_.jpg',
					callback
				);
			},
			function (callback) {
				itemCreate(
					'The Legend of Zelda: Twilight Princess',
					100,
					'$39.99',
					'A dark force, shrouded in twilight, has invaded the vast land of Hyrule. To restore light to the world, team up with the mysterious creature Midna and embrace the darkness to transform into a divine wolf. Fight through labyrinthine dungeons, survive puzzling traps and meet a cast of characters you’ll never forget in this legendary Zelda™ adventure.',
					// 'Nintendo Wii',
					categories[4],
					'https://youtu.be/CPmR2kAvrqo',
					'https://m.media-amazon.com/images/I/519LgOv9z7L.jpg',
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
				categoryCreate(
					'Nintendo 3DS',
					"The Nintendo 3DS is a handheld game console produced by Nintendo. It was announced in March 2010 and unveiled at E3 2010 as the successor to the Nintendo DS. The system features backward compatibility with older Nintendo DS video games. As an eighth-generation console, its primary competitor was Sony's PlayStation Vita.",
					'https://upload.wikimedia.org/wikipedia/commons/0/0a/Nintendo-3DS-AquaOpen.png',
					callback
				);
			},
			function (callback) {
				categoryCreate(
					'Game Boy Color',
					'The Game Boy Color (commonly abbreviated as GBC) is a handheld game console, manufactured by Nintendo, which was released in Japan on October 21, 1998 and to international markets that November. It is the successor to the Game Boy and is part of the Game Boy family.',
					'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Nintendo-Game-Boy-Color-FL.png/651px-Nintendo-Game-Boy-Color-FL.png',
					callback
				);
			},
			function (callback) {
				categoryCreate(
					'Game Boy Advance',
					'The Game Boy Advance[a] (GBA) is a 32-bit handheld game console developed, manufactured and marketed by Nintendo as the successor to the Game Boy Color. It was released in Japan on March 21, 2001, in North America on June 11, 2001, in the PAL region on June 22, 2001, and in mainland China as iQue Game Boy Advance on June 8, 2004. The GBA is part of the sixth generation of video game consoles. The original model does not have an illuminated screen; Nintendo addressed that with the release of a redesigned model with a frontlit screen, the Game Boy Advance SP, in 2003. A newer revision of the redesign was released in 2005, with a backlit screen. Around the same time, the final redesign, the Game Boy Micro, was released in September 2005.',
					'https://upload.wikimedia.org/wikipedia/commons/7/7d/Nintendo-Game-Boy-Advance-Purple-FL.jpg',
					callback
				);
			},
			function (callback) {
				categoryCreate(
					'Nintendo Switch',
					'The Nintendo Switch[h] is a video game console developed by Nintendo and released worldwide in most regions on March 3, 2017. The console itself is a tablet that can either be docked for use as a home console or used as a portable device, making it a hybrid console. Its wireless Joy-Con controllers, with standard buttons and directional analog sticks for user input, motion sensing, and tactile feedback, can attach to both sides of the console to support handheld-style play.',
					'https://upload.wikimedia.org/wikipedia/commons/8/88/Nintendo-Switch-wJoyCons-BlRd-Standing-FL.jpg',
					callback
				);
			},
			function (callback) {
				categoryCreate(
					'Nintendo Wii',
					"The Wii (/wiː/ WEE) is a home video game console developed and marketed by Nintendo. It was first released on November 19, 2006, in North America and in December 2006 for most other regions. It is Nintendo's fifth major home game console, following the GameCube, and is a seventh generation home console alongside Microsoft's Xbox 360 and Sony's PlayStation 3.",
					'https://upload.wikimedia.org/wikipedia/commons/1/14/Wii-console.jpg',
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
		console.log('What are results:');
		console.log(results);
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
