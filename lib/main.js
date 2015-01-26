'use strict';

var JSONiqGrammar = require('./jsoniq-grammar');
var AtomXQLint = require('./atom-xqlint.js');

module.exports = {
  activate: function(){
    atom.grammars.addGrammar(new JSONiqGrammar(atom.grammars, {}));
    this.atomXQlint = new AtomXQLint();
    return this;
  },

  deactivate: function(){
    return this.atomXQlint.destroy();
  }
};
