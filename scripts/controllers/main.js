'use strict';

APP.controller('MainCtrl',['$scope','sqlDb', function ($scope,sqlDb) {
	$scope.tunnels = [];
	$scope.locations = [];
	$scope.stairs = [];

	// Form labels
	$scope.labelOne = "My Location";
	$scope.labelTwo = "";

	$scope.X1 = '';
	$scope.Y1 = '';
	$scope.Z1 = '';
	$scope.X2 = '';
	$scope.Y2 = '';
	$scope.Z2 = '';
	$scope.W = '5';
	$scope.H = '5';
	$scope.focalPointX = 0;
	$scope.focalPointY = 0;
	$scope.focalPointZ = 0;

	var formData = new Object();

	var DB = sqlDb;

	DB.queryDB().then(function(result){
		$scope.tunnels = DB.returnTunnels();
		$scope.locations = DB.returnLocations();
		$scope.stairs = DB.returnStairs();
		$scope.$broadcast('dbquery-success');
	});

	$scope.isZoomed = false;
	$scope.templateID = 'single';
	$scope.selectedSubAction = 'findMe';
	$scope.selectedPrimaryAction = 'findMe';
	$scope.xzOffset = 400;

	$scope.primarySelections = [
		{label:'Find Me',value:'findMe'},
		{label:'Set Focal Point',value:'setFocal'},
		{label:'Add Navigation',value:'addNav'},
		{label:'Add Location',value:'addLocation'}];

   	$scope.subNavigationSelections = [
		{label:'Mined Tunnel',value:'tunnel'},
		{label:'Abandoned Mine',value:'mine'},
		{label:'Natural Cave',value:'naturalCave'},
		{label:'Rail',value:'rail'},
		{label:'Stairs',value:'stairs'}];

	$scope.subLocationSelections = [
		{label:'Point of Interest',value:'poi'},
		{label:'Spoke',value:'spoke'},
		{label:'Mine Entry',value:'mineEntry'},
		{label:'Stronghold',value:'stronghold'},
		{label:'Structure',value:'structure'},
		{label:'Cavern',value:'cave'},
		{label:'Ladder',value:'ladder'},
		{label:'Spawner',value:'spawner'}];

	$scope.filterSelections = [
		{label:'All Layers',value:'allGroups'},
		{label:'Layers 0-15',value:'group15'},
		{label:'Layers 16-25',value:'group25'},
		{label:'Layers 26-35',value:'group35'},
		{label:'Layers 36-45',value:'group45'},
		{label:'Layers 46-55',value:'group55'},
		{label:'Layers 56-65',value:'group65'},
		{label:'Above 65',value:'group100'}];

	// Set the default model for dropdowns so the first item is not blank
	$scope.selectedLabel = $scope.primarySelections[0];
	$scope.selectedNav = $scope.subNavigationSelections[0];
	$scope.selectedLoc = $scope.subLocationSelections[0];
	$scope.selectedFilter = $scope.filterSelections[0];

   	$scope.selectPrimaryAction = function(action){
		$scope.selectedPrimaryAction = action.value;
		if($scope.selectedPrimaryAction == 'addNav'){
			$scope.selectedSubAction = 'tunnel';
			$scope.templateID = 'double';
		}else if($scope.selectedPrimaryAction == 'addLocation'){
			$scope.selectedSubAction = 'poi';
			$scope.templateID = 'dimensions';
		}else if($scope.selectedPrimaryAction == 'findMe'){
			$scope.selectedSubAction = 'findMe';
			$scope.templateID = 'single';
		}else if($scope.selectedPrimaryAction == 'setFocal'){
			$scope.selectedSubAction = 'setFocal';
			$scope.templateID = 'single';
		}
		$scope.selectedNav = $scope.subNavigationSelections[0];
		$scope.selectedLoc = $scope.subLocationSelections[0];
		configureInput();
	};

	$scope.selectSubAction = function(action){
		$scope.selectedSubAction = action.value;
		configureInput();
	}

	$scope.selectFilter = function(filter){
		//$scope.selectedGroupFilter = filter.value;
		$scope.$broadcast('event:filter-map-layers',$scope.selectedFilter);
	}

	$scope.zoomStage = function(){
		$scope.isZoomed = true;
		$scope.$broadcast('event:zoom-map-scale');
	}

	$scope.resetStage = function(){
		$scope.isZoomed = false;
		$scope.$broadcast('event:reset-map-scale');
	}

	//Labels for the input text fields
	function configureInput(){
		$scope.labelTwo = "";
		switch($scope.selectedSubAction){
			case 'findMe':
				$scope.labelOne = "My Location";
				$scope.templateID='single';
				break;
			case 'setFocal':
				$scope.labelOne = "Focal Location";
				$scope.templateID='single';
				break;
			case 'spoke':
				$scope.labelOne = "Spoke Focal";
				$scope.labelTwo = "Spoke End";
				$scope.templateID='double';
				break;
			case 'ladder':
				$scope.templateID='single';
				$scope.labelOne = "Ladder Location";
				break;
			case 'mineEntry':
				$scope.templateID='single';
				$scope.labelOne = "Mine Entry Location";
				break;
			case 'spawner':
				$scope.templateID='single';
				$scope.labelOne = "Spawner Location";
				break;
			case 'poi':
				$scope.templateID='single';
				$scope.labelOne = "POI Location";
				break;
			case 'tunnel':
				$scope.templateID='double';
				$scope.labelOne = "Tunnel Start";
				$scope.labelTwo = "Tunnel End";
				break;
			case 'rail':
				$scope.templateID='double';
				$scope.labelOne = "Rail Start";
				$scope.labelTwo = "Rail End";
				break;
			case 'naturalCave':
				$scope.templateID='doubleWidth';
				$scope.labelOne = "Cave Start";
				$scope.labelTwo = "Cave End";
				break;
			case 'mine':
				$scope.templateID='double';
				$scope.labelOne = "Mine Start";
				$scope.labelTwo = "Mine End";
				break;
			case 'stairs':
				$scope.templateID='double';
				$scope.labelOne = "Stairs Top";
				$scope.labelTwo = "Stairs Bottom";
				break;
			case 'stronghold':
				$scope.templateID='dimensions';
				$scope.labelOne = "Top Left Corner";
				$scope.labelTwo = "Dimensions";
				break;
			case 'structure':
				$scope.templateID='dimensions';
				$scope.labelOne = "Top Left Corner";
				$scope.labelTwo = "Dimensions";
				break;
			case 'cave':
				$scope.templateID='dimensions';
				$scope.labelOne = "Center Location";
				$scope.labelTwo = "Dimensions";
				break;	
		}
	};

	$scope.submitSingleForm = function(){
		formData = new Object();
		formData.itemtype = $scope.selectedSubAction;
		formData.X1 = parseInt($scope.X1) + $scope.xzOffset;
		formData.Y1 = parseInt($scope.Y1);
		formData.Z1 = parseInt($scope.Z1) + $scope.xzOffset;
		formData.X2 = 0;
		formData.Y2 = 0;
		formData.Z2 = 0;
		formData.W = 0;
		formData.H = 0;
		formData.primaryType = convertPrimaryToType();
		formData.subType = $scope.selectedSubAction;
		$scope.$broadcast('event:draw-new-item',formData);
		if($scope.selectedSubAction == 'findMe'){
			$scope.templateID='single';
			resetInputForm();
		}else{
			$scope.templateID='confirm';
		}
	};

	$scope.submitDoubleForm = function(){
		formData = new Object();
		formData.itemtype = $scope.selectedSubAction;
		formData.X1 = parseInt($scope.X1) + $scope.xzOffset;
		formData.Y1 = parseInt($scope.Y1);
		formData.Z1 = parseInt($scope.Z1) + $scope.xzOffset;
		formData.X2 = parseInt($scope.X2) + $scope.xzOffset;
		formData.Y2 = parseInt($scope.Y2);
		formData.Z2 = parseInt($scope.Z2) + $scope.xzOffset;
		formData.W = 0;
		formData.H = 0;
		formData.primaryType = convertPrimaryToType();
		formData.subType = $scope.selectedSubAction;
		$scope.$broadcast('event:draw-new-item',formData);
		$scope.templateID='confirm';	
	};

	$scope.submitNaturalCaveForm = function(){
		formData = new Object();
		formData.itemtype = $scope.selectedSubAction;
		formData.X1 = parseInt($scope.X1) + $scope.xzOffset;
		formData.Y1 = parseInt($scope.Y1);
		formData.Z1 = parseInt($scope.Z1) + $scope.xzOffset;
		formData.X2 = parseInt($scope.X2) + $scope.xzOffset;
		formData.Y2 = parseInt($scope.Y2);
		formData.Z2 = parseInt($scope.Z2) + $scope.xzOffset;
		formData.W = parseInt($scope.W);
		formData.H = 0;
		formData.primaryType = convertPrimaryToType();
		formData.subType = $scope.selectedSubAction;
		$scope.$broadcast('event:draw-new-item',formData);
		$scope.X1 = $scope.X2;
		$scope.Z1 = $scope.Z2;
		$scope.Y1 = $scope.Y2;
		$scope.X2 = '';
		$scope.Y2 = '';
		$scope.Z2 = '';
		$scope.templateID='confirm';
	};

	$scope.naturalCaveComplete = function(){
		$scope.templateID='single';
		resetInputForm();
	}

	$scope.submitDimensionForm = function(){
		formData = new Object();
		formData.itemtype = $scope.selectedSubAction;
		formData.X1 = parseInt($scope.X1) + $scope.xzOffset;
		formData.Y1 = parseInt($scope.Y1);
		formData.Z1 = parseInt($scope.Z1) + $scope.xzOffset;
		formData.X2 = 0;
		formData.Y2 = 0;
		formData.Z2 = 0;
		formData.W = parseInt($scope.W);
		formData.H = parseInt($scope.H);
		formData.primaryType = convertPrimaryToType();
		formData.subType = $scope.selectedSubAction;
		$scope.$broadcast('event:draw-new-item',formData);
		$scope.templateID='confirm';
	};

	function convertPrimaryToType(){
		var rtn = "";
		if($scope.selectedPrimaryAction == "addLocation"){
			rtn = "location";
		}else if($scope.selectedPrimaryAction == "addNav"){
			if($scope.selectedSubAction == "stairs"){
				rtn = "stairs";
			}else{
				rtn = "tunnel";
			}
		}
		return rtn;
	}

	$scope.confirmAction = function(){
		DB.insertData(formData).
		then(function(result){
			//console.log("main.js result: " + result.result + "PARAMS: " +result.params);
			if($scope.selectedSubAction == "naturalCave"){
				// Don't reset form-- continue adding another cave segment
				$scope.templateID='doubleWidth';
			}else if($scope.selectedSubAction == "setFocal"){
				$scope.focalPointX = $scope.X1;
				$scope.focalPointY = $scope.Y1;
				$scope.focalPointZ = $scope.Z1;
				$scope.templateID='double';
			}else if($scope.selectedSubAction == "mine"){
				// Clear the fields but leave the mine form
				$scope.templateID='double';
				$scope.X1 = '';
				$scope.Y1 = '';
				$scope.Z1 = '';
				$scope.X2 = '';
				$scope.Y2 = '';
				$scope.Z2 = '';
			}else if($scope.selectedSubAction == "rail"){
				$scope.templateID='double';
				$scope.X1 = $scope.X2;
				$scope.Z1 = $scope.Z2;
				$scope.Y1 = $scope.Y2;
				$scope.X2 = '';
				$scope.Y2 = '';
				$scope.Z2 = '';
			}else{
				$scope.templateID='single';
				resetInputForm();
			}
			
		},function(result){
			resetInputForm();
			//console.log("main.js error: " + result.result + "PARAMS: " +result.params);
			$scope.templateID='single';
		});
	};

	$scope.rejectAction = function(){
		$scope.templateID='single';
		resetInputForm();
		$scope.$broadcast('event:eraseLastDraw');
	}

	function resetInputForm(){
		$scope.selectedPrimaryAction = 'findMe';
		$scope.selectedSubAction = 'findMe';
		configureInput();
		$scope.selectedLabel = $scope.primarySelections[0];
		$scope.selectedNav = $scope.subNavigationSelections[0];
		$scope.selectedLoc = $scope.subLocationSelections[0];
		
		$scope.X1 = '';
		$scope.Y1 = '';
		$scope.Z1 = '';
		$scope.X2 = '';
		$scope.Y2 = '';
		$scope.Z2 = '';
		$scope.W = '5';
		$scope.H = '5';
	}
}]);
