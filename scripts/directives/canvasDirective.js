'use strict';

APP.directive('drawOnCanvas',function(){
	return{
		restrict:'A',
		link: function(scope,ele,attrs,c){
			var canvas = ele[0],
          		ctx = canvas.getContext('2d'),
          		canvasSize = 1000,
          		currentLoc = [],
          		offsetAdjustment = 100;
  				
      		scope.$on('dbquery-success',function(){
      			ctx.clearRect(0,0,canvasSize,canvasSize);
				drawMapTopView();			
			});

			


			scope.$on('event:draw-new-item', function(event,formData){
				switch(formData.itemtype){
					case "tunnel":
						drawTunnel(formData.X1,formData.Z1,formData.X2,formData.Z2,2,formData.itemtype);
						break;
					case "mine":
						drawTunnel(formData.X1,formData.Z1,formData.X2,formData.Z2,2,formData.itemtype);
						break;
					case "cavern":
						drawTunnel(formData.X1,formData.Z1,formData.X2,formData.Z2,formData.W,formData.itemtype);
						break;
					case "stairs":
						drawStairs(formData.X1,formData.Z1,formData.X2,formData.Z2,formData.itemtype);
						break;
					case "findMe":
						drawCrossHair(formData.X1,formData.Z1,formData.X2,formData.Z2);
						break;
					case "ladder":
						drawStairs(formData.X1,formData.Z1,formData.X2,formData.Z2,formData.itemtype);
						break;
					case "mineEntry":
						drawLocation(formData.X1,formData.Z1,formData.W,formData.H,formData.itemtype);
						break;
					case "spawner":
						drawLocation(formData.X1,formData.Z1,formData.W,formData.H,formData.itemtype);
						break;
					case "poi":
						drawLocation(formData.X1,formData.Z1,formData.W,formData.H,formData.itemtype);
						break;
					case "stronghold":
						drawLocation(formData.X1,formData.Z1,formData.W,formData.H,formData.itemtype);
						break;
					case "structure":
						drawLocation(formData.X1,formData.Z1,formData.W,formData.H,formData.itemtype);
						break;
					case "cave":
						drawLocation(formData.X1,formData.Z1,formData.W,formData.H,formData.itemtype);
						break;
				}
			});

          	function drawGrid(){
				drawBorder(0,0,canvasSize,0);
				drawBorder(0,0,0,canvasSize);
				drawBorder(canvasSize,canvasSize,0,canvasSize);
				drawBorder(canvasSize,0,canvasSize,canvasSize);

				drawGridLine(100,0,100,canvasSize);
				drawGridLine(200,0,200,canvasSize);
				drawGridLine(300,0,300,canvasSize);
				drawGridLine(400,0,400,canvasSize);
				drawGridLine(500,0,500,canvasSize);
				drawGridLine(600,0,600,canvasSize);
				drawGridLine(700,0,700,canvasSize);
				drawGridLine(800,0,800,canvasSize);
				drawGridLine(900,0,900,canvasSize);
				
				drawGridLine(0,100,canvasSize,100);
				drawGridLine(0,200,canvasSize,200);
				drawGridLine(0,300,canvasSize,300);
				drawGridLine(0,400,canvasSize,400);
				drawGridLine(0,500,canvasSize,500);
				drawGridLine(0,600,canvasSize,600);
				drawGridLine(0,700,canvasSize,700);
				drawGridLine(0,800,canvasSize,800);
				drawGridLine(0,900,canvasSize,900);
			};

			function drawMapTopView(){				
				drawGrid();
				var T = scope.tunnels;
				for (var i = 0; i < T.length; i++) {
					var x1 = parseInt(T[i].x1);
					var z1 = parseInt(T[i].z1);
					var x2 = parseInt(T[i].x2);
					var z2 = parseInt(T[i].z2);
					var W = parseInt(T[i].W);
					var type = T[i].subType;
					if(W == 0){
						W = 2;
					}
					drawTunnel(x1,z1,x2,z2,W,type);
				};

				var L = scope.locations;
				for (i = 0; i < L.length; i++) {
					x1 = parseInt(L[i].x1);
					z1 = parseInt(L[i].z1);
					W = parseInt(L[i].W);
					var H = parseInt(L[i].H);
					type = L[i].subType;
					drawLocation(x1,z1,W,H,type);
				};

				var S = scope.stairs;
				for (i = 0; i < S.length; i++) {
					x1 = parseInt(S[i].x1);
					z1 = parseInt(S[i].z1);
					x2 = parseInt(S[i].x2);
					z2 = parseInt(S[i].z2);					
					type = S[i].subType;
					drawStairs(x1,z1,x2,z2,type);
				};
			};

			function drawBorder(x1,y1,x2,y2){
				ctx.beginPath();
				ctx.lineCap="square";
				ctx.lineWidth=2;
				ctx.strokeStyle="#000";
				ctx.moveTo(x1,y1);
				ctx.lineTo(x2,y2);
				ctx.stroke();
			};

			function drawGridLine(x1,y1,x2,y2){
				ctx.beginPath();
				ctx.lineCap="square";
				ctx.strokeStyle="#8cb0cc";
				ctx.lineWidth=1;
				ctx.moveTo(x1,y1);
				ctx.lineTo(x2,y2);
				ctx.stroke();
			};

			function drawCrossHair(x1,y1,x2,y2){
				ctx.strokeStyle="#FF0000";
				ctx.lineWidth=1;
				ctx.moveTo(x1+offsetAdjustment,y1+offsetAdjustment);
				ctx.lineTo(x2+offsetAdjustment,y2+offsetAdjustment);
				ctx.stroke();
			};

			function drawTunnel(x1,z1,x2,z2,W,type){
				ctx.beginPath();
				if (type == 'cavern') {
					ctx.strokeStyle="#AAAAAA";
				}else if(type == 'mine'){
					ctx.strokeStyle="#852216";
				}else{
					ctx.strokeStyle="#A67E4A";
				}
				
				ctx.lineCap="round";
				ctx.lineWidth=W;
				ctx.moveTo(x1+offsetAdjustment,z1+offsetAdjustment);
				ctx.lineTo(x2+offsetAdjustment,z2+offsetAdjustment);
				ctx.stroke();
			};

			function drawLocation(x1,y1,W,H,type){
				ctx.globalAlpha=1.0;
				if (type == 'spawner') {
					ctx.fillStyle="#FF0000";
					ctx.fillRect(x1-3+offsetAdjustment,y1-3+offsetAdjustment,6,6);
				}else if(type == 'poi'){
					ctx.globalAlpha=0.8;
					ctx.fillStyle="#e77b00";
					ctx.beginPath();
					var myX = x1+offsetAdjustment;
					var myY = y1+offsetAdjustment;
					ctx.arc(x1+offsetAdjustment,y1+offsetAdjustment,5,0,2*Math.PI);
					ctx.fill();
					console.log("POI: " + myX + " : " + myY);
				}else if(type == 'mineEntry'){
					ctx.fillStyle="#5c029e";
					ctx.fillRect(x1-4+offsetAdjustment,y1-4+offsetAdjustment,8,8);
				}else if(type == 'cave'){
					ctx.globalAlpha=0.8;
					ctx.fillStyle="#AAAAAA";
					ctx.fillRect(x1+offsetAdjustment,y1+offsetAdjustment,W,H);
				}else if(type == 'stronghold'){
					ctx.globalAlpha=0.5;
					ctx.fillStyle="#6b5395";
					ctx.fillRect(x1+offsetAdjustment,y1+offsetAdjustment,W,H);
				}else if(type == 'building'){
					ctx.globalAlpha=0.8;
					ctx.fillStyle="#248bf2";
					ctx.fillRect(x1+offsetAdjustment,y1+offsetAdjustment,W,H);
				}
				ctx.globalAlpha=1.0;
			};

			function drawStairs(x1,z1,x2,z2,type){
				if (type == 'stairs') {
					ctx.beginPath();
					ctx.strokeStyle="#459B74";
					ctx.lineWidth=4;
					ctx.moveTo(x1+offsetAdjustment,z1+offsetAdjustment);
					ctx.lineTo(x2+offsetAdjustment,z2+offsetAdjustment);
					ctx.stroke();
				}else if(type == 'ladder'){
					ctx.fillStyle="#5c029e";
					ctx.fillRect(x1-4+offsetAdjustment,z1-4+offsetAdjustment,8,8);
				}		
			};
		}
	}
});