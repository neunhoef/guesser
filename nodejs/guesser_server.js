#!/usr/bin/env nodejs

var fs = require("fs");

// Make sure we have the collection available:
var arango = require("arango");
var db = new arango.Connection("http://localhost:8529");
var questions = null;
var promise = db.collection.get("dev_guesser_questions")
  .then(function(q) { questions = q; },
        function(q) { console.error("Cannot find collection."); });
                      // process.exit(1); });

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/index.html', function (req, res) {
  res.sendFile("index.html", {root: "."});
});

app.get('/bg.png', function (req, res) {
  res.set("Content-Type", "image/png");
  res.sendFile("bg.png", {root: "."});
});

app.get('/base.css', function (req, res) {
  res.set("Content-Type", "text/css");
  res.sendFile("base.css", {root: "."});
});

app.get('/angular.min.js', function (req, res) {
  res.set("Content-Type", "appication/javascript");
  res.sendFile("angular.min.js", {root: "."});
});

app.get('/get/:key', function (req, res) {
  if (questions === null) {
    throw "No contact to database.";
  }
  var key = req.parameter["key"];
  console.log("key is ", key);

});

var server = app.listen(8000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})

