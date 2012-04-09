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

pathfinding.node = function (x,y) {
	this.x = x;
	this.y = y;
	this.parentNode = null;
	this.traversable = true;
	this.g = 0; //Generated - Move cost from start node to this node
	this.h = 0; //Heuristic - Move cost this node to destination node
	this.f = 0; //g + h
}
pathfinding.addStartNode = function (x, y) {
	this.startNode = new this.node (x, y);
}
pathfinding.addEndNode = function (x, y) {
	this.endNode = new this.node (x, y);
}
pathfinding.createGrid = function (x, y) {
	for (var iX = 0; iX<x; iX++) {
		var ar = [];
		for (var iY = 0; iY<y; iY++) {
			ar.push (new this.node (iX, iY));
		}
		pathfinding.grid.push (ar);
	}
}
pathfinding.alterGrid = function (x, y, trav) {
	this.grid[x][y].traversable = trav;
}
// Finds if node is already in array based on x,y values.
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
			node.parentNode = parent; //Object.create(parent);
			node.g = this.calculateG (node);
			node.h = this.calculateH (node);
			node.f = node.g + node.h;
			//console.log (node.g, node.h, node.f);
		}
		else {
			node.parentNode = parent;
		}
		this.openset.push (node);
	}
	else if (indexOpen > -1 && indexClosed !== -1) {
		
		//console.log('addToOpenset-indexOpen>-1: ',node, this.calculateG(node));
		if (this.calculateG (node) <= this.openset[indexOpen].g) {
			node.parentNode = parent;
			//console.log ('indexOpen > -1: ', node);
			this.openset[indexOpen].g = this.calculateG (node);
			this.openset[indexOpen].parentNode = parent;
			this.openset[indexOpen].f = this.openset[indexOpen].g + this.openset[indexOpen].h;
		}
	}
}

// Calculates the g (generated) score => Move cost from start node to this node
pathfinding.calculateG = function (node) {
	var parent = node.parentNode;
	var orth = this.orthogonalScore;
	var diag = this.diagonalScore;
	var g;
	//if node has the same x or y value then movement is orthogonal otherwise it's diagonal movement.
	//orthogonal movement = 10; diagonal movement = 14;
	g = (node.x === parent.x || node.y === parent.y) ? orth + parent.g : diag + parent.g; 
	g = (node.x === parent.x && node.y === parent.y) ? parent.g : g;
	return g;
}
// Calculates the h (heuristic) score => Move cost from a node to end node orthogonally.
pathfinding.calculateH = function (node) {
	var x = (this.endNode.x > node.x) ? this.endNode.x - node.x : this.endNode.x - node.x;
	var y = (this.endNode.y > node.y) ? this.endNode.y - node.y : this.endNode.y - node.y;
	//console.log ('calculateH x: ', node.x, this.endNode.x, x, '| calculateH y: ', node.y, this.endNode.y, y);
	
	var x = Math.abs(x) * this.orthogonalScore;
	var y = Math.abs(y) * this.orthogonalScore;
	var z = x + y;
	//z = (z < 0) ? Math.abs(z) : z;
	//console.log ('h: ',z);
	return z;
}
//pathfinding.removeFromOpenset = function (node) {
pathfinding.removeFromArray = function (node, array) {
	var index = this.indexOf (node, array); //this.openset.indexOf (node);
	var removedNode = array[index];
	//console.log('removedNode: ',removedNode);
	array.splice (index, 1);
	//console.log('removedNode: ',removedNode);
	if (removedNode === undefined) {
		return -1;
	}
	return removedNode;
	//return this.openset;
}
pathfinding.removeFromOpenset = function (node) {
	return this.removeFromArray (node, this.openset);
}
pathfinding.removeFromClosedset = function (node) {
	this.removeFromArray (node, this.closedset);
}
pathfinding.addToClosedset = function (node) {
	this.closedset.push(node)
}
pathfinding.getGridNode = function (node,x,y) {
	if(x < 0  || y < 0) {

	}
	else {
		var new_node = this.grid[x][y];
		this.addToOpenset(new_node, node);

	}
}
pathfinding.getAllAdjacentNodes = function (node) {
	//var currentarray = [];
	//console.log (node);
	this.getGridNode(node, node.x-1, node.y-1);
	this.getGridNode(node, node.x, node.y-1);
	this.getGridNode(node, node.x+1, node.y-1);

	this.getGridNode(node, node.x-1, node.y);
	this.getGridNode(node, node.x+1, node.y);

	this.getGridNode(node, node.x-1, node.y+1);
	this.getGridNode(node, node.x, node.y+1);
	this.getGridNode(node, node.x+1, node.y+1);
/*
	this.addToOpenset (this.grid[node.x-1][node.y-1], node);
	this.addToOpenset (this.grid[node.x][node.y-1], node);
	this.addToOpenset (this.grid[node.x+1][node.y-1], node);
	
	this.addToOpenset (this.grid[node.x-1][node.y], node);
	//this.addToOpenset (this.grid[node.x][node.y], node);
	this.addToOpenset (this.grid[node.x+1][node.y], node);

	this.addToOpenset (this.grid[node.x-1][node.y+1], node);
	this.addToOpenset (this.grid[node.x][node.y+1], node);
	this.addToOpenset (this.grid[node.x+1][node.y+1], node);
*/
}
pathfinding.moveFromOpensetToClosedset = function (node) {
	var removedNode = this.removeFromOpenset (node);
	//console.log ('removedNode: ', removedNode);
	//this.addToClosedset (removedNode);
	console.log(this.addToClosedset (node));
	if (node.x === this.endNode.x && node.y === this.endNode.y) {
		console.log (node);	
		console.log (this.indexOf(node, this.closedset));
		console.log (this.indexOf(node, this.openset));
	}
	if (node.x === this.endNode.x && node.y === this.endNode.y) {
		this.path = node;
		return 1;
	}
	else {
		return 0;
	}
}
pathfinding.getLowestFScore = function () {
	var lowestF = -1;
	for (var i=0;i<this.openset.length;i++) {
		lowestF = (lowestF === -1) ? this.openset[i] : lowestF;
		lowestF = (this.openset[i].f <= lowestF.f) ? this.openset[i] : lowestF;
	}
	return lowestF;
}
pathfinding.start = function () {
	this.addToOpenset (this.startNode);  				//1
	this.getAllAdjacentNodes (this.startNode)  			//2
	console.log (this.openset);
	this.moveFromOpensetToClosedset (this.startNode);  	//3
	console.log ('this.closedset: ',this.closedset, this.startNode);
	

	var done = 0;
	while (done === 0) {
		//console.log('while loop');
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
pf.addStartNode (1,1);
pf.addEndNode (3,3);
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

console.log (pf.startNode, pf.endNode);
console.log ('grid', pf.grid);