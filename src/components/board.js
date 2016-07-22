
ac.export("board", function(env){
	"use strict";

	var $map = ac.import("map"),
        $canvas = ac.import("canvas");

    var container = $("#board-panel"),
        current_layer = undefined,
        cursor_class = "selection-cursor";

    var setLayer = function(id){
        id = 0;
    };

    var createCursor = function(size) {
        var cursor = $("<div/>")
            .addClass(cursor_class)
            .css({width: size, height: size});
        return cursor;
    };

    var getRelativeMousePosition = function(event, tilesize) {
        //deslocamento em relacao à tela
        var doc = $(document);
        var x_offset = container.offset().left,
            y_offset = container.offset().top,
            x_scroll = container.scrollLeft() + doc.scrollLeft(),
            y_scroll = container.scrollTop() + doc.scrollTop();
        //posição relativa do mouse
        var rx = event.pageX - x_offset + x_scroll,
            ry = event.pageY - y_offset + y_scroll;

        rx = (rx < 0) ? 0 : rx;
        ry = (ry < 0) ? 0 : ry;
        return {x: Math.floor(rx / tilesize), y: Math.floor(ry / tilesize)};
    };

    var registerEvents = function(board, action){
        var tilesize = env.get("TILESIZE"),
            x = 0, y = 0, mouseDown = false;

        board.on('mousemove', function(event){
            var pos = getRelativeMousePosition(event, tilesize);

            x = pos.x;
            y = pos.y;

            board.find("."+cursor_class).css({
                transform: "translate(" + (x * tilesize) + "px, " + (y * tilesize) + "px)"
            });

            // Allows painting while dragging
            if(mouseDown){
                action(x, y);
            }
        });

        board.on('mousedown', function(e){
            e.preventDefault();
            mouseDown = true;
            action(x, y);
        });

        $(document).on('mouseup', function(){
            mouseDown = false;
        });
    };

    var createLayer = function(board, id, width, height) {
        var layer = $canvas.createCanvas(width, height);
        layer.elem.attr('id', id).addClass('layer');
        board.append(layer);
        return layer;
    };

    var createElements = function(h_tiles, v_tiles) {
        var tilesize = env.get("TILESIZE"),
            board = $('<div/>').addClass('board'),
            width = tilesize * h_tiles,
            height = tilesize * v_tiles,
            evt_layer = createLayer(board, 'evt_layer', width, height),
            fg_layer = createLayer(board, 'fg_layer', width, height),
            bg_layer = createLayer(board, 'bg_layer', width, height);

        current_layer = bg_layer;

        board.append(createCursor(tilesize));
        board.width(width).height(height);
        return board;
    };

	var createBoard = function(map_name, h_tiles, v_tiles){
        var board = createElements(h_tiles, v_tiles);
        registerEvents(board, function(x, y) {
            var tile_image = env.get('CURRENT_TILE').getCanvasElement();
            ac.log(x, y, tile_image);
            ac.log(tile_image);
            current_layer.draw(tile_image, 0, 0, x, y);
        });
        container.html(board);
	};

    return {
        createBoard: createBoard
    };
});
