'use strict';

APP.directive('kineticCanvas',['$timeout',function($timeout){
	return{
		restrict:'A',
        scope:{
        	isZoomed: '=',
        	tunnels: '=',
        	locations: '=',
        	stairs: '='
        },
		link: function(scope,ele,attrs,c){
			scope.canvasSize = 1000;
			scope.rad = 400;// This should really be 500, but until we update database continue using 400; see offsetAdjustment below
			scope.tempID = 20000;// Used for new objects... objects coming from DB will use PRIMARY_ID
			var mydiv = ele[0];
			var id = attrs["id"];

			scope.kineticStage = new Kinetic.Stage({
				container: id,
				draggable:true,
				width:1000,
				height:1000
		    });
		    // Map size was enlarged AFTER a lot of data was already stored, so add 100 to all points, and continue saving as previous so it's consistent
			scope.offsetAdjustment = 100;
			
			scope.gridLayer = new Kinetic.Layer({name:'grid'});
			scope.mapLayer = new Kinetic.Layer({name:'mapLayer'});
			scope.findMeLayer = new Kinetic.Layer({name:'find'});
			scope.tooltipLayer = new Kinetic.Layer({name:'tips'});
			scope.tooltip = new Kinetic.Label({
				opacity: 0.75,
				visible: false,
				listening: false
			});

			scope.tooltip.add(new Kinetic.Tag({
				fill: 'black',
				pointerDirection: 'down',
				pointerWidth: 10,
				pointerHeight: 10,
				lineJoin: 'round',
				shadowColor: 'black',
				shadowBlur: 10,
				shadowOffset: {x:10, y:10},
				shadowOpacity: 0.2
			}));
      
			scope.tooltip.add(new Kinetic.Text({
				text: '',
				fontFamily: 'Calibri',
				fontSize: 18,
				padding: 5,
				fill: 'white'
			}));
      
			scope.tooltipLayer.add(scope.tooltip);

			scope.kineticStage.add(scope.gridLayer);
			scope.kineticStage.add(scope.mapLayer);
			scope.kineticStage.add(scope.findMeLayer);
			scope.kineticStage.add(scope.tooltipLayer);

			scope.group15 = new Kinetic.Group({x:0,y:0});
			scope.group25 = new Kinetic.Group({x:0,y:0});
			scope.group35 = new Kinetic.Group({x:0,y:0});
			scope.group45 = new Kinetic.Group({x:0,y:0});
			scope.group55 = new Kinetic.Group({x:0,y:0});
			scope.group65 = new Kinetic.Group({x:0,y:0});
			scope.group100 = new Kinetic.Group({x:0,y:0});

			scope.mapLayer.add(scope.group15);
			scope.mapLayer.add(scope.group25);
			scope.mapLayer.add(scope.group35);
			scope.mapLayer.add(scope.group45);
			scope.mapLayer.add(scope.group55);
			scope.mapLayer.add(scope.group65);
			scope.mapLayer.add(scope.group100);


			scope.kineticStage.on('mousedown', function(event) {
				/*var curPos = scope.mapLayer.getAbsolutePosition();
				var clickX = event.evt.layerX;
				var clickY = event.evt.layerY;
				var moveX = clickX * -1;
				var moveY = clickY * -1;
				var pos = {x:moveX,y:moveY};
				scope.kineticStage.scale({x:2,y:2});
				scope.kineticStage.position(pos);
				scope.kineticStage.draw();*/
			});


			scope.kineticStage.on('mouseover mousemove', function(evt) {
				var node = evt.target;
				var nodelayer = node.getLayer().name();
				var nodeID = node.id();
				if(nodeID == undefined || nodelayer == 'grid'){
					return;
				}
				//console.log("NodeID: " + nodeID + " layer: " + nodelayer);
				if (node) {
					var low = "-";
					var high = "-";
					for (var i = 0; i < scope.tunnels.length; i++) {
						//console.log(scope.tunnels[i].PRIMARY_ID);
						if (scope.tunnels[i].PRIMARY_ID == nodeID) {
							var y1 = parseInt(scope.tunnels[i].y1);
							var y2 = parseInt(scope.tunnels[i].y2);
							low = _.min([y1,y2]);
							high = _.max([y1,y2]);
						};
					};
					for (i = 0; i < scope.locations.length; i++) {
						if (scope.locations[i].PRIMARY_ID == nodeID) {
							low = scope.locations[i].y1;
						};
					};
					for (i = 0; i < scope.stairs.length; i++) {
						if (scope.stairs[i].PRIMARY_ID == nodeID) {
							var y1 = parseInt(scope.stairs[i].y1);
							var y2 = parseInt(scope.stairs[i].y2);
							low = _.min([y1,y2]);
							high = _.max([y1,y2]);
						};
					};
				// update tooltip
					var mousePos = node.getStage().getPointerPosition();
					scope.tooltip.position({x:mousePos.x, y:mousePos.y - 5});
					scope.tooltip.getText().text("ID: " + nodeID + " Level: " + low + " / " + high);
					scope.tooltip.show();
					scope.tooltipLayer.batchDraw();
				}
			}); 

			scope.kineticStage.on('mouseout', function(event) {
				scope.tooltip.hide();
				scope.tooltipLayer.draw();
			});

			drawGrid();
			scope.gridLayer.draw();

            function drawMapTopView(){
				var T = scope.tunnels;
				for (var i = 0; i < T.length; i++) {
					var obj = T[i];
					var x1 = parseInt(T[i].x1);
					var z1 = parseInt(T[i].z1);
					var x2 = parseInt(T[i].x2);
					var z2 = parseInt(T[i].z2);
					var W = parseInt(T[i].W);
					var type = T[i].subType;
					var id = parseInt(T[i].PRIMARY_ID);
					var y1 = parseInt(T[i].y1);
					var y2 = parseInt(T[i].y2);
					var Y = _.min([y1,y2]);
					if(W == 0){
						W = 2;
					}
					drawTunnel(x1,z1,x2,z2,W,type,id,Y);
				};

				var L = scope.locations;
				for (i = 0; i < L.length; i++) {
					x1 = parseInt(L[i].x1);
					z1 = parseInt(L[i].z1);
					W = parseInt(L[i].W);
					var H = parseInt(L[i].H);
					var id = parseInt(L[i].PRIMARY_ID);
					var y1 = parseInt(L[i].y1);
					type = L[i].subType;
					drawLocation(x1,z1,W,H,type,id,y1);
				};

				var S = scope.stairs;
				for (i = 0; i < S.length; i++) {
					x1 = parseInt(S[i].x1);
					z1 = parseInt(S[i].z1);
					x2 = parseInt(S[i].x2);
					z2 = parseInt(S[i].z2);
					var y1 = parseInt(S[i].y1);
					
					type = S[i].subType;
					var id = parseInt(S[i].PRIMARY_ID);
					if(type == 'stairs'){
						var y2 = parseInt(S[i].y2);
						var Y = _.min([y1,y2]);
						drawTunnel(x1,z1,x2,z2,2,type,id,Y);
					}else{
						drawLocation(x1,z1,6,6,type,id,y1);
					}
				};
				scope.mapLayer.draw();
			}

			function drawCrossHair(x1,z1){
				var config = {
					points:[x1+scope.offsetAdjustment-10,z1+scope.offsetAdjustment,x1+scope.offsetAdjustment+10,z1+scope.offsetAdjustment],
					strokeWidth:2,
					stroke:'#FF0000',
					lineCap:'round'
				}
				var line = new Kinetic.Line(config);
				scope.findMeLayer.add(line);

				var config = {
					points:[x1+scope.offsetAdjustment,z1+scope.offsetAdjustment-10,x1+scope.offsetAdjustment,z1+scope.offsetAdjustment+10],
					strokeWidth:2,
					stroke:'#FF0000',
					lineCap:'round'
				}
				var line = new Kinetic.Line(config);
				scope.findMeLayer.add(line);
				scope.findMeLayer.draw();
			};

			function drawTunnel(x1,z1,x2,z2,W,type,ID,Y1){
				var config = {
					points:[x1+scope.offsetAdjustment,z1+scope.offsetAdjustment,x2+scope.offsetAdjustment,z2+scope.offsetAdjustment],
					strokeWidth:W,
					lineCap:'round',
					lineJoin: 'round',
					id:ID
				}

				if (type == 'naturalCave' || type == 'cavern') {
					config.stroke="#AAAAAA";
				}else if(type == 'mine'){
					config.stroke="#852216";
				}else if(type == 'stairs'){
					config.stroke="#459B74";
					config.strokeWidth="4";
				}else if(type == 'rail'){
					config.stroke="#FF0000";
					config.strokeWidth="4";
				}else if(type == 'spoke'){
					config.stroke="#333333";
					config.strokeWidth="1";
				}else{
					config.stroke="#A67E4A";
				}
				var line = new Kinetic.Line(config);

				if(Y1 < 16){
					scope.group15.add(line);
				}else if(Y1 < 26){
					scope.group25.add(line);
				}else if(Y1 < 36){
					scope.group35.add(line);
				}else if(Y1 < 46){
					scope.group45.add(line);
				}else if(Y1 < 56){
					scope.group55.add(line);
				}else if(Y1 < 66){
					scope.group65.add(line);
				}else{
					scope.group100.add(line);
				}
				scope.mapLayer.draw();
				scope.findMeLayer.removeChildren();
				scope.findMeLayer.draw();
			};

			function drawLocation(x1,y1,W,H,type,ID,Y1){
				var config = {
					x:x1+scope.offsetAdjustment,
					y:y1+scope.offsetAdjustment,
					width:W,
					height:H,
					id:ID
				}
				var shape = 'rect';

				if (type == 'spawner') {
					config.fill="#FF0000";
					config.width=5;
					config.height=5;
				}else if(type == 'poi'){
					config.opacity=0.8;
					config.fill="#e77b00";
					config.radius=5;
					shape = 'circle';
				}else if(type == 'setFocal'){
					config.opacity=0.8;
					config.fill="#000000";
					config.radius=5;
					shape = 'circle';
				}else if(type == 'mineEntry'){
					config.fill="#5c029e";
					config.width=8;
					config.height=8;
				}else if(type == 'ladder'){
					config.fill="#459B74";
					config.width=6;
					config.height=6;
				}else if(type == 'cave'){
					config.x = x1-(parseInt(W/2))+scope.offsetAdjustment;
					config.y = y1-(parseInt(H/2))+scope.offsetAdjustment;
					config.opacity=0.7;
					config.fill="#98b1a6";
				}else if(type == 'stronghold'){
					config.opacity=0.5;
					config.fill="#6b5395";
				}else if(type == 'structure'){
					config.opacity=0.8;
					config.fill="#248bf2";
				}
				var obj;
				if(shape=='rect'){
					obj = new Kinetic.Rect(config);
				}else if(shape=='circle'){
					obj = new Kinetic.Circle(config);
				}

				if(Y1 < 16){
					scope.group15.add(obj);
				}else if(Y1 < 26){
					scope.group25.add(obj);
				}else if(Y1 < 36){
					scope.group35.add(obj);
				}else if(Y1 < 46){
					scope.group45.add(obj);
				}else if(Y1 < 56){
					scope.group55.add(obj);
				}else if(Y1 < 66){
					scope.group65.add(obj);
				}else{
					scope.group100.add(obj);
				}
				scope.mapLayer.draw();
				scope.findMeLayer.removeChildren();
				scope.findMeLayer.draw();
			};

            function drawBorder(x1,y1,x2,y2){
				var config = {
					points:[x1,y1,x2,y2],
					strokewidth:1,
					lineCap:'square',
					lineJoin: 'square',
					stroke: '#000000'
				}
				var borderLine = new Kinetic.Line(config);
				scope.gridLayer.add(borderLine);
			};

			function drawGridLine(x1,y1,x2,y2){
				var config = {
					points:[x1,y1,x2,y2],
					strokewidth:1,
					lineCap:'square',
					lineJoin: 'round',
					stroke: '#8cb0cc'
				}
				var gridLine = new Kinetic.Line(config);
				scope.gridLayer.add(gridLine);
			};

            function drawGrid(){
				drawGridLine(70,70,70,scope.canvasSize-70);
				//drawGridLine(200,0,200,scope.canvasSize);
				//drawGridLine(300,0,300,scope.canvasSize);
				//drawGridLine(400,0,400,scope.canvasSize);
				drawGridLine(500,70,500,scope.canvasSize-70);
				//drawGridLine(600,0,600,scope.canvasSize);
				//drawGridLine(700,0,700,scope.canvasSize);
				//drawGridLine(800,0,800,scope.canvasSize);
				drawGridLine(930,70,930,scope.canvasSize-70);
				
				drawGridLine(70,70,scope.canvasSize-70,70);
				//drawGridLine(0,200,scope.canvasSize,200);
				//drawGridLine(0,300,scope.canvasSize,300);
				//drawGridLine(0,400,scope.canvasSize,400);
				drawGridLine(70,500,scope.canvasSize-70,500);
				//drawGridLine(0,600,scope.canvasSize,600);
				//drawGridLine(0,700,scope.canvasSize,700);
				//drawGridLine(0,800,scope.canvasSize,800);
				drawGridLine(70,930,scope.canvasSize-70,930);
				//drawBorder(0,0,scope.canvasSize,0);
				//drawBorder(0,0,0,scope.canvasSize);
				//drawBorder(scope.canvasSize,scope.canvasSize,0,scope.canvasSize);
				//drawBorder(scope.canvasSize,0,scope.canvasSize,scope.canvasSize);
			};
		
			scope.$on('event:draw-new-item', function(event,formData){
				scope.tempID++;
				switch(formData.itemtype){
					case "setFocal":
						scope.focalPointX = formData.X1;
						scope.focalPointZ = formData.Z1;
						drawLocation(formData.X1,formData.Z1,formData.W,formData.H,formData.itemtype,scope.tempID,formData.Y1);
						break;
					case "spoke":
						drawTunnel(formData.X1,formData.Z1,formData.X2,formData.Z2,1,formData.itemtype,scope.tempID,formData.Y1);
						break;
					case "tunnel":
						drawTunnel(formData.X1,formData.Z1,formData.X2,formData.Z2,2,formData.itemtype,scope.tempID,formData.Y1);
						break;
					case "mine":
						drawTunnel(formData.X1,formData.Z1,formData.X2,formData.Z2,2,formData.itemtype,scope.tempID,formData.Y1);
						break;
					case "rail":
						drawTunnel(formData.X1,formData.Z1,formData.X2,formData.Z2,2,formData.itemtype,scope.tempID,formData.Y1);
						break;
					case "naturalCave":
						drawTunnel(formData.X1,formData.Z1,formData.X2,formData.Z2,formData.W,formData.itemtype,scope.tempID,formData.Y1);
						break;
					case "stairs":
						drawTunnel(formData.X1,formData.Z1,formData.X2,formData.Z2,formData.itemtype,scope.tempID,formData.Y1);
						break;
					case "findMe":
						drawCrossHair(formData.X1,formData.Z1);
						break;
					case "ladder":
						drawLocation(formData.X1,formData.Z1,formData.X2,formData.Z2,formData.itemtype,scope.tempID);
						break;
					case "mineEntry":
						drawLocation(formData.X1,formData.Z1,formData.W,formData.H,formData.itemtype,scope.tempID);
						break;
					case "spawner":
						drawLocation(formData.X1,formData.Z1,formData.W,formData.H,formData.itemtype,scope.tempID,formData.Y1);
						break;
					case "poi":
						drawLocation(formData.X1,formData.Z1,formData.W,formData.H,formData.itemtype,scope.tempID,formData.Y1);
						break;
					case "stronghold":
						drawLocation(formData.X1,formData.Z1,formData.W,formData.H,formData.itemtype,scope.tempID,formData.Y1);
						break;
					case "structure":
						drawLocation(formData.X1,formData.Z1,formData.W,formData.H,formData.itemtype,scope.tempID,formData.Y1);
						break;
					case "cave":
						drawLocation(formData.X1,formData.Z1,formData.W,formData.H,formData.itemtype,scope.tempID,formData.Y1);
						break;
					case "landmark":
					var pointList = [];
						drawLandmark(pointList,formData.itemtype,scope.tempID);
						break;
				}
			});

			function showAllGroups(){
				scope.group15.visible(true);
				scope.group25.visible(true);
				scope.group35.visible(true);
				scope.group45.visible(true);
				scope.group55.visible(true);
				scope.group65.visible(true);
				scope.group100.visible(true);
			}

			function hideAllGroups(){
				scope.group15.visible(false);
				scope.group25.visible(false);
				scope.group35.visible(false);
				scope.group45.visible(false);
				scope.group55.visible(false);
				scope.group65.visible(false);
				scope.group100.visible(false);
			}

			scope.$on('event:eraseLastDraw',function(){
				var findid = '#'+scope.tempID;
				var shape = scope.kineticStage.find(findid);
				shape.destroy();
				scope.kineticStage.draw();
			});

			scope.$on('event:reset-map-scale',function(){
				var pos = {x:0,y:0};
				scope.kineticStage.scale({x:1,y:1});
				scope.kineticStage.position(pos);
				scope.kineticStage.draw();
			});

			scope.$on('event:zoom-map-scale',function(){
				var pos = {x:0,y:0};
				scope.kineticStage.position(pos);
				scope.kineticStage.scale({x:2,y:2});
				scope.kineticStage.draw();
			});

			scope.$on('event:filter-map-layers',function(event,obj){
				hideAllGroups();
				switch(obj.value){
					case "group15":
						scope.group15.visible(true);
						break;
					case "group25":
						scope.group25.visible(true);
						break;
					case "group35":
						scope.group35.visible(true);
						break;
					case "group45":
						scope.group45.visible(true);
						break;
					case "group55":
						scope.group55.visible(true);
						break;
					case "group65":
						scope.group65.visible(true);
						break;
					case "group100":
						scope.group100.visible(true);
						break;
					case "allGroups":
						showAllGroups();
						break;
				}
				scope.mapLayer.draw();
			});

			scope.$on('dbquery-success',function(){
				$timeout(function () {
					scope.$apply(function(){
					drawMapTopView();
					});
				});	
			});
		}
	}
}]);