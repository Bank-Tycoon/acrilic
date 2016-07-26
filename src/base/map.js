
ac.export("map", function(env){
    "use strict";

    var Map = function(name, width, height){
        (function(){
            this.grid = [];
            this.name = name;

            for (var y = 0; y < height; y++) {
                this.grid.push([]);
                for (var x = 0; x < width; x++) {
                    this.grid[y][x] = {};
                }
            }
        }.bind(this))();

        this.set = function(x, y, value){
            this.grid[y][x] = value;
        };

        this.get = function(x, y){
            return this.grid[y][x];
        };

        this.serialize = function() {
            var json = {
                id: this.name.replace(' ', '_').toLowerCase(),
                grid: this.grid
            };
            return JSON.stringify(json);
        };
    };

    var createMap = function(name, w, h){
        return new Map(name, w, h);
    };

    return {
        createMap: createMap
    };
});
