
ac.export("menu", function(env){
    "use strict";

    ac.import("dialog", "editor");

    var registerSwitchButton = function(selector, action) {
        var activeClass = 'active',
            element = $(selector);

        element.on('click', function(e){
            var target = $(e.target);
            element.removeClass(activeClass);
            target.addClass(activeClass);
            action(target.data('value'));
        }).first().trigger('click');
    };

    var initToolsMenu = function() {
        registerSwitchButton('.btn-tool', function(value) {
            env.set("CURRENT_TOOL", value);
            ac.document.trigger("toolChange");
        });
    };

    var initLayersMenu = function() {
        registerSwitchButton('.btn-layer', function(value) {
            env.set("CURRENT_LAYER", Number(value));
            ac.document.trigger("layerChange");
        });
    };

    var initFileMenu = function() {
        $('#btn-file-new').on('click', function(){
            ac.dialog.openNewFileDialog(function(id, rows, cols, tileset){
                var file = ac.editor.createFile(id, rows, cols, tileset);
                ac.editor.openFile(file);
            });
        });

        $('#btn-file-save').on('click', function(){
            var file = env.get("CURRENT_FILE");
            if (file){
                ac.editor.saveFile(file);
            }
        });

        $('#btn-file-import').on('click', function(){
            ac.dialog.openImportDialog(function(json){
                var file = ac.editor.createFileFromJSON(json);
                ac.editor.openFile(file);
            });
        });

        $('#btn-file-export').on('click', function(){
            var file = env.get("CURRENT_FILE");
            if (! file){ return; }
            ac.dialog.openExportDialog(file.toJSON());
        });
    };

    var init = function() {
        initFileMenu();
        initToolsMenu();
        initLayersMenu();
    };

    return {
        init: init
    };
});
