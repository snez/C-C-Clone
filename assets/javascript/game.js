// Game

$ (function () {
	var canvas = $ ('#gameCanvas')[0];

	if (canvas && canvas.getContext) {

		var ctx = canvas.getContext ('2d');
		canvasBuffer = document.createElement ('canvas');
		canvasBuffer.width = canvas.width;
		canvasBuffer.height = canvas.height;
		ctxBuffer = canvasBuffer.getContext ('2d');

		var unit = {
			position: {
				x: 0,
				y: 0
			},
			size: {
				width: 48,
				height: 48
			},
			PosX: 0,
			PosY: 0,
			speed: 0,
			health: 0,
			weapon: {
				damage: 0//,
				//upgrade: 0
			},
			actions: {
				move: function () {

				},
				fire: function () {

				}
			}
		}

		tank = Object.create (unit);
		tank.src = 'assets/units/tank-basic.png';

		tank.move = function (destination) {
			//tank.PosX to desination.x
			//tank.PosY to desination.y
		}

		var loadImg = function (src, x, y, cb) {
			var img = new Image();
			img.src = src;
			return img;
		}

		//var imgTank = loadImg (tank.src, tank.PosX, tank.PosY);

		var world = {
			screen: {
				maxX: 910,
				maxY: 552
			} 
		}

		//Clear pass ctx (actual) or render (renderery);
		var clear = function (context) {
			ctxBuffer.clearRect (0, 0, canvas.width, canvas.height);
			ctx.clearRect(0,0,canvas.width, canvas.height);
		}

		var gameLoop = function () {
			var imgTank = loadImg (tank.src, tank.PosX, tank.PosY);
			imgTank.onload = function () {
				clear(ctx);
				ctxBuffer.drawImage(imgTank,tank.PosX,tank.PosY);
				ctx.drawImage(canvasBuffer, 0, 0);
			}
		}

		var game = function () {
			setInterval( function() {gameLoop()}, 33);
			console.log(1);
		}

		$(document.body).keydown ( function (e) {
			switch (e.which) {
				case 68: //left
					//clear(ctx);
					tank.PosX+=5;
					break;	
				case 65: //right
					//clear(ctx);
					tank.PosX-=5;
					break;	
				case 87: //up
					//clear(ctx);
					tank.PosY-=5;
					break;
				case 83: //down
					//clear(ctx);
					tank.PosY+=5;
					break;
				case 32: //Space bar, prevents browser moving down when pressing space.
					(e.preventDefault) ? e.preventDefault() : false;
					break;
			}

		});

		game();
	}
});