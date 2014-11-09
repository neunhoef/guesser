(function() {
  "use strict";
  var console = require("console"),
      db = require("org/arangodb").db,
      collname = applicationContext.collectionName("questions");

  if (db._collection(collname) === null) {
    db._create(collname);
  } else if (applicationContext.isProduction) {
    console.warn("collection '%s' already exists. Leaving it untouched.", collname);
  }
}());
