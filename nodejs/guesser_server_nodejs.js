#!/usr/bin/env nodejs

////////////////////////////////////////////////////////////////////////////////
/// Libraries and database driver
////////////////////////////////////////////////////////////////////////////////

var fs = require("fs");
var concat = require("concat-stream");
var arango = require("arango");
var db = new arango.Connection("http://localhost:8529"); // configure server
db = db.use("/_system");                                 // configure database
var collectionName = "dev_guesser_questions";            // configure collection

////////////////////////////////////////////////////////////////////////////////
/// An express app:
////////////////////////////////////////////////////////////////////////////////

var express = require('express');
var app = express();

////////////////////////////////////////////////////////////////////////////////
/// Static content:
////////////////////////////////////////////////////////////////////////////////

function installStatic (filename, contenttype) {
  app.get("/"+filename, function (req, res) {
    res.type(contenttype);
    res.sendFile(filename, {root: "."});
  });
}

installStatic("index.html", "text/html");
installStatic("bg.png", "image/png");
installStatic("base.css", "text/css");
installStatic("angular.min.js", "application/javascript");
installStatic("guesser_controller.js", "application/javascript");

////////////////////////////////////////////////////////////////////////////////
/// AJAX services:
////////////////////////////////////////////////////////////////////////////////

app.get("/get/:key", function (req, res) {
  var key = req.param("key");
  db.document.get(collectionName+"/"+key)
    .done( function(data) {
             res.json(data);
           },
           function(err) {
             res.json(err);
           } );
});

// This is just a trampoline to the Foxx app:
app.put("/put", function (req, res) {
  req.pipe(concat( function(body) {
    db.put("/dev/guesser/put", JSON.parse(body.toString()))
      .done(function(result) {
        res.send(result);
      });
  }));
});

////////////////////////////////////////////////////////////////////////////////
/// Now finally make the server:
////////////////////////////////////////////////////////////////////////////////

var server = app.listen(8000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Guesser app server listening at http://%s:%s', host, port)
});
