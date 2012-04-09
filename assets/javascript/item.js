


/* item */
var item = {};
item.name = null;
item.id = 0;
item.health = 100;
item.selectable = true;
item.type = null; // Type === 'building', 'unit'
item.src = null;
item.width = 48;
item.height = 48;
item.x = 0;
item.y = 0;
item.buildRequirements = {
	// What's required to build this item.
	// e.g. A power station requires a constructionYard, resources
	buildings: [],
	resource: 0
}
item.canMove = function () {
	return (this.type === 'unit') ? true : false;
}


/* unit */
unit = Object.create (item);
unit.type = 'unit';
unit.speed = 5;
unit.moveToX;
unit.moveToY;
unit.moving = false;
unit.weapon = {
	damage: 5
}
unit.move = function (toX, toY) {

}
unit.fire = function () {

}

/* tank */ 
var tank = Object.create(unit);
tank.name = 'BasicTank';
tank.src = 'assets/units/tank-basic.png';



//});