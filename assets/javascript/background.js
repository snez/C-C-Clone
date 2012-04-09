//background.js

//background
var background = Object.create (item);
background.type = 'background';
background.name = '';
background.size = '';
background.collidable = false;
background.canCollide = function () {
	return this.collidable;
};
background.src = '';
background.selectable = false;

//grass
var grass = Object.create(background);
grass.name = 'BasicGrass';
grass.src = 'assets/units/grass.png';
