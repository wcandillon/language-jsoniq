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

var _ = require('lodash');

var Range = require('atom').Range;
var linterPath = atom.packages.getLoadedPackage('linter').path;
var Linter = require(linterPath + '/lib/linter');
//var util = require(linterPath + '/lib/util');

var XQlint = require('xqlint').XQLint;

module.exports = (function(_super) {

    function JSONiqLinter(editor){
        _super.call(this, editor);
    }
    __extends(JSONiqLinter, _super);

    JSONiqLinter.prototype.lintFile = function(filePath, callback){
        var editor = atom.workspace.getActiveEditor();
        var lint = new XQlint(editor.getText(), {
            fileName: filePath
        });
        var markers = lint.getMarkers();
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

})(Linter);