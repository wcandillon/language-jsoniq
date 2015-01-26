'use strict';

var XQLint = require('xqlint').XQLint;

process.on('message', function(m) {
    if (m.method === 'run') {
        var lint = new XQLint(m.text, {
            fileName: m.fileName
        });
        process.send(lint.getMarkers());
    }
});