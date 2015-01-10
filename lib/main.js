'use strict';

var JSONiqGrammar = require('./jsoniq-grammar');
var AtomXQLint = require('./atom-xqlint.js');

module.exports = {
  activate: function(){
    atom.syntax.addGrammar(new JSONiqGrammar(atom.syntax, {}));
    this.atomXQlint = new AtomXQLint();
    return this;
  },

  deactivate: function(){
    return this.atomXQlint.destroy();
  }
};
