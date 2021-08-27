function createVideoGameCards(videoGamesArray) {
	let cols = [];
	let rows = [];
	let counter = 0;

	for (let i = 0; i < videoGamesArray.length; i++) {
		console.log({ i });
		cols.push(
			"<div class='card' style='width: 18rem'><img src='...' class='card-img-top' alt='...' /><div class='card-body'><h5 class='card-title'>Card title</h5><p class='card-text'>Some quick example text to build on the card title and make up thebulk of the card's content.</p><a href='#' class='btn btn-primary'>Go somewhere</a></div></div>"
		);

		if ((counter + 1) % 3 === 0) {
			rows.push(cols);
		}

		counter += 1;
		console.log({ counter });
	}

	if (videoGamesArray.length === 1) {
		rows.push(
			"<div class='card' style='width: 18rem'><img src='...' class='card-img-top' alt='...' /><div class='card-body'><h5 class='card-title'>Card title</h5><p class='card-text'>Some quick example text to build on the card title and make up thebulk of the card's content.</p><a href='#' class='btn btn-primary'>Go somewhere</a></div></div>"
		);
	}

	console.log(rows);
	return rows;
}

module.exports = {
	createVideoGameCards: createVideoGameCards
};
