
ac.export("palette", function(env){
    "use strict";

    var tileset = {},
        container = $('#palette-panel'),
        selector = $("<div/>").attr("id", "palette-selector").appendTo(container);

    var selectTile = function(id){
        env.set("CURRENT_TILE", tileset[id]);
        tileset[id].select();
    };

    var getTile = function(id) {
        return tileset[id];
    };

    var createTileButtons = function(tiles){
        var tile_elements = [];
        tiles.forEach(function(tile, _){
            var tile_elem = tile.getElement();

            tileset[tile.id] = tile;
            tile_elements.push(tile_elem);
        });
        container.append(tile_elements);
    };

    var getRelativeMousePosition = function(event, tilesize) {
        //deslocamento em relacao à tela
        var doc = $(document);
        var x_offset = container.offset().left,
            y_offset = container.offset().top,
            y_scroll = container.scrollTop() + doc.scrollTop();
        //posição relativa do mouse
        var rx = event.pageX - x_offset,
            ry = event.pageY - y_offset + y_scroll;

        if (rx < 0) { rx = 0; }
        if (ry < 0) { ry = 0; }

        return {
            x: Math.floor(rx / tilesize),
            y: Math.floor(ry / tilesize)
        };
    };

    var updateSelector = function(x, y, w, h) {
        selector.css({
            width: w,
            height: h,
            transform: "translate(" + x + "px, " + y + "px)"
        });
    };

    var registerEvents = function() {
        var tsize = env.get("TILESIZE");
        var dragging = false;
        var x0 = 0, y0 = 0, x1 = 0, y1 = 0;

        container.on("mousedown", function(event){
            var pos = getRelativeMousePosition(event, tsize);
            x0 = pos.x;
            y0 = pos.y;
            dragging = true;
            updateSelector(x0*tsize, y0*tsize, tsize, tsize);
        });

        $(document).on("mousemove", function(event){
            var width, height, pos, rx0, rx1, ry0, ry1;
            if (! dragging){ return; }
            pos = getRelativeMousePosition(event, tsize);
            x1 = pos.x;
            y1 = pos.y;
            rx0 = Math.min(x0, x1);
            ry0 = Math.min(y0, y1);
            rx1 = Math.max(x0, x1);
            ry1 = Math.max(y0, y1);
            width = Math.abs(rx1 - rx0) * tsize + tsize;
            height = Math.abs(ry1 - ry0) * tsize + tsize;
            updateSelector(rx0*tsize, ry0*tsize, width, height);
        });

        $(document).on("mouseup", function(event){
            var width, height, pos, rx0, rx1, ry0, ry1;
            if (! dragging){ return; }
            pos = getRelativeMousePosition(event, tsize);
            x1 = pos.x;
            y1 = pos.y;
            dragging = false;
            rx0 = Math.min(x0, x1);
            ry0 = Math.min(y0, y1);
            rx1 = Math.max(x0, x1);
            ry1 = Math.max(y0, y1);
            width = Math.abs(rx1 - rx0) * tsize + tsize;
            height = Math.abs(ry1 - ry0) * tsize + tsize;
            updateSelector(rx0*tsize, ry0*tsize, width, height);
        });

    };

    var createPalette = function(tiles) {
        registerEvents();
        createTileButtons(tiles);
        selectTile(0);
    };

    return {
        getTile: getTile,
        createPalette: createPalette
    };
});
