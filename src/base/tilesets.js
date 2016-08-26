
ac.export("tilesets", function(env){
    "use strict";

    ac.import("assets", "tiles");

    var _self = {
        tilesets: []
    };

    var Tileset = ac.Class({
        init: function(id, tilesize, image){
            this.id = id;
            this.tilesize = tilesize;
            this.tiles = {};
        }
    });

    var createTileset = function(id, tilemap, image){
        var tileset = new Tileset(id, tilesize, image);
        _self.tilesets.push(tileset);
        return tileset;
    };

    return {
        createTileset: createTileset
    };
});
