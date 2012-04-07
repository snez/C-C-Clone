var item = {
	name: null,
	id: 0,
	health: 100,
	selectable: true,
	type: null,
	src: null,
	width: 48,
	height: 48,
	x: 0,
	y: 20,
	canMove: function () {
		(this.type === 'unit') ? true : false;
	},
	setPosition: function (x, y) {
		this.x = x;
		this.y = y;
	},
	getPosition: function () {
		return {x: this.x, y: this.y};
	},
	getHealth: function () {
		return this.health;
	},
	getType: function () {
		return this.type;
	}

}

var unit = Object.create (item);
unit.type = 'unit';
unit.width = 100;
unit.getSize = function () {
	return {width: this.width, height: this.height};
}

var tank = Object.create (unit);
console.log (tank.getType());
console.log (tank.getSize());

var tank2 = Object.create (unit);
tank2.type = 'building';
tank2.height = 50;

tank2.setPosition(100,1);
console.log(tank2.getType());
console.log(tank2.type);
console.log(tank.type);

console.log(tank.getSize());
console.log(tank2.getSize());

console.log(tank.getPosition());
console.log(tank2.getPosition());