'use strict';

var _ = require('lodash');
var XQlint = require('xqlint').XQLint;
var JSONiqGrammar = require('./jsoniq-grammar');
var XQueryGrammar = require('./xquery-grammar');

var plugin = module.exports;

var markersByEditorId = {};
var errorsByEditorId = {};

var SUPPORTED_GRAMMARS = [
  'source.jq',
  'source.xq'
];

function getMarkersForEditor() {
  var editor = atom.workspace.getActiveEditor();
  if (editor && markersByEditorId[editor.id]) {
    return markersByEditorId[editor.id];
  }
  return {};
}

function getErrorsForEditor() {
  var editor = atom.workspace.getActiveEditor();
  if (editor && errorsByEditorId[editor.id]) {
    return errorsByEditorId[editor.id];
  }
  return [];
}

function clearOldMarkers(errors) {
  var rows = _.map(errors, function (error) {
    return getRowForError(error);
  });

  var oldMarkers = getMarkersForEditor();
  _.each(_.keys(oldMarkers), function (row) {
    if (!_.contains(rows, row)) {
      destroyMarkerAtRow(row);
    }
  });
}

function destroyMarkerAtRow(row) {
  var editor = atom.workspace.getActiveEditor();
  if (markersByEditorId[editor.id] && markersByEditorId[editor.id][row]) {
    markersByEditorId[editor.id][row].destroy();
    delete markersByEditorId[editor.id][row];
  }
}

function saveMarker(marker, row) {
  var editor = atom.workspace.getActiveEditor();

  if (!markersByEditorId[editor.id]) {
    markersByEditorId[editor.id] = {};
  }

  markersByEditorId[editor.id][row] = marker;
}

function getMarkerAtRow(row) {
  var editor = atom.workspace.getActiveEditor();

  if (!markersByEditorId[editor.id]) {
    return null;
  }

  return markersByEditorId[editor.id][row];
}

function updateStatusbar() {
  if (!atom.workspaceView.statusBar) {
    return;
  }

  var editor = atom.workspace.getActiveEditor();

  atom.workspaceView.statusBar.find('#xqlint-statusbar').remove();

  if (!editor || !errorsByEditorId[editor.id]) {
    return;
  }

  var line = editor.getCursorBufferPosition().row + 1;
  var error = errorsByEditorId[editor.id][line] || _.first(_.compact(errorsByEditorId[editor.id]));
  if(error) {
    atom.workspaceView.statusBar.appendLeft('<span id="xqlint-statusbar" class="inline-block">line ' + (error.pos.sl + 1) + ': ' + error.message + '</span>');
  }
}

function getRowForError(error) {
  var line = error.pos.sl + 1;
  var row = line - 1;
  return row;
}

function displayError(error) {
  var row = getRowForError(error);

  if (getMarkerAtRow(row)) {
    return;
  }

  var editor = atom.workspace.getActiveEditor();
  var marker = editor.markBufferRange([[row, 0], [row, 1]]);
  editor.decorateMarker(marker, {type: 'line', class: error.type === 'warning' ? 'xqlint-warning-line': 'xqlint-error-line'});
  editor.decorateMarker(marker, {type: 'gutter', class: error.type === 'warning' ? 'xqlint-warning-line-number': 'xqlint-error-line-number'});
  saveMarker(marker, row);
  addReasons(marker, error);
}

function getReasonsForError(error) {
  return error.message;
}

function addReasons(marker, error) {
  var row = getRowForError(error);
  var editorView = atom.workspaceView.getActiveView();
  var gutter = editorView.gutter;
  var reasons = '<div class="xqlint-errors">' + getReasonsForError(error) + '</div>';
  var gutterRow = gutter.find(gutter.getLineNumberElement(row));

  gutterRow.destroyTooltip();
  gutterRow.setTooltip({title: reasons, placement: 'bottom', delay: {show: 200}});
  marker.on('changed destroyed', function () {
    gutterRow.destroyTooltip();
  });
}

function lint() {
  var editor = atom.workspace.getActiveEditor();

  if (!editor) {
    return;
  }

  if (SUPPORTED_GRAMMARS.indexOf(editor.getGrammar().scopeName) === -1) {
    return;
  }

  var file = editor.getUri();
  var lint = new XQlint(editor.getText(), {
    fileName: file
  });
  removeErrorsForEditorId(editor.id);
  errorsByEditorId[editor.id] = lint.getMarkers();
  displayErrors();
}

function displayErrors() {
  var errors = getErrorsForEditor();
  clearOldMarkers(errors);
  updateStatusbar();
  _.each(errors, displayError);
}

function removeMarkersForEditorId(id) {
  if (markersByEditorId[id]) {
    delete markersByEditorId[id];
  }
}

function removeErrorsForEditorId(id) {
  if (errorsByEditorId[id]) {
    delete errorsByEditorId[id];
  }
}

function registerEvents() {
  lint();

  atom.workspace.eachEditor(function (editor) {
    var events = 'saved contents-modified';
    editor.off('scroll-top-changed');
    editor.on('scroll-top-changed', _.debounce(displayErrors, 200));
    editor.on('saved contents-modified', lint);
  });

  atom.workspaceView.on('editor:will-be-removed', function (e, editorView) {
    if (editorView && editorView.editor) {
      removeErrorsForEditorId(editorView.editor.id);
      removeMarkersForEditorId(editorView.editor.id);
    }
  });

  atom.workspaceView.on('cursor:moved', updateStatusbar);
}


plugin.activate = function() {
    registerEvents();
    atom.workspaceView.command('xqlint:lint', lint);
    atom.syntax.addGrammar(new JSONiqGrammar(atom.syntax, {}));
    atom.syntax.addGrammar(new XQueryGrammar(atom.syntax, {}));
};
