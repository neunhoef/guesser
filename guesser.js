////////////////////////////////////////////////////////////////////////////////
/// A learning guessing game
/// by Max Neunhöffer
/// Copyright 2014, ArangoDB GmbH, Cologne, Germany
////////////////////////////////////////////////////////////////////////////////

(function () {
  "use strict";
  var Foxx = require("org/arangodb/foxx"),
      ArangoError = require("org/arangodb").ArangoError,
      log = require("console").log,
      controller = new Foxx.Controller(applicationContext);

  var collName = applicationContext.collectionName("questions");
  var coll = applicationContext.collection("questions");

  // Get an entry:
  controller.get('/get/:key', function (req, res) {
    log("get/"+req.urlParameters["key"]+" called");
    var d;
    try {
      d = coll.document(req.urlParameters["key"]);
      res.json(d);
    }
    catch (e) {
      res.json(e);
    }
  });

  // Post a new question and thingy:
  controller.put('/put', function (req, res) {
    log("put called");
    var db = require("internal").db;
    var b = req.body();
    try {
      db._executeTransaction( {
        collections: {
          write: [collName]
        },
        action: function () {
          var oldLeaf = coll.document(b.oldLeaf);
          log(JSON.stringify(oldLeaf));
          var oldParent = coll.document(oldLeaf.parent);
          log(JSON.stringify(oldParent));
          b.newQuestion.parent = oldLeaf.parent;
          var newQuestion = coll.insert(b.newQuestion);
          log(JSON.stringify(newQuestion));
          b.newLeaf.parent = newQuestion._key;
          var newLeaf = coll.insert(b.newLeaf);
          log(JSON.stringify(newLeaf));
          coll.update(newQuestion._key, { goto2: newLeaf._key });
          coll.update(oldLeaf._key, {parent: newQuestion._key});
          log("Updates OK");
          if (oldParent.goto1 === b.oldLeaf) {
            coll.update(oldParent._key, { goto1: newQuestion._key });
          }
          else if (oldParent.goto2 === b.oldLeaf) {
            coll.update(oldParent._key, { goto2: newQuestion._key });
          }
          else {
            throw "Murks";
          }
        },
      });
    }
    catch (e) {
      res.json(e);
      return;
    }
    res.json({"error":false});
  });

}());

