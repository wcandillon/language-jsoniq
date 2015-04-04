'use strict';

var JSONiqGrammar = require('./jsoniq-grammar');
var AutoCompleteProvider = require('./autocomplete-provider');

module.exports = {
    activate: function(){
        atom.grammars.addGrammar(new JSONiqGrammar(atom.grammars, {}));
        return this;
    },

    getAutocomplete: function(){
        return new AutoCompleteProvider();
    },

    deactivate: function(){
        return this.atomXQlint.destroy();
    }
};
