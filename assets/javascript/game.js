// Game

$ (function () {
	var canvas = $ ('#gameCanvas');
	var rendCanvas = $('#renderCanvas');

	var ctx = canvas[0].getContext ('2d');
	var render = rendCanvas[0].getContext ('2d');

	var unit = {
		PosX: 0,
		PosY: 0
	}

	tank = Object.create (unit);
	tank.src = 'assets/units/tank-basic.png';

	tank.move = function (destination) {
		//tank.PosX to desination.x
		//tank.PosY to desination.y
	}

	var world = {
		screen: {
			maxX: 910,
			maxY: 552
		} 
	}

	//Clear pass ctx (actual) or render (renderery);
	var clear = function (context) {
		ctx.clearRect (0, 0, canvas.width(), canvas.height());
		//ctx.fillStyle = '#ffffff';
		//ctx.fillRect (0, 0, v)
	}

	var loadImg = function (src, x, y, cb) {
		var img = new Image();
		img.onload = function () {
			ctx.drawImage(img, x, y);
		};
		img.src = src;

	}

	var gameLoop = function () {
		loadImg (tank.src, tank.PosX, tank.PosY);
	}

	setTimeout(gameLoop(), 33);
	//gameLoop ();

	$(document.body).keydown ( function (e) {
		//console.log (e);
		switch (e.which) {
			case 68: //left
				clear(ctx);
				tank.PosX+=10;
				break;	
			case 65: //right
				clear(ctx);
				tank.PosX-=10;
				break;	
			case 87: //up
				clear(ctx);
				tank.PosY-=10;
				break;
			case 83: //down
				clear(ctx);
				tank.PosY+=10;
				break;
		}

		loadImg(tank.src, tank.PosX, tank.PosY);

/*		if (e.which === 68) {
			//console.log ('d');
			clear();
			tank.x+=10;
			loadImg(tank.src, tank.x, tank.y);

		}*/
	});



});