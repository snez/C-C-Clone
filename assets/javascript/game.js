// Game

var game = {};

$ (function () {
	var canvasEl = $('#gameCanvas');
	var canvas = canvasEl[0];

	if (canvas && canvas.getContext) {

		//Setup context and buffer.
		var ctx = canvas.getContext ('2d');
		canvasBuffer = document.createElement ('canvas');
		canvasBuffer.width = canvas.width;
		canvasBuffer.height = canvas.height;
		ctxBuffer = canvasBuffer.getContext ('2d');

		/* ==> Variables used but don't need to be declared explicitly.
			game.mouseX = 0;
			game.mouseY = 0;
		*/

		// Setup Players
		game.players = {
			p1: Object.create(player)
		}
		var tank1 = Object.create(tank);
		var tank2 = Object.create(tank);
		
		tank1.x = 0;
		tank1.y = 0;
		tank1.id = 1;
		
		tank2.x = 100;
		tank2.y = 0;
		tank2.id = 2;

		game.players.p1.units = [tank1, tank2];

		console.log('t1: ', tank1.x, tank1.y);
		console.log('t2: ', tank2.x, tank2.y);

		game.currentPlayer = game.players.p1;
		game.currentPlayer.selected = tank1;

		game.loadImg = function (item) { //src, x, y, cb) {
			var img = new Image();
			img.src = item.src;
			return img;
		}

		game.world = {
			screen: {
				maxX: 910,
				maxY: 552
			} 
		}

		//Clear pass ctx (real context) or ctxBuffer (buffer);
		game.clear = function (context) {
			context.clearRect(0,0, canvas.width, canvas.height);
		}

		game.draw = function (item, cb) {
			var imgTank = game.loadImg(item);//game.currentPlayer.units[0]);
			imgTank.onload = function () {
				ctxBuffer.drawImage(imgTank,item.x,item.y); // Draws an individual item onto the context buffer
				cb(true); // return callback to signal draw is complete.
			}
		}

		//Calculates Travel path for an item, and returns the new X, Y for this gameloop.
		game.calculateTravel = function (item,cb) {
			//console.log(item);
			if(item.x === item.moveToX && item.y === item.moveToY) { //&& item.x <== item.moveToX && item.y <== item.moveToY && item.y >== item.moveToY) {
				cb({x: item.x, y: item.y});
				item.moving = false;
				return true;
			}
			/*else if ((item.x >= (item.moveToX + 5))){
				cb({x: item.x, y: item.y});
				item.moving = false;
				return true;	
			}*/
			var x = (item.moveToX >= item.x) ? item.moveToX - item.x : item.moveToX + item.x;
			var y = (item.moveToY >= item.y) ? item.moveToY - item.y : item.moveToY + item.y;
			//var y = item.moveToY - item.y;
			var sqrX = Math.pow(x,2);
			var sqrY = Math.pow(y,2);
			//console.log('sqr', sqrX, sqrY);
			var r = Math.floor(Math.sqrt(sqrX + sqrY));
			//console.log('r', r);
			//console.log(r);
			var total = (x + y);
			//console.log('total: ',total);
			var unit = (100/total);
			//console.log('unit', unit);
			var percX = ((unit * x) / 100);
			var percY = 1-percX; //((unit * y) / 100);
			//console.log(percX, percY);
			//var distX = Math.round((item.speed * percX) +item.x);//(item.moveToX >= item.x) ? item.x : -item.x);
			//var distY = Math.round((item.speed * percY) +(item.moveToX >= item.y) ? item.y : -item.y); //item.y);
			var destX = ((item.moveToX >= item.x) ? ((item.speed * percX) + item.x) : ((item.speed * percX)-item.x));
			var destY = ((item.moveToX >= item.y) ? ((item.speed * percY) + item.y) : ((item.speed * percY)-item.y)); //item.y);

			if(((item.moveToX-destX+item.moveToY-destY) <= 5) && ((item.moveToX-destX+item.moveToY-destY) >= 0)){
				destX = item.moveToX;
				destY = item.moveToY;
			}
			console.log('dest:', destX, item.moveToX, destY, item.moveToY, (item.moveToX-destX+item.moveToY-destY));
			console.log('dest:', destX, item.moveToX, destY, item.moveToY, (item.moveToX+destX+item.moveToY+destY));
			//if ()
			cb ({x: destX, y: destY});
		}

		// drawItems takes an array of items to be drawn
		game.drawItems = function (items) {
			var iNoLoaded = 0; // Counter to make sure all items have been drawn
			for (var i=0; i<items.length; i++) {
				// Moves item if the items moveto x & y are different from current x & y, by speed;
				
				if (items[i].moving) {
					console.log('item: ',items[i].x);
					
					//More complex moving calculations - in progress. Only moves positive X, Y.
					/*game.calculateTravel(items[i], function (moveTo) {
						console.log('moveTo:', moveTo)
						items[i].x = (items[i].x <= items[i].moveToX) ? moveTo.x : items[i].x;
						items[i].x = (items[i].x >= items[i].moveToX) ? moveTo.x : items[i].x;
						items[i].y = (items[i].y <= items[i].moveToY) ? moveTo.y : items[i].y;
						items[i].y = (items[i].y >= items[i].moveToY) ? moveTo.y : items[i].y;
					});*/
					//items[i].x = moveTo.x;
					console.log('items[i].x',items[i].x)
						
					//Basic Movement
					items[i].x = (items[i].x <= items[i].moveToX) ? items[i].x + items[i].speed : items[i].x;
					items[i].x = (items[i].x >= items[i].moveToX) ? items[i].x - items[i].speed : items[i].x;
					items[i].y = (items[i].y <= items[i].moveToY) ? items[i].y + items[i].speed : items[i].y;
					items[i].y = (items[i].y >= items[i].moveToY) ? items[i].y - items[i].speed : items[i].y;
						
				}
				// draw, takes an item to be drawn and returns a callback when done.
				game.draw (items[i], function (bLoaded) {
					iNoLoaded+=1;
					if (iNoLoaded === items.length) {
						game.clear(ctx); // Clear the context
						ctx.drawImage(canvasBuffer, 0, 0); // Draw buffer canvas onto the context
						game.clear(ctxBuffer); // Clear the context buffer
					}
				});	
			}
		}

		/* Used for stopping and starting the game loop in Firebug / Chrome Inspector */
		game.stopLoop = false;
		$('#stop').click(function (e) {
			game.stop();
		})
		game.stop = function () {
			return game.stopLoop = true;
		}
		game.start = function () {
			return game.stopLoop = false;
		}

		// Performs the gameLoop
		game.gameLoop = function () {
			this.controls();
			setInterval( 
				function() {
					if(game.stopLoop === false) { 
						game.drawItems(game.currentPlayer.units);
					};
				}
			, 33);
		}

		// Checks if current mouse position has a unit under it.
		//-> Current only checks the currentPlayers units, needs to check all.
		game.unitAtLocation = function (cb) {
			for (var i=0; i<game.currentPlayer.units.length; i++) {
				var item = game.currentPlayer.units[i];
				if (game.mouseX >= item.x && game.mouseX <= (item.x + item.width)
					&& game.mouseY >= item.y && game.mouseY <= (item.y + item.height)) {
					cb(item);
					return item;
				}
			} 
			cb(null);
			return null;
		}

		game.moveItem = function (item, movingTo) {
			item.startX = item.x;
			item.startY = item.y;
			item.moveToX = (movingTo.x - (item.width/2)); //game.mouseX;
			item.moveToY = (movingTo.y - (item.height/2)); //game.mouseY;
			item.moving = true;
		}

		//Adds the game controls, such as click, mousemove & keydown.
		game.controls = function () {
			$(document).keydown ( function (e) {
				var item = game.currentPlayer.selected;
				switch (e.which) {
					case 68: //D = left
						item.x+=item.speed;
						break;	
					case 65: //A = right
						item.x-=item.speed;
						break;	
					case 87: //W = up
						item.y-=item.speed;
						break;
					case 83: //S = down
						item.y+=item.speed;
						break;
					case 32: //Space bar, prevents browser moving down when pressing space.
						(e.preventDefault) ? e.preventDefault() : false;
						break;
				}
			});
			canvasEl.mousemove (function (e) {
				game.mouseX = e.pageX - this.offsetLeft;
				game.mouseY = e.pageY - this.offsetTop;
				game.unitAtLocation (function (item) {
					//Changes cursor if a unit is underneith it. -> probably need to expand for multiple types
					canvasEl.css('cursor', (item !== null) ? 'pointer' : 'default');
				});
			});
			canvasEl.click (function (e) {
				console.log (e);
				game.unitAtLocation (function (item) {
					var item = (item !== null) ? game.currentPlayer.selected = item : false;
					if (item === false && game.currentPlayer.selected) {
						console.log ('Move ',game.currentPlayer.selected.id, ' to ', game.mouseX,',', game.mouseY);
						game.moveItem(game.currentPlayer.selected, {x: game.mouseX, y: game.mouseY});
					} 
				});
			});

			// Right mouse button (two-fingers on osx pad)
			canvasEl.bind ('contextmenu', function (e) {
				(e.which ===3) ? game.currentPlayer.selected = null : false;
				return false;
			})

		}

		//Starts the game loop aka the game.
		game.gameLoop();
	}
});