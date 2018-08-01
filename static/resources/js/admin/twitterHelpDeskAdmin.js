var app = angular.module('twitterHelpDeskAdminApp', ['ui.router']);
  
  
  app.config(['$stateProvider', '$urlRouterProvider', 
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url : '/login',
        templateUrl : 'login.html',
        controller : 'LoginController'
      })
      .state('home', {
        url : '/home',
        templateUrl : 'home.html',
        controller : 'HomeController'
      });  
       $urlRouterProvider.otherwise('/login');
  }]);
 
  app.controller('LoginController', function($scope, $rootScope, $stateParams, $state, $http) {  
    $scope.formSubmit = function() {
		var params = {};
		params.userName = $scope.username;
		params.pass = $scope.password;
		$http.post('http://localhost:8080/api/authenticateAdmin', params).then(
			   function(response){
				 // success callback
				 debugger;
				 if(response.data[0]["count"]>0){
					$rootScope.userName = $scope.username;
					$scope.error = '';
					$scope.username = '';
					$scope.password = '';
					$state.transitionTo('home');
				 }else{
					 $scope.error = "Incorrect username/password !";
				 }
			   }, 
			   function(error){
				 console.log(error);
				 $scope.error = "Incorrect username/password !";
			   }
			); 
    };    
  });
 app.controller('HomeController', 
  function($scope, $rootScope, $stateParams, $state) {
    $scope.user = $rootScope.userName;
    
  });
