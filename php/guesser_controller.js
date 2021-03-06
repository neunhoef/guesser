var app = angular.module("guesser", []);

app.controller("guesserController", function ($scope, $http) {
  $scope.name = "";

  $scope.restart = function () {
    $scope.currentKey = "root";
    $http.get("get/root")
      .success(function(response) {
                 console.log(response);
                 $scope.current = response;
               })
      .error(function(response) {
               console.log(response);
               $scope.current = {};
               alert("AJAX call failed");
             });
      $scope.view = "welcome";
  }

  $scope.restart();

  $scope.update = function () {
    if (! $scope.current.isLeaf) {
      $scope.theQuestion = $scope.current.question;
      $scope.theAnswer1 = $scope.current.answer1;
      $scope.theAnswer2 = $scope.current.answer2;
      $scope.view = "question";
    }
    else {
      $scope.theGuess = $scope.current.guess;
      $scope.guessedRight = false;
      $scope.view = "guess";
    }
  }

  $scope.answer = function (newkey) {
    $http.get("get/"+newkey)
      .success(function(response) {
                 console.log(response);
                 $scope.current = response;
                 $scope.currentKey = newkey;
                 $scope.update();
               })
      .error(function(response) {
               console.log(response);
               alert("AJAX call failed");
             });
  }
    
  $scope.yes = function () {
    $scope.guessedRight = true;
  }

  $scope.no = function () {
    $scope.oldThing = $scope.current.guess;
    $scope.userThing = "";
    $scope.userQuestion = "";
    $scope.answerOld = "";
    $scope.answerNew = "";
    $scope.confirmed = false;
    $scope.view = "learning";
  }

  $scope.submit = function () {
    if ($scope.answerOld === $scope.answerNew ||
        $scope.answerOld === "" ||
        $scope.answerNew === "") {
      alert("Old and new answer must be different and not empty");
      return;
    }
    if ($scope.userQuestion[$scope.userQuestion.length-1] !== "?") {
      $scope.userQuestion += "?";
    }
    var a = { oldLeaf: $scope.current._key,
              oldLeafRev: $scope.current._rev,
              newQuestion: {
                question: $scope.userQuestion,
                answer1:  $scope.answerOld,
                answer2:  $scope.answerNew,
                goto1:    $scope.current._key,
                isLeaf:   false
              },
              newLeaf: { 
                isLeaf: true,
                guess: $scope.userThing
              }
            };
    $http.put("put", a)
      .success(function(response) {
                 console.log(response);
                 if (response.error === true) {
                   alert("Could not submit new question! "+
                         "This leaf was already modified!");
                   $scope.restart();
                 }
                 else {
                   $scope.confirmed = true;
                 }
               })
      .error(function(response) {
               console.log(response);
               alert("AJAX call failed, cannot update");
             });
  }
});

