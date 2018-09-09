var express = require('express');
var router = express.Router();

// Scraping tools
var axios = require("axios");
var request = require("request");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

router.get("/", function(req, res) {

	db.Article.find({saved: false}).then(function(dbArticles) {
				
		console.log("Unsaved Articles", dbArticles);
		res.render('index', {articles: dbArticles});
	})
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
						// db.Article.countDocuments({}, function(err, count) {
						// 	if (err) throw err;
						// 	else console.log('there are %d articles in DB', count);
						// });		
						res.send("Scrape Complete");
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
	}).populate("note")
	.then(function(article) {
		console.log("ARTICLE", article);
		res.json(article);
	})  .catch(function(err) {
		// If an error occurred, send it to the client
		res.json(err);
	});
})

router.post("/articles/:id", function (req, res){
console.log("Note", req.body);

	db.Notes.create(req.body).then(function (dbNote){
		console.log(dbNote);
		return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
	}).then(function(dbArticle){
		res.json(dbArticle);
	}).catch(function(err){
		console.log(err);
	})
})

router.get("/saved", function(req, res) {
	db.Article.find({saved: true}).then(function(dbArticles) {
		console.log("DOCS with value of true", dbArticles);

		res.render("saved", {articles: dbArticles});
	})
})

router.get("/saved/:id", function(req, res) {
	var request = req.params.id;
	var id = {_id: request}
	db.Article.findOneAndUpdate(id, {$set: {saved: true}}, function(err, doc) {
		if (err) throw err;
		else {
			// console.log("HEHEHE", request)
			res.json(doc)
		}
		console.log("SAVED VALUE", doc);
	})

})

// Delete the article from the DB
router.get("/delete/:id", function(req, res) {
	var request = req.params.id;
	var id = {_id: request}
	db.Article.findOneAndDelete(id, function(err, doc) {
		if (err) throw err;
		else {
			// console.log("HEHEHE", request)
			res.json(doc)
		}
		console.log("Deleted VALUE", doc);
	})
})

// Delete the note from the DB
router.get("/delete-note/:id", function(req, res) {
	var request = req.params.id;
	console.log("request", request)
	var id = {_id: request}
	db.Notes.findOneAndDelete(id, function(err, doc) {
		if (err) throw err;
		else {
			console.log("HEHEHE", doc)
			res.json(doc)
		}
		console.log("Deleted VALUE", doc);
	})
})

module.exports = router;