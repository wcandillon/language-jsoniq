'use strict';

var JSONiqGrammar = require('./jsoniq-grammar');

var plugin = module.exports;

plugin.activate = function() {
    return atom.syntax.addGrammar(new JSONiqGrammar(atom.syntax, {}));
};
