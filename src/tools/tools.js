ac.export("tools", function(env){
    "use strict";

    ac.import("utils", "fill");

    var self = {};

    var insideArea = function(row, col, renderPoints) {

    };

    var applyPattern = function(map, row0, col0, toolArea, whitelist) {
        var pattern = env.get("TILE_PATTERN");
        whitelist = whitelist || {};
        for(var row=0; row < pattern.rows; row++){
            for(var col=0; col < pattern.cols; col++){
                var relRow = row + row0,
                    relCol = col + col0;
                if(relRow >= toolArea.row0 && relRow <= toolArea.row1 &&
                   relCol >= toolArea.col0 && relCol <= toolArea.col1){
                   map.set(relRow, relCol, pattern.submap[row][col]);
               }
            }
        }
    };

    var getGuidePoints = function(origRow, origCol, toolArea) {
        // return the start and end points for the pattern rendering
        var pattern = env.get("TILE_PATTERN"), startRow, startCol, endRow, endCol;
        startRow = origRow - Math.ceil((origRow - toolArea.row0) / pattern.rows) * pattern.rows;
        startCol = origCol - Math.ceil((origCol - toolArea.col0) / pattern.cols) * pattern.cols;
        endRow = origRow + Math.ceil((toolArea.row1 - origRow) / pattern.rows) * pattern.rows;
        endCol = origCol + Math.ceil((toolArea.col1 - origCol) / pattern.cols) * pattern.cols;

        return {startRow: startRow, startCol: startCol, endRow: endRow, endCol: endCol};
    };

    var applyPatternToArea = function(map, origRow, origCol, toolArea, whitelist) {
        var pattern = env.get("TILE_PATTERN"),
            guidePoints = getGuidePoints(origRow, origCol, toolArea);
        for(var row=guidePoints.startRow; row<=guidePoints.endRow; row+=pattern.rows){
            for(var col=guidePoints.startCol; col<=guidePoints.endCol; col+=pattern.cols){
                applyPattern(map, row, col, toolArea, whitelist);  // basta editar a whitelist agora
            }
        }
    };

    self.pen = (function(){
        var penAction = function functionName(map, row, col) {
            var pattern = env.get("TILE_PATTERN"),
                toolArea = {
                    row0: row,
                    col0: col,
                    row1: row+pattern.rows-1,
                    col1: col+pattern.cols-1
                };
            applyPattern(map, row, col, toolArea);
        };

        return {
            mousedown: penAction,
            drag: penAction,
            mutableCursor: true
        };
    })();

    self.square = (function(){
        var origRow, origCol, toolArea;
        return {
            mousedown: function(map, row, col) {
                toolArea = {row0: row, col0: col, row1: row, col1: col};
                origRow = row;
                origCol = col;
                applyPatternToArea(map, row, col, toolArea);
                map.saveState();
            },
            drag: function(map, row1, col1) {
                var abs = ac.utils.absCoordinates(origRow, origCol, row1, col1);
                toolArea = {
                    row0: abs.row0,
                    col0: abs.col0,
                    row1: abs.row1,
                    col1: abs.col1
                };
                map.restoreState();
                applyPatternToArea(map, origRow, origCol, toolArea);
            },
            mutableCursor: false
        };
    })();

    self.fill = (function(){
        var visited = [];
        var getAdjacentCells = function(map, row, col) {
            var valid_cells = [],
                cells = [
                    [row+1, col],
                    [row-1, col],
                    [row, col+1],
                    [row, col-1]
                ];

            for(var i=0; i<cells.length; i++){
                var cell = cells[i];
                if(! map.get(cell[0], cell[1])){
                    continue;
                }
                valid_cells.push(cell);
            }
            return valid_cells;
        };

        var floodFill = function(map, row, col, origTileID) {
            var whitelist, toolArea;

            floodFill(map, row+1, col);
            floodFill(map, row-1, col);
            floodFill(map, row, col+1);
            floodFill(map, row, col-1);

            applyPatternToArea(map, row, col, toolArea, whitelist);
        };

        return {
            mousedown: function(map, row, col) {
                var origTile = map.get(row, col);
                visited = [];
                floodFill(map, row, col, origTile);
            },
            drag: function() {},
            mutableCursor: false
        }
    })();

    var getTool = function() {
        var tool = env.get("CURRENT_TOOL");
        return self[tool] || self.pen;
    };

    return {
        getTool: getTool
    };
});
