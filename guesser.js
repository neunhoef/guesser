////////////////////////////////////////////////////////////////////////////////
/// A learning guessing game
/// by Max Neunhöffer
/// Copyright 2014, ArangoDB GmbH, Cologne, Germany
////////////////////////////////////////////////////////////////////////////////

(function () {
  "use strict";
  var Foxx = require("org/arangodb/foxx"),
      ArangoError = require("org/arangodb").ArangoError,
      controller = new Foxx.Controller(applicationContext);

  var coll = applicationContext.collection("questions");

  // Get all current entries:
  controller.get('/get/:key', function (req, res) {
    require("console").log("get/"+req.urlParameters["key"]+" called");
    var d;
    try {
      d = coll.document(req.urlParameters["key"]);
      res.json(d);
    }
    catch (e) {
      res.json(e);
    }
  });

}());

