//Acrilic on Canvas Map Editor

var AC = (function(){
	"use strict";

	window.log = console.log.bind(console);

    return {
		ESC_KEY: 27,
		TILESIZE: 64,

		init: function(){

			this.Interface.build({
				'graphics': this.Graphics,
				'dialog': this.Dialog
			});
			// init the tile object map
			/*for (var i = 0; i < this.tileRows; i++) {
				this.tileMap.push([]);
				for (var j = 0; j < this.tileCols; j++) {
					this.tileMap[i].push({id: 0});
				}
			}*/
		}
    };
})();
