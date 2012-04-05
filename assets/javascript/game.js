// Game

$ (function () {
	var canvas = $ ('#gameCanvas');
	var rendCanvas = $('#renderCanvas');

	var ctx = canvas[0].getContext ('2d');
	var render = rendCanvas[0].getContext ('2d');

	var tank = {
		x: 0,
		y: 0,
		src: 'assets/units/tank-basic.png'
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
		loadImg (tank.src, tank.x, tank.y);
	}

	setTimeout(gameLoop(), 500);
	//gameLoop ();

	$(document.body).keydown ( function (e) {
		//console.log (e);
		switch (e.which) {
			case 68:
				clear(ctx);
				tank.x+=10;
				break;	
			case 65:
				clear(ctx);
				tank.x-=10;
				break;	
			case 87:
				clear(ctx);
				tank.y-=10;
				break;
			case 83:
				clear(ctx);
				tank.y+=10;
				break;
		}
		
		loadImg(tank.src, tank.x, tank.y);

/*		if (e.which === 68) {
			//console.log ('d');
			clear();
			tank.x+=10;
			loadImg(tank.src, tank.x, tank.y);

		}*/
	});



});