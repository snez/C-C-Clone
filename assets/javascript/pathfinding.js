if(typeof console === undefined ) { console = {}; console.log = function () {};};

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

/* An individual node (movement 'block'). 
	Should be declared with new e.g. var this.startNode = new this.node(1,1);
*/
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
/* Sets the endNode to the actual grid version of the node, to get the traversable value 
	returns callback noting whether the endNode is traversable.
*/
pathfinding.checkEndNodeIsTraversable = function (callback) {
	this.endNode = this.grid[this.endNode.x][this.endNode.y];
	callback((this.endNode.traversable === false) ? false : true);
}
/* Sets movement costs:
		If orthogonal is undefined/null then uses default value of 10.
		If diagonal is undefined/null then uses orthogonal * 1.4 (sqr of 2).
			-- rounded as easier / quicker for JavaScript to calculate and acurate enough - consider revisiting. */
pathfinding.setMovementCost = function (orthogonal, diagonal) {
	this.orthogonalScore = (orthogonal === undefined || orthogonal === null) ? this.orthogonalScore : orthogonal;
	this.diagonalScore = (diagonal === undefined || diagonal === null) ? Math.round(this.orthogonalScore * 1.4) : diagonal;
}
/* Creates the grid 0 to x && y. 0 based but expanded to +1, as per standard concept of a grid.
	e.g. x=10, y=10 => this.grid.length === 11, and this.grid[10].length === 11;
*/
pathfinding.createGrid = function (x, y) {
	for (var iX = 0; iX<x+1; iX++) {
		var ar = [];
		for (var iY = 0; iY<y+1; iY++) {
			ar.push (new this.node (iX, iY));
		}
		this.grid.push (ar);
	}
	return this.grid;
}
/* Allows a grid node to be made not traversable. */
pathfinding.alterGrid = function (x, y, trav) {
	this.grid[x][y].traversable = trav;
}
/* Finds if node is already in array based on x,y values. */
pathfinding.indexOf = function (node, array) {
	//console.log (node);
	//console.log(array);
	for (var i=0; i<array.length; i++) {
		if(node === undefined) {
			return -1;//console.log ('indexOf undefined: ',i,node);
		}
		if(array[i].x === node.x && array[i].y === node.y){
			return i;
		}
	}
	return -1;
}
pathfinding.addToOpenset = function (node, parent) {
	var indexOpen = this.indexOf (node, this.openset);
	var indexClosed = this.indexOf (node, this.closedset);
	if(node === undefined) { console.log(parent, node);}
	if ((node.traversable === true && indexOpen === -1 && indexClosed === -1)) {// || node.x === this.startNode.x && node.y === this.startNode.y)) {
		if (parent !== undefined) {
			//console.log ('parent: ', parent, node, parent.x, parent.y, node.x, node.y, indexClosed);
			node.parentNode = parent;
			node.g = this.calculateG (node);
			node.h = this.calculateH (node);
			node.f = node.g + node.h;
			//console.log (node.g, node.h, node.f);
		}
		this.openset.push (node);
		return 1;
	}
	else if (node.traversable === false) {
		return 0;
	}
	else if (indexOpen > -1 && indexClosed !== -1) {
		
		if (this.calculateG (node) <= this.openset[indexOpen].g) {
			node.parentNode = parent;
			this.openset[indexOpen].g = this.calculateG (node);
			this.openset[indexOpen].parentNode = parent;
			this.openset[indexOpen].f = this.openset[indexOpen].g + this.openset[indexOpen].h;
		}
		return 1;
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
	//if(x == NaN) {console.log(node,x,y);}
	//console.log('this.grid[x]:', node, this.grid.length,x,y,this.grid[x]);
	//x = x-1;
	//y = y-1;
	if (node === -1) {return 0;}
	if(x < 0  || y < 0 || x >= this.grid.length || y >= this.grid[x].length || node === -1) {
		return 0;
	}
	else {
		//console.log(x,y, this.openset.length);
		var new_node = this.grid[x][y];
		//console.log(new_node);
		if(new_node === undefined) {console.log(x,y);}
		return this.addToOpenset (new_node, node);
		
	}
}

/* Gets all the nodes adjacent to the node passed in.
	For each of these returned from this.getGridNode a value of 0 or 1 should be returned.
	if they're all 0 then none of the adjacent nodes where reachable and no improvement was found.
	=> destination not reachable.
 */
pathfinding.getAllAdjacentNodes = function (node) {
	var iRet = 0;
	iRet += this.getGridNode (node, node.x-1, node.y-1);
	iRet += this.getGridNode (node, node.x, node.y-1);
	iRet += this.getGridNode (node, node.x+1, node.y-1);

	iRet += this.getGridNode (node, node.x-1, node.y);
	iRet += this.getGridNode (node, node.x+1, node.y);

	iRet += this.getGridNode (node, node.x-1, node.y+1);
	iRet += this.getGridNode (node, node.x, node.y+1);
	iRet += this.getGridNode (node, node.x+1, node.y+1);

	return (iRet === 0) ? 0 : 1;
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
/* Returns the lowest f score --> quickest node in openset. */
pathfinding.getLowestFScore = function () {
	var lowestF = -1;
	for (var i=0;i<this.openset.length;i++) {
		lowestF = (lowestF === -1) ? this.openset[i] : lowestF;
		lowestF = (this.openset[i].f < lowestF.f) ? this.openset[i] : lowestF;
	}
	return lowestF;
}
/* Changes the path as a single node (with parentNodes) into an array in the right order. */
pathfinding.getPath = function () {
	var arPath = [];
	var node = this.path;

	while (node.parentNode !== null) {
		arPath.push (node);
		node = node.parentNode;
	}
	return arPath.reverse();
}
/* Special error object, for when an error occurs.
	- EndNode is not traversable, or EndNode is not reachable.
 */
pathfinding.err = function (no, msg) {
	var error = {};
	error.msg = msg;
	error.no = no;
	return error;
	/*
		1: EndNode / StartNode not traversable;
		2: EndNode unreachable;
	*/
}
/* Main method for running the pathfinding script. */
pathfinding.start = function (callback) {
	var that = this;
	this.checkEndNodeIsTraversable (function (traversable) {
		if (traversable) {
			that.addToOpenset (that.startNode);  				//1
			that.getAllAdjacentNodes (that.startNode)  			//2
			that.moveFromOpensetToClosedset (that.startNode);  	//3
			
			var done = 0;
			while (done === 0) {
				var lowestNode = that.getLowestFScore ();			//4
				var iRet = that.getAllAdjacentNodes (lowestNode);
				if (iRet === 0) {
					var err = new that.err (2, 'Cannot reach end node');
					callback(err)
					done = 1;
				}
				else {
					done = that.moveFromOpensetToClosedset (lowestNode);
					if (done === 1) {
						callback (null, that.getPath ());
					}
				}
			}
		}
		else {
			var err = new that.err (1, 'End node not traversable.');
			callback(err);
		}
	});

	//console.log ('path found!')
}

//Instance
var pf = Object.create (pathfinding);
pf.addStartNode (0,0);
pf.addEndNode (3,3);
pf.createGrid (3,3);
pf.alterGrid (0,2,false);
pf.alterGrid (1,2,false);
pf.alterGrid (2,2,false);
pf.alterGrid (3,2,false);
pf.start (function (err, path) {
	if (err) {
		console.error (err.msg, err.no);
	}
	else {
		console.log (path);
	}
});

/*var pf = Object.create (pathfinding);
pf.setMovementCost(10);
pf.addStartNode (0,0);
pf.addEndNode (24,12);
pf.createGrid (Math.ceil(1200/50),Math.ceil(600/50));

pf.start ();

console.log ('startNode, endNode: ',pf.startNode, pf.endNode);
console.log ('grid: ', pf.grid);
console.log ('path: ', pf.path);
//console.log ('path array: ', pf.getPath());
*/


/*var pf = Object.create (pathfinding);
pf.setMovementCost(9);
pf.addStartNode (3,3);
pf.addEndNode (1,1);
pf.createGrid (10,10);
pf.alterGrid (2,0, false);
pf.alterGrid (2,1,false);
pf.alterGrid (2,2,false);
pf.alterGrid (2,3,false);

pf.start ();

console.log ('startNode, endNode: ',pf.startNode, pf.endNode);
console.log ('grid: ', pf.grid);
console.log ('path: ', pf.path);
console.log ('path array: ', pf.getPath());
*/