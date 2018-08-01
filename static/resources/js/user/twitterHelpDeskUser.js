var app = angular.module('twitterHelpDeskUserApp', ['ui.router']);
  
  
  app.config(['$stateProvider', '$urlRouterProvider', 
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url : '/login',
        templateUrl : 'login.html',
        controller : 'LoginController'
      })
	  .state('register', {
        url : '/register',
        templateUrl : 'register.html',
        controller : 'RegisterController'
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
		$http.post('http://localhost:8080/api/authenticateUser', params).then(
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
	$scope.signUp = function() {
		$state.transitionTo('register');
	}
  });
app.controller('HomeController', function($scope, $rootScope, $stateParams, $state) {
    $scope.user = $rootScope.userName;
    
});
app.controller('RegisterController', function($scope, $stateParams, $state, $http){
	$scope.reset = function(){
		$scope.userName = $scope.password = $scope.confirmPassword = $scope.email = $scope.contactNo = $scope.address = $scope.city = $scope.pincode = null;
	}
	$scope.validateAndRegister = function(){
		var isValid = true;
		$scope.error = null;
		var emailRegex = /[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z]+/;
		var alphaRegex = /[^a-zA-Z]+/i;
		var numericRegex = /\D$/i;
		if($scope.userName==null || $scope.userName==undefined){
			isValid = false;
			$scope.showError = true;
			$scope.error = "Username cannot be blank";
		}else if($scope.password==null || $scope.password==undefined || $scope.password.length<8){
			isValid = false;
			$scope.showError = true;
			$scope.error = "Password should be atleast of 8 digits";			
		}else if($scope.password!=$scope.confirmPassword){
			isValid = false;
			$scope.showError = true;
			$scope.error = "Password and Confirm password do not match";			
		}else if($scope.email==null || $scope.email==undefined || !emailRegex.test($scope.email)){
			isValid = false;
			$scope.showError = true;
			$scope.error = "Enter the E-mail Correctly";			
		}else if($scope.contactNo==null || $scope.contactNo==undefined || $scope.contactNo.length!=10){
			isValid = false;
			$scope.showError = true;
			$scope.error = "Phone No. should be of 10 digits";			
		}else if(numericRegex.test($scope.contactNo)){
			isValid = false;
			$scope.showError = true;
			$scope.error = "Phone No. should be numeric";			
		}else if($scope.address==null || $scope.address==undefined){
			isValid = false;
			$scope.showError = true;
			$scope.error = "Please enter your address";			
		}else if($scope.city==null || $scope.city==undefined){
			isValid = false;
			$scope.showError = true;
			$scope.error = "Please enter your city";			
		}else if(alphaRegex.test($scope.city)){
			isValid = false;
			$scope.showError = true;
			$scope.error = "City cannot be numeric";
		}else if($scope.pincode==null || $scope.pincode==undefined || $scope.pincode.length!=6){
			isValid = false;
			$scope.showError = true;
			$scope.error = "Picode length should be 6";			
		}else if(numericRegex.test($scope.pincode)){
			isValid = false;
			$scope.showError = true;
			$scope.error = "Picode should be numeric";			
		}else{
			$scope.error = null;
		}
		
		
		
		if(isValid){
			debugger;	
			$scope.isProcessing = true;
			var params = {
				user_name   	: $scope.userName, 
				user_password   : $scope.password,
				email_id   		: $scope.email,
				contact_no   	: parseInt($scope.contactNo),
				address			: $scope.address,
				city 			: $scope.city,
				pincode			: parseInt($scope.pincode)
			};
			$http.post('http://localhost:8080/api/registerUser', params).then(
				   function(response){
					 debugger;
					 if(response.data.affectedRows>0){
						 $scope.showError = false;
						 $scope.reset();
					 }else{
						 $scope.error = "Something went wrong!";
						 $scope.showError = true;
					 }
					 $scope.isProcessing = false;
				   }, 
				   function(error){
					 console.log(error);
					 $scope.error = "Something went wrong!";
					 $scope.showError = true;
					 $scope.isProcessing = false;
				   }
				); 
		}
	}
	$scope.login = function() {
		$state.transitionTo('login');
	}
});
  
  
