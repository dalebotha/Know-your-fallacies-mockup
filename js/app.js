'use strict';

var Fallacy = angular.module('Fallacy',[]);

Fallacy.config(function ($routeProvider) {
	$routeProvider	
		.when('/',
		{
			templateUrl: '/partials/home.html'
		})
		.when('/about',
		{
			templateUrl:'/partials/about.html'
		})
		.otherwise({redirectTo: '/'});
})
.directive('showQuestion', function( $compile ){
  return {
    scope:true,
    link: function (scope,element,attrs) {
      var elem;
      attrs.$observe('template', function (tmplt) {
        if ( angular.isDefined(tmplt) ) {
          // compile the provided template against the current scope
          elem = $compile( tmplt )( scope );

          // stupid way of emptying the element
          element.html("");
          console.log(elem);
          // add the template content
          element.append( elem );
        }
      });
    }
  };
})
.factory('questionHandler', function() {
	return function () {
		var questionData = [
			"Appeal to Probabilty",
			"Considering that something is certain when it is only possible/probable",
			"A is possible/probable therefore A is absolute",
			"There are so many religions so one of them has to be the right one",
			"There are many hackers that spread worms through the internet. Therefore, if you use the internet without a firewall, it is inevitable that you will be hacked.",
			"There are billions of galaxies with billions of stars in the universe. So there must be another planet with intelligent life on it",
			"Some other weird fallacious reason"
			
		];

		return questionData;
	}
})
.factory('questionTemplate', function() {
	return function () {
		var qString;
		qString = '<div id="question-section"><h2>1</h2><p>paragraph</p><div id="multiple-choice"><div id="left-choices"><div class="choice"></div><div class="choice"></div><div class="choice"></div></div><div id="right-choices"><div class="choice"></div><div class="choice"></div><div class="choice"></div></div></div></div>';
		return qString;
	}
})

.controller("questionController", function ($scope, $http, $timeout, $element, questionHandler,questionTemplate) {
	
	$scope.show = false;
	$scope.quizStarted = true;

	$scope.displayQuestion = false;
	$scope.showProgress = true;

	var mytimeout;

	$scope.chooseDifficulty = function() {
		$scope.show = true;
		$scope.hideStart = true;
		$scope.quizStarted = false;
	}

	$scope.counter = 3;
	
    $scope.onTimeout = function(){
        
        if ($scope.counter == 0) {
        	$scope.showCountDown = false;
        	$scope.startQuiz();
        } else {
			mytimeout = $timeout($scope.onTimeout,1000);
		}
		$scope.counter--;
    }
    
    $scope.start = function() {
		mytimeout = $timeout($scope.onTimeout,1000);
    }
    
    $scope.startCountdown = function(e) {

		if ($scope.quizStarted === false) {
	    	var elem = angular.element(e.srcElement);
	    	$scope.selectedDifficulty = elem.attr('id');
	    	//elem.parent().children().removeClass('level-border-true');
	    	elem.css('border-bottom','3px #F87431 solid');
	    	console.log(elem.attr('id'));
	    	$scope.show = false;
	    	$scope.quizStarted = true;
	    	$scope.showCountDown = true;
	    	$scope.onTimeout();

		};
    }
	
    $scope.startQuiz = function() {

    	console.log('time is zero!');

    	$scope.setupQuestions($scope.selectedDifficulty);
    }

    $scope.setupQuestions = function(diff) {
    	$scope.showProgress =false;
    	console.log("Difficulty: " + diff);
    	console.log("showProgress: " + $scope.showProgress);

    	
    	$timeout(function() {
    		console.log(questionHandler());
    		$scope.question = questionHandler();
    		console.log(questionTemplate());
    		$scope.qTemplate = questionTemplate();
    	}, 1000);

    }
	
	$http.get('/data/fallacies.json')
		.then(function(fallacies) { 
			$scope.fallacyList = fallacies.data;
		});	
});



  