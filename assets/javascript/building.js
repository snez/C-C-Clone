// Buildings Object

//$(function() {
	
	/* building */
	building = Object.create (item);
	//var building = {};
	building.name = '';
	building.health = 0;
	building.level = 0; // Upgrades - increases it's ability to do whatever the building does. ie. produce more power if powerstation.
	building.buildResourceRequired = 0;
	building.type = 'building';

	/* constructionYard */
	constructionYard = Object.create (building);
	constructionYard.name = 'constructionYard';
	//constructionYard.buildResourceRequired = 100;
	constructionYard.buildRequirements = {
		buildings: null,
		resources: 100
	}



//});

