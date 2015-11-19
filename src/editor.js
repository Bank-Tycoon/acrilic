
AC.editor = (function(){
	"use strict";

    var _editArea,
		_layers = [],
		_currentLayer = 0,
		_dragging = false,
		_tools = [],
		_toolSelected,
		_cursor = {x: 0, y: 0};
	
	return {
		
		setTile: function()
		{
			//position in the tileset image
			var dx = _cursor.x,
				dy = _cursor.y,
				sx = AC.tileCodeSelected.x,
				sy = AC.tileCodeSelected.y,
				t = AC.tileSize,
				img = AC.tileset.sourceImage;
			if (AC.tileMap[dy][dx] != AC.tileCodeSelected.code){
				AC.tileMap[dy][dx] = AC.tileCodeSelected.code;
				_layers[_currentLayer].drawImage(img, sx*t, sy*t, t, t, dx*t, dy*t, t, t);
			}
		},
		
		addLayer: function(width, height)
		{
			//criando canvas
			var layer = AC.graphics.createCanvas(width, height);
			_editArea.append(layer.canvas);
			_layers.push(layer);
		},
		
		setCurrentLayer: function(level){
			if(_layers[level])
				_currentLayer = level;
		},
		
        init: function(elem_id)
        {
			var self = this;
			
			this.addLayer(width, height);
			
            //cursor de seleção
			var select = $("<div/>")
				.attr("id", "selection_cursor")
				.css("width", tilesize)
				.css("height", tilesize);
			_editArea.append(select);

            //atualizando a posicao do cursor de seleção
            _editArea.on('mousemove', function(e){
				//deslocamento em relacao à tela
				var x_offset = _editArea.offset().left,
					y_offset = _editArea.offset().top,
					x_scroll = _editArea.scrollLeft() + $(document).scrollLeft(),
					y_scroll = _editArea.scrollTop() + $(document).scrollTop();
				//posição relativa do mouse
				var x = e.clientX - x_offset + x_scroll,
					y = e.clientY - y_offset + y_scroll;

				x = (x < 0) ? 0 : x;
				y = (y < 0) ? 0 : y;
				_cursor.x = parseInt(x / tilesize);
				_cursor.y = parseInt(y / tilesize);

				select.css("left", _cursor.x * tilesize);
				select.css("top", _cursor.y * tilesize);
				// Allows painting while dragging
				if(_dragging){
					self.setTile();
				}
			});
			
			// when clicked, gets the current selected tile and paints
			_editArea.on('mousedown', function(e){
				e.preventDefault();
				_toolSelected.action();
				_dragging = true;
			});
			
			$(document).on('mouseup', function(){
				_dragging = false;
			});
			
        }
    };

})();
