//Player Object

	var player = {};
	player.name = '';
	player.pid = ''; //Player id
	player.alliance = '';
	player.colour = ''; //red, blue
	player.units = [];
	player.power = 0;
	player.buildings = [];
	player.resource = 0;

	player.selected = []; 

	player.select = function (item, selectType) {
		//selectType - ie. single select, add unit, remove unit -- Unit / Building
		if (this.type === 'building') {
			this.selected = item;
		}
		switch (selectType) {
			case undefined:
				this.selected = item;
				break;
			case 'add':
				this.selected.push(item);
				break;
			case 'remove':
				this.selected.pull(item);
				break;
		}
	}

	var alliance = {};
	alliance.name = '';
	alliance.units = [];
	alliance.buildings = [];
