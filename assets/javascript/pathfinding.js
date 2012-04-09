// pathfinding.js
var pathfinding = {};
pathfinding.openset = [];
pathfinding.closedset = [];

pathfinding.startNode = null;
pathfinding.endNode = null;

pathfinding.diagonalScore = 14;
pathfinding.orthogonalScore = 10;

pathfinding.grid = [];
pathfinding.path = null;

/* An individual node (movement 'block'). */
pathfinding.node = function (x, y, traversable) {
	this.x = x;
	this.y = y;
	this.parentNode = null;
	this.traversable = (traversable === undefined || traversable === true) ? true : false;
	this.g = 0; /*Generated - Move cost from start node to this node*/
	this.h = 0; /*Heuristic - Move cost this node to destination node*/
	this.f = 0; /*g + h*/
}
pathfinding.addStartNode = function (x, y) {
	this.startNode = new this.node (x, y);
}
pathfinding.addEndNode = function (x, y) {
	this.endNode = new this.node (x, y);
}
/* Sets movement costs:
		If orthogonal is undefined/null then uses default value of 10.
		If diagonal is undefined/null then uses orthogonal * 1.4 (sqr of 2).
			-- rounded as easier / quicker for JavaScript to calculate and acurate enough - consider revisiting. */
pathfinding.setMovementCost = function (orthogonal, diagonal) {
	this.orthogonalScore = (orthogonal === undefined || orthogonal === null) ? this.orthogonalScore : orthogonal;
	this.diagonalScore = (diagonal === undefined || diagonal === null) ? Math.round(this.orthogonalScore * 1.4) : diagonal;
}
pathfinding.createGrid = function (x, y) {
	for (var iX = 0; iX<x; iX++) {
		var ar = [];
		for (var iY = 0; iY<y; iY++) {
			ar.push (new this.node (iX, iY));
		}
		this.grid.push (ar);
	}
}
pathfinding.alterGrid = function (x, y, trav) {
	this.grid[x][y].traversable = trav;
}
/* Finds if node is already in array based on x,y values. */
pathfinding.indexOf = function (node, array) {
	//console.log (node);
	for (var i=0; i<array.length; i++) {
		if(array[i].x === node.x && array[i].y === node.y){
			return i;
		}
	}
	return -1;
}
pathfinding.addToOpenset = function (node, parent) {
	var indexOpen = this.indexOf (node, this.openset);
	var indexClosed = this.indexOf (node, this.closedset);
	if ((node.traversable === true && indexOpen === -1 && indexClosed === -1) || (node.x === this.startNode.x && node.y === this.startNode.y)) {
		if (parent !== undefined) {
			//console.log ('parent: ', parent, node, parent.x, parent.y, node.x, node.y, indexClosed);
			node.parentNode = parent;
			node.g = this.calculateG (node);
			node.h = this.calculateH (node);
			node.f = node.g + node.h;
			//console.log (node.g, node.h, node.f);
		}
		this.openset.push (node);
	}
	else if (indexOpen > -1 && indexClosed !== -1) {
		
		if (this.calculateG (node) <= this.openset[indexOpen].g) {
			node.parentNode = parent;
			this.openset[indexOpen].g = this.calculateG (node);
			this.openset[indexOpen].parentNode = parent;
			this.openset[indexOpen].f = this.openset[indexOpen].g + this.openset[indexOpen].h;
		}
	}
}
pathfinding.addToClosedset = function (node) {
	this.closedset.push(node)
}
pathfinding.removeFromArray = function (node, array) {
	var index = this.indexOf (node, array);
	var removedNode = array[index];
	array.splice (index, 1);
	if (removedNode === undefined) {
		return -1;
	}
	return removedNode;
}
pathfinding.removeFromOpenset = function (node) {
	return this.removeFromArray (node, this.openset);
}
pathfinding.removeFromClosedset = function (node) {
	this.removeFromArray (node, this.closedset);
}
pathfinding.moveFromOpensetToClosedset = function (node) {
	this.removeFromOpenset (node);
	this.addToClosedset (node);
	if (node.x === this.endNode.x && node.y === this.endNode.y) {
		this.path = node;
		return 1;
	}
	else {
		return 0;
	}
}
pathfinding.getGridNode = function (node, x, y) {
	if(x < 0  || y < 0) {}
	else {
		var new_node = this.grid[x][y];
		this.addToOpenset (new_node, node);
	}
}
pathfinding.getAllAdjacentNodes = function (node) {
	this.getGridNode (node, node.x-1, node.y-1);
	this.getGridNode (node, node.x, node.y-1);
	this.getGridNode (node, node.x+1, node.y-1);

	this.getGridNode (node, node.x-1, node.y);
	this.getGridNode (node, node.x+1, node.y);

	this.getGridNode (node, node.x-1, node.y+1);
	this.getGridNode (node, node.x, node.y+1);
	this.getGridNode (node, node.x+1, node.y+1);
}
/* Calculates the g (generated) score => Move cost from start node to this node */
pathfinding.calculateG = function (node) {
	var parent = node.parentNode;
	var orth = this.orthogonalScore;
	var diag = this.diagonalScore;
	var g;
	/*if node has the same x or y value then movement is orthogonal otherwise it's a diagonal movement.
	orthogonal movement = 10; diagonal movement = 14; */
	g = (node.x === parent.x || node.y === parent.y) ? orth + parent.g : diag + parent.g; 
	g = (node.x === parent.x && node.y === parent.y) ? parent.g : g;
	return g;
}
/* Calculates the h (heuristic) score => Move cost from a node to end node orthogonally. */
pathfinding.calculateH = function (node) {
	var x = (this.endNode.x > node.x) ? this.endNode.x - node.x : this.endNode.x - node.x;
	var y = (this.endNode.y > node.y) ? this.endNode.y - node.y : this.endNode.y - node.y;
	
	var x = Math.abs (x) * this.orthogonalScore;
	var y = Math.abs (y) * this.orthogonalScore;
	var z = x + y;

	return z;
}
pathfinding.getLowestFScore = function () {
	var lowestF = -1;
	for (var i=0;i<this.openset.length;i++) {
		lowestF = (lowestF === -1) ? this.openset[i] : lowestF;
		lowestF = (this.openset[i].f < lowestF.f) ? this.openset[i] : lowestF;
	}
	return lowestF;
}
pathfinding.getPath = function () {
	var arPath = [];
	var node = this.path;

	while (node.parentNode !== null) {
		arPath.push (node);
		node = node.parentNode;
	}
	return arPath.reverse();
}
pathfinding.start = function () {
	this.addToOpenset (this.startNode);  				//1
	this.getAllAdjacentNodes (this.startNode)  			//2
	this.moveFromOpensetToClosedset (this.startNode);  	//3
	
	var done = 0;
	while (done === 0) {
		var lowestNode = this.getLowestFScore ();			//4
		this.getAllAdjacentNodes (lowestNode);
		done = this.moveFromOpensetToClosedset (lowestNode);
		//done = 1;
	}
	console.log ('path found!')
/*
	var lowestNode = this.getLowestFScore ();			//4
	console.log ('lowestNode: ', lowestNode);
	this.moveFromOpensetToClosedset (lowestNode);
	this.getAllAdjacentNodes (lowestNode);

	var nextLowestNode = this.getLowestFScore ();
	this.moveFromOpensetToClosedset (nextLowestNode);
	this.getAllAdjacentNodes (nextLowestNode);
	console.log ('nextLowestNode:', nextLowestNode);
*/
}

//Instance
var pf = Object.create (pathfinding);
pf.setMovementCost(9);
pf.addStartNode (3,3);
pf.addEndNode (1,1);
pf.createGrid (10,10);
pf.alterGrid (2,0, false);
pf.alterGrid (2,1,false);
pf.alterGrid (2,2,false);
pf.alterGrid (2,3,false);
/*
pf.addStartNode (2,2);
pf.addEndNode (6,2);
pf.createGrid (10,10);
pf.alterGrid (4,1, false);
pf.alterGrid (4,2,false);
pf.alterGrid (4,3,false);*/
//pf.alterGrid (2,3,false);
//pf.alterGrid (3,4,false);
pf.start ();

console.log ('startNode, endNode: ',pf.startNode, pf.endNode);
console.log ('grid: ', pf.grid);
console.log ('path: ', pf.path);
console.log ('path array: ', pf.getPath());