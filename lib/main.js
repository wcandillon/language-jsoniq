'use strict';

var JSONiqGrammar = require('./jsoniq-grammar');
var XQueryGrammar = require('./xquery-grammar');

module.exports = {
  activate: function(state) {
    atom.syntax.addGrammar(new JSONiqGrammar(atom.syntax, {}));
    atom.syntax.addGrammar(new XQueryGrammar(atom.syntax, {}));
  }
};
