'use strict';

APP.service('sqlDb',['$http','$q',function sqlQueries($http,$q){
	var self = this;
	self.queryResult = [];
	self.tunnels = [];
	self.locations = [];
	self.stairs = [];
	
	self.queryDB = function(){
		self.queryResult = [];
		self.tunnels = [];
		self.locations = [];
		self.stairs = [];
		var deferred = $q.defer();
		$http({method: 'POST', url: 'scripts/phpsql/MinecraftGetAll.php'}).
		success(function(data, status) {
     		self.queryResult = data;
     		for (var i = 0; i < self.queryResult.length; i++) {
     			if(self.queryResult[i].primaryType == 'tunnel' ){
     				self.tunnels.push(self.queryResult[i]);
     			}else if(self.queryResult[i].primaryType == 'location'){
     				self.locations.push(self.queryResult[i]);
     			}else if(self.queryResult[i].primaryType == 'stairs'){
					self.stairs.push(self.queryResult[i]);
     			}
     		};
     		deferred.resolve(data);
	    }).
		error(function(data, status, headers, config) {
	      	self.queryResult = data;
			deferred.reject(data);
	    });

	    return deferred.promise; //return the data
	};

	self.insertData = function(dataObj){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'scripts/phpsql/MinecraftInsert.php',data:dataObj}).
		success(function(data, status, headers, config) {
			console.log("sqldb.js "+data);
     		deferred.resolve(data);
	    }).
	    error(function(data, status, headers, config) {
	    	console.log("sqldb.js "+data);
			deferred.reject(data);
	    });

	    return deferred.promise; //return the data
	}

	self.returnTunnels = function(){
		return self.tunnels;
	}
	self.returnLocations = function(){
		return self.locations;
	}

	self.returnStairs = function(){
		return self.stairs;
	}

	return self;
}]);

