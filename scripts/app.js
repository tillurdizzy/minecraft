'use strict';

var APP = angular.module('myApp', ['ui.router'])

APP.config(function($stateProvider, $urlRouterProvider) {
 	
 	$urlRouterProvider.otherwise("/main");
  	
  	$stateProvider
    	.state('main', {
      		url: "/main",
      		templateUrl: "views/main.html",
      		controller:"MainCtrl"
    	})
    
})

