var getSectionAverage = function(section) {
	var poss = 0;
	var tot = 0;
	for(var i =0; i < section.items.length; i++) {
		tot += section.items[i].points;
		poss += section.items[i].possiblePoints;
	}
	if(tot === 0) return 0; 
	return tot / poss;
}

var getCourseAverage = function(course) {
	var acc = 0;
	var totalsec = 0;
	var sec;
	for(var i = 0; i < course.sections.length; i++) {
		sec = course.sections[i];
		acc += getSectionAverage(sec) * (sec.weight / 100.0); 
		totalsec +=sec.weight;
	}
	return acc;
}

var getRunningCourseAverage = function(course) {
	var acc = 0;
	var totalsec = 0;
	var sec;
	for(var i = 0; i < course.sections.length; i++) {
		sec = course.sections[i];
		totalsec+=sec.weight;
	}
	for(var i = 0; i < course.sections.length; i++) {
		sec = course.sections[i];
		acc += getSectionAverage(sec) * (sec.weight / totalsec); 
	}
	return acc;
}

var dayOneApp = angular.module('dayOneApp', ['ngRoute', 'ngTouch', 'LocalStorageModule', 'ngAnimate']);

dayOneApp.config(['$routeProvider', function($routeProvider){
	$routeProvider.
		when('/courses', {
			templateUrl: 'pages/home.html',
			controller: 'courseListController'
		}).
		when('/courses/:courseId', {
			templateUrl: 'pages/course.html',
			controller: 'courseDetailController'
		}).
		otherwise({
			redirectTo: '/courses'
		});
}]);

dayOneApp.config(['localStorageServiceProvider', function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('d1');
}]);

dayOneApp.controller('courseListController', ['$scope', '$http', 'localStorageService', function($scope, $http, localStorageService) {
	$scope.pageClass = 'page-list';

	$scope.getCourseAverage = getCourseAverage;
	$scope.getRunningCourseAverage = getRunningCourseAverage;
	var coursesInStore = localStorageService.get('courses');
	$scope.courses = coursesInStore || [];
	$scope.$watch('courses', function() {
		localStorageService.set('courses', $scope.courses);
	}, true);

	$scope.toggleHomeGrades = function(){
		$(".possibleHomeGrade").toggle();
	}
	
	$scope.toggleDelete = function(){
		$(".courseStatus").toggle();
	}

	$scope.addCourse = function() {
		if($scope.courseName) {
			$scope.courses.push({
				name: $scope.courseName,
				sections: []
			});
			$scope.courseName = '';
		}
	}
	$scope.removeCourse = function(i) {
		$scope.courses.splice(i, 1);
	}
}]);

dayOneApp.controller('courseDetailController', ['$scope', '$routeParams', 'localStorageService', function($scope, $routeParams, localStorageService) {
	$scope.pageClass = 'page-details';

	$scope.predictive = false;
	$scope.getCourseAverage = getCourseAverage;
	$scope.getSectionAverage = getSectionAverage;
	$scope.getRunningCourseAverage = getRunningCourseAverage;
	$scope.courses = localStorageService.get('courses');
	$scope.course = $scope.courses[$routeParams.courseId];

	$scope.$watch('courses', function() {
		localStorageService.set('courses', $scope.courses);
	}, true);


	$scope.addSection = function() {
		if($scope.sectionName && $scope.sectionWeight) {
			$scope.course.sections.push({
				name: $scope.sectionName, 
				weight: parseFloat($scope.sectionWeight),
				items: []
			});
			$scope.sectionName = '';
			$scope.sectionWeight = null;
		}
	}
	$scope.removeSection = function(i) {
		$scope.course.sections.splice(i, 1);
	}

	$scope.itemName = {};
	$scope.itemPoints = {};
	$scope.itemPossiblePoints = {}
	$scope.addItem = function(sectionIndex) {
		if($scope.itemName[sectionIndex] && $scope.itemPoints[sectionIndex] && $scope.itemPossiblePoints[sectionIndex]) {
			console.log($scope.itemName)
			$scope.course.sections[sectionIndex].items.push({
				name: $scope.itemName[sectionIndex],
				points: parseFloat($scope.itemPoints[sectionIndex]),
				possiblePoints: parseFloat($scope.itemPossiblePoints[sectionIndex])
			});
			$scope.itemName = {};
			$scope.itemPoints = {};
			$scope.itemPossiblePoints = {}
		}
	}

	$scope.removeItem = function(secIndex, i) {
		$scope.course.sections[secIndex].items.splice(i,1);
	}

	$scope.toggleItemList = function(secIndex) {
		$("#sectionList > span:nth-child(" + (secIndex+1) + ") > ul#itemList").slideToggle();
	} 

	$scope.toggleGrade = function(){
		$(".possibleGrade").toggle();
	}

	$scope.switchView = function(){
		$(".viewMode").toggle();
		$scope.predictive = !($scope.predictive);
		$scope.course = $scope.predictive ? jQuery.extend(true, {}, $scope.courses[$routeParams.courseId]) : $scope.courses[$routeParams.courseId];
	}

	$scope.changePoints = function(secIndex, i, val) {
		console.log(secIndex + ":" + i);
		$scope.course.sections[secIndex].items[i].points += val;
	}
}]);

