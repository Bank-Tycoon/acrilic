
ac.export("board", function(env){
	"use strict";

	var $dom = ac.import("dom"),
        $map = ac.import("map"),
        $widget = ac.import("widget");

    var setLayer = function(id){
        id = 0;
    };

	var createBoard = function(boardSelector){
        $widget.createBoard(boardSelector, function(x, y){
            var image = env.get("CURRENT_TILE").getGraphic();
            ac.log(x, y, image);
        });
	};

    return {
        createBoard: createBoard,
        setLayer: setLayer
    };
});
