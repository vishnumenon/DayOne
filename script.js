var dayOneApp = angular.module('dayOneApp', ['ngRoute', 'ngTouch']);

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

dayOneApp.controller('courseListController', ['$scope', '$http', function($scope, $http) {
	$scope.courses = [
		{name: 'CS 201: Data Structures and Algorithms', average: 10}
	]
	$scope.addCourse = function() {
		if($scope.courseName) {
			$scope.courses.push({name: $scope.courseName, average: 0});
			$scope.courseName = '';
		}
	}
	$scope.removeCourse = function(i) {
		$scope.courses.splice(i, 1);
	}
}]);

dayOneApp.controller('courseDetailController', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.courseId = $routeParams.courseId; 
}]);