ac.export("utils", function(env){
    "use strict";

    var build2DArray = function(rows, cols, defaultValue){
        var arr = [];
        for (var row = 0; row < rows; row++) {
            arr.push([]);
            for (var col = 0; col < cols; col++) {
                arr[row].push(defaultValue);
            }
        }
        return arr;
    };

    var getRelativeMousePosition = function(event, container) {
        var tilesize = env.get("TILESIZE"),
            doc = $(document),
            x_offset = container.offset().left,
            y_offset = container.offset().top,
            x_scroll = container.scrollLeft() + doc.scrollLeft(),
            y_scroll = container.scrollTop() + doc.scrollTop();
        var rx = event.pageX - x_offset + x_scroll,
            ry = event.pageY - y_offset + y_scroll;

        rx = (rx < 0) ? 0 : rx;
        ry = (ry < 0) ? 0 : ry;
        return {x: Math.floor(rx / tilesize), y: Math.floor(ry / tilesize)};
    };

    var filter = function(collection, func){
        var filtered = [];
        for(var i=0; i<collection.length; i++){
            filtered.push(func(collection[i]));
        }
        return filtered;
    };

    var map = function(collection, func){
        var mapped = [];
        for(var i=0; i<collection.length; i++){
            mapped.push(func(collection[i]));
        }
        return mapped;
    };
    
    var createCanvas = function(width, height){
        return $("<canvas/>").attr({width: width, height: height}).get(0);
    };

    return {
        getRelativeMousePosition: getRelativeMousePosition,
        build2DArray: build2DArray,
        createCanvas: createCanvas,
        filter: filter,
        map: map
    };
});
