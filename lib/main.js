'use strict';

var JSONiqGrammar = require('./jsoniq-grammar');

module.exports = {
  activate: function(){
    atom.grammars.addGrammar(new JSONiqGrammar(atom.grammars, {}));
    return this;
  },

  deactivate: function(){
    return this.atomXQlint.destroy();
  }
};
