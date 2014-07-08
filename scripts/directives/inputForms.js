'use strict';

APP.directive('twoPointForm',function(){
	return{
		restrict:'E',
		templateUrl:'templates/formTwoPoints.html',
		replace:true,
		link: function(scope,ele,attrs,c){
			
		}
	}
});

APP.directive('onePointForm',function(){
	return{
		restrict:'E',
		templateUrl:'templates/formOnePoint.html',
		replace:true,
		link: function(scope,ele,attrs,c){
			
		}
	}
});

APP.directive('dimensionForm',function(){
	return{
		restrict:'E',
		templateUrl:'templates/formDimensions.html',
		replace:true,
		link: function(scope,ele,attrs,c){
			
		}
	}
});

APP.directive('twoPointWidth',function(){
	return{
		restrict:'E',
		templateUrl:'templates/formTwoPointsWidth.html',
		replace:true,
		link: function(scope,ele,attrs,c){
			
		}
	}
});

APP.directive('jdsConfirm',function(){
	return{
		restrict:'E',
		templateUrl:'templates/saveOrReject.html',
		replace:true,
		link: function(scope,ele,attrs,c){
			
		}
	}
});

