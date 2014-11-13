<?php
require("vendor/autoload.php");

// set up some aliases for less typing later
use triagens\ArangoDb\Connection as ArangoConnection;
use triagens\ArangoDb\ConnectionOptions as ArangoConnectionOptions;
use triagens\ArangoDb\Statement as ArangoStatement;
use triagens\ArangoDb\DocumentHandler as ArangoDocumentHandler;
use triagens\ArangoDb\Document as ArangoDocument;

$connectionOptions = array(
    ArangoConnectionOptions::OPTION_ENDPOINT => 'tcp://127.0.0.1:8529'
  );

$connection = new ArangoConnection($connectionOptions);

$app = new \Slim\Slim();

$app->get('/get/:key', function($key) {
  global $connection;
  global $app;

  $handler = new ArangoDocumentHandler($connection);

  // get a new document:
  $node = new ArangoDocument();
  $nodeFromServer = $handler->get('guesser_questions', $key);
  $app->response->headers->set('Content-Type', 'application/json');
  $app->response->setBody(
        $nodeFromServer->toJson(array( "_includeInternals" => True)));
});

$app->put('/put', function() {
  global $connection;
  global $app;

  // pass the document on to the Foxx service:
  $body = $app->request->getBody();
  $result = $connection->put("/guesser/put", $body);
  $app->response->headers->set('Content-Type', 'application/json');
  $app->response->setBody($result->getBody());
});

$app->run();

