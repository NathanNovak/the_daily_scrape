var express = require('express');
var router = express.Router();

// Scraping tools
var axios = require("axios");
var request = require("request");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

router.get("/", function(req, res) {

	db.Article.find(function(err, articles) {
		if (err) throw err;
		else {
		}
	})
	res.render('index');
})

router.get("/scrape", function(req, res) {

	// First, we grab the body of the html with request
	axios.get("http://www.tucson.com/").then(function(response) {
		// Then, we load that into cheerio and save it to $ for a shorthand selector
		var $ = cheerio.load(response.data);

		var numNewArticles = 0;
	
		// console.log("Response", response.data);
		// Now, we grab every h2 within an article tag, and do the following:
		$("h4.tnt-headline").each(function(i, element) {
			// Save an empty result object
			var result = {};

			// Add the text and href of every link, and save them as properties of the result object
			result.title = $(this)
				.children("a")
				.text();
			result.link = $(this)
				.children("a")
				.attr("href");
			console.log("LALALALALA", result);

			// Check to see if article is in database
			db.Article.findOne({link: result.link}, function(err, link) {
				// console.log("LINK", link);
				// console.log("ERR", err)
				if (!link) {

					db.Article.create(result).then(function(dbArticle) {

						numNewArticles++;

						// View the added result in the console
						console.log("Added to DB:", dbArticle.title);
						console.log("Number of new articles:", numNewArticles);

						db.Article.countDocuments({}, function(err, count) {
							if (err) throw err;
							else console.log('there are %d articles in DB', count);
						});
					})
				}
			})

				// Create a new Article using the `result` object built from scraping
				// .catch(function(err) {
				// 	// If an error occurred, send it to the client
				// 	return res.json(err);
				// });
		})

		// If we were able to successfully scrape and save an Article, send a message to the client
		res.send("Scrape Complete");
	});
});

router.get("/articles", function(req, res) {

	db.Article.find(function(err, docs) {
		// console.log("DOCS", docs);
		res.json(docs);
	})
})

router.get("/articles/:id", function(req, res) {

	db.Article.findOne({
		_id: req.params.id
	}).then(function(article) {
		console.log("ARTICLE", article);
		res.json(article);
	})
})

// router.get("/saved", function(req, res){
// 	db.Article.find(function(err, docs) {
// 		// console.log("DOCS", docs);
// 		res.json(docs);
// 	})	
// })

router.get("/saved/:id", function(req, res){
	var request = req.body;

	console.log("HEHEHE", request)
	db.Article.findOneAndUpdate(_id, {$set: {saved: true}}, function(err, doc){
		if (err) throw err;
		else {
			console.log(doc);

			// db.Saved.create(doc).then(function(dbSaved){
			// 	console.log("Saved to Saved DB:", dbSaved);

			// })
		}
	})
})


module.exports = router;