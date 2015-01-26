'use strict';

var Subscriber, AtomXQLint;
var cp = require('child_process');
var _ = require('lodash');
var XQLintWorker = null;

var Subscriber = require('emissary').Subscriber;

module.exports = AtomXQLint = (function(){
    XQLintWorker = cp.fork(__dirname + '/worker.js');
    process.on('exit', function() {
        XQLintWorker.kill();
    });
    var $ = require('atom').$;

    function AtomXQLint(){
        this.configs = {};
        atom.workspace.observeActivePaneItem(function(item){
            if(item.constructor.name === 'TextEditor') {
                this.unsubscribeEditor(this.editor);
                if (item && item.constructor && item.constructor.name === 'TextEditor'){
                    this.editor = item;
                    this.subscribeEditor(this.editor);
                    this.run(this.editor);
                } else {
                    this.resetState();
                }
            }
        }.bind(this));
        this.editor = atom.workspace.getActiveTextEditor();
        if(this.editor){
            setTimeout(function(){
                this.subscribeEditor(this.editor);
                this.run(this.editor);
            }.bind(this), 1000);
        }
    }
    Subscriber.includeInto(AtomXQLint);

    AtomXQLint.prototype.destroy = function(){
        Object.keys(this.configs).forEach(function(configKey){
            var config = this.configs[configKey];
            if (config.fileWatcher){
                config.fileWatcher.close();
                delete config.fileWatcher;
            }
        });
        if (this.editor) {
            this.unsubscribeEditor(this.editor);
        }
        return this.unsubscribe();
    };

    AtomXQLint.prototype.subscribeEditor = function(editor) {
        var buffer = editor.getBuffer();
        this.subscribe(editor, 'grammar-changed', function(){
            this.unsubscribeEditor(editor);
            this.subscribeEditor(editor);
            this.run(editor);
        }.bind(this));

        if(this.isHintable(editor)) {
            var listenFor = [];
            listenFor.push('contents-modified');
            listenFor.push('saved');

            this.subscribe(buffer, listenFor.join(' '), (function(self) {
                return _.debounce(function() {
                    self.run(editor);
                },50);
            })(this));
        }

        this.subscribe(buffer, 'destroyed', (function(self) {
            return function() {
                return self.unsubscribeEditor(editor);
            };
        })(this));
    };

    AtomXQLint.prototype.unsubscribeEditor = function(editor) {
        if (editor){
            delete this.editor;
            return this.unsubscribe(editor) && this.unsubscribe(editor.getBuffer());
        }
    };

    AtomXQLint.prototype.run = function(editor){
        var self = this;
        var text = this.getContents(editor);
        if( !text ) {
            this.resetState();
            return;
        }

        var cb = function (markers) {
            XQLintWorker.removeListener('message', cb);
            if(markers.length === 0) {
                self.resetState();
            }
            if( editor.cursors[0] ){
                self.updateStatus(markers, editor.cursors[0].getBufferRow());
            }
            self.updateGutter(markers);
            self.updatePane(markers);
            self.cursorHandler = function () {
                if( editor.cursors[0] ){
                    self.updateStatus(markers, editor.cursors[0].getBufferRow());
                }
            };
            self.subscribe(atom.workspaceView, 'cursor:moved', self.cursorHandler);
            self.subscribe(editor, 'scroll-top-changed', function () {
                self.updateGutter(markers);
            });
        };
        XQLintWorker.on('message', cb);

        XQLintWorker.send({
            method: 'run',
            text: text,
            fileName: editor.getPath(),
            options: {},
            config: {}
        });
    };

    AtomXQLint.prototype.resetState = function(){
        this.updateStatus(false);
        this.updateGutter([]);
        this.updatePane([]);
        if (this.cursorHandler) {
            atom.workspaceView.off('cursor:moved', this.cursorHandler);
            this.cursorHandler = null;
        }
    };

    AtomXQLint.prototype.updatePane = function(errors){
      $('#xqlint-status-pane').remove();
      if( !errors ) {
          return;
      }
      var html = $('<div id="xqlint-status-pane" class="atom-xqlint-pane" style="height:">');
      var editorView = atom.workspaceView.getActiveView();
      function sortByLine(a, b) {
        return a.pos.sl - b.pos.sl;
      }
      errors.sort(sortByLine).forEach(function(error){
        var line = $('<span>Line: ' + (error.pos.sl + 1) + ' Char: ' + (error.pos.sc + 1) + ' ' + error.message + '</span>');
        html.append(line);
        line.click(function(){
          var position = [error.pos.sl, error.pos.sc];
          editorView.editor.setCursorBufferPosition(position);
        });
        html.append('<br/>');
      });
      atom.workspaceView.prependToBottom(html);
    };

    AtomXQLint.prototype.updateGutter = function(markers){
        var activeView = atom.workspaceView.getActiveView();
        if (activeView && activeView.gutter) {
            var gutter = activeView.gutter;
            gutter.removeClassFromAllLines('atom-xqlint-error');
            gutter.removeClassFromAllLines('atom-xqlint-warning');
            markers.forEach(function(marker){
                gutter.addClassToLine(marker.pos.sl, marker.level === 'error' ? 'atom-xqlint-error' : 'atom-xqlint-warning');
                var gutterRow = gutter.find(gutter.getLineNumberElement(marker.pos.sl));
                gutterRow.destroyTooltip();
                gutterRow.setTooltip({title: marker.message, placement: 'bottom', delay: {show: 200}});
            });
        }
    };

    AtomXQLint.prototype.updateStatus = function(errors, row){
      var status = document.getElementById('xqlint-status');
      var msg = '';
      if( status ) {
          status.parentElement.removeChild(status);
      }
      if( !errors ) {
          return;
      }
      if (row >= 0) {
        var lineErrors = errors.filter(function (error) {
          return error.pos.sl === row;
        });
        if (lineErrors.length > 0) {
          msg =  (lineErrors[0].pos.sl + 1) +
          ':' + (lineErrors[0].pos.sc + 1) +
          ' ' + lineErrors[0].message;
        } else {
          msg = errors.length > 0 ? errors.length +
          ' XQLint marker' + (errors.length>1?'s':'') : '';
        }
      } else if (typeof errors === 'string') {
        msg = errors;
      }
      if (msg) {
          atom.workspaceView.statusBar.appendLeft('<span id="xqlint-status" class="inline-block">' + msg + '</span>');
        }
      };


    AtomXQLint.prototype.isHintable = function(editor){
        if( !editor ) {
            return false;
        }
        var grammar = editor.getGrammar();
        if (!grammar || grammar.name !== 'JSONiq'){
            return false;
        }
        return true;
    };

    AtomXQLint.prototype.getContents = function(editor){
        if(!this.isHintable(editor)) {
            return false;
        }
        var text = editor.getText();
        if( !text ){
            return false;
        }
        return text;
    };

    return AtomXQLint;
})();
