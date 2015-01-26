'use strict';

var __extends = function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) {
            d[p] = b[p];
        }
    }
    function __() {
        /*jshint validthis:true */
        this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var cp = require('child_process');
var _ = require('lodash');
var XQLintWorker = null;

/*jshint -W079 */
var Range = require('atom').Range;
var linterPath = atom.packages.getLoadedPackage('linter').path;
var Linter = require(linterPath + '/lib/linter');

module.exports = (function(_super) {

    XQLintWorker = cp.fork(__dirname + '/worker.js');
    process.on('exit', function() {
        XQLintWorker.kill();
    });

    function JSONiqLinter(editor){
        _super.call(this, editor);
    }
    __extends(JSONiqLinter, _super);
    JSONiqLinter.syntax = ['source.jq'];
    JSONiqLinter.prototype.linterName = 'xqlint';

    JSONiqLinter.prototype.lintFile = function(filePath, callback){
        //var self = this;
        var editor = atom.workspace.getActiveTextEditor();
        var cb = function (markers) {
            XQLintWorker.removeListener('message', cb);
            callback(_.chain(markers).map(function(marker){
                return {
                    line: marker.pos.sl + 1,
                    col: marker.pos.sc + 1,
                    level: marker.level,
                    message: marker.message,
                    linter: 'xqlint',
                    range: new Range(
                        [marker.pos.sl, marker.pos.sc],
                        [marker.pos.el, marker.pos.ec]
                    )
                };
            }).value());
        };
        XQLintWorker.on('message', cb);

        XQLintWorker.send({
            method: 'run',
            text: editor.getText(),
            fileName: editor.getPath(),
            options: {},
            config: {}
        });
    };

    return JSONiqLinter;
})(Linter);