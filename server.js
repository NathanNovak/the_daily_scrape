
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

var app = express();
var PORT = process.env.PORT || 3000;

// // Scraping tools
// var axios = require("axios");
// var request = require("request");
// var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static("public"));

// Handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Connect Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/dailyScrape";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var routes = require("./controllers/scrapeController.js");
app.use(routes)

var syncOptions = {force: false};

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
app.listen(PORT, function() {
  console.log(
    "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
    PORT,
    PORT
  );
});

// module.exports = app;
