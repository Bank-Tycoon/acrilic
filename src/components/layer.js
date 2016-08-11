ac.export("layer", function(env){
    "use strict";

    ac.import("canvas");

    var _self = {
        layers: []
    };

    var Layer = ac.Class({
        init: function(id, width, height){
            this.id = id;
            this.canvas = ac.canvas.createCanvas(width, height);
            this.canvas.elem.attr("id", id).addClass('layer');
        },

        update: function(image, row, col){
            this.canvas.draw(image, 0, 0, col, row);
        },

        getElement: function(){
            return this.canvas.elem;
        },

        activate: function(){
            this.canvas.elem.addClass("active");
        },

        deactivate: function(){
            this.canvas.elem.removeClass("active");
        }
    });

    var activateLayer = function(index) {
        _self.layers[index].activate();
    };

    var deactivateLayer = function(index) {
        _self.layers[index].deactivate();
    };

    var updateLayer = function(index, image, row, col) {
        _self.layers[index].update(image, row, col);
    };

    var createLayers = function(width, height) {
        _self.layers = [
            new Layer("bg-layer", width, height),
            new Layer("fg-layer", width, height),
            new Layer("evt-layer", width, height)
        ];
        return _self.layers;
    };

    return {
        createLayers: createLayers,
        updateLayer: updateLayer,
        activateLayer: activateLayer,
        deactivateLayer: deactivateLayer
    };

});
