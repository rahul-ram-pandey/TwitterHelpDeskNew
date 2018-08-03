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
  function($scope, $rootScope, $stateParams, $state, $http) {
    debugger;
	$scope.user = $rootScope.userName;
	var metaData = {
		isUser : false,
		uName  : $scope.user
	};
	var socket = io.connect('http://localhost:8080',{query:metaData});
    $scope.getUsersList = function(){
		var params = {};
		$http.post('http://localhost:8080/api/getUsersList', params).then(
			   function(response){
				 debugger;
				 $scope.listOfUsers = response.data;
			   }, 
			   function(error){
				 console.log(error);
			   }
			); 
	};
	$scope.getChatHistory = function(user){
		debugger;
		$scope.currentSelectedUser = user.user_name;
		var params = {};
		params.userName = $scope.currentSelectedUser;
		$http.post('http://localhost:8080/api/getUserChatHistory', params).then(
		   function(response){
			 debugger;
			 $scope.chatRecordForParticularUser = response.data;
			 console.log(response.data);
		   }, 
		   function(error){
			 console.log(error);
		   }
		); 
	}
	$scope.sendDataToServer = function(){
		debugger;
		socket.emit('chat', {
			isUser     : false,
			uName      : $scope.currentSelectedUser,
			message    : $scope.textMessage,
			adminName  : $scope.user
		});
		$scope.textMessage = "";
	}
	socket.on('message',function(data){
		if($scope.currentSelectedUser == data.userName){
			$scope.chatRecordForParticularUser = data.result;
			$scope.$apply();
		}
	});
  });
