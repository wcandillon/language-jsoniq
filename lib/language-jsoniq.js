var JSONiqGrammar = require('./jsoniq-grammar');

module.exports = {
  activate: function(state){
    return atom.syntax.addGrammar(new JSONiqGrammar(atom.syntax, {}));
  }
};
