var JSONiqGrammar,
__hasProp = {}.hasOwnProperty,
__extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
__indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

var $ = require("atom").$;

var Grammar = require(atom.config.resourcePath + '/node_modules/first-mate/lib/grammar.js');

module.exports = JSONiqGrammar = (function(_super) {
  __extends(JSONiqGrammar, _super);

  function JSONiqGrammar(registry) {
    var name = 'JSONiq (Semantic Highlighting)';
    var scopeName = 'source.js-semantic';
    JSONiqGrammar.__super__.constructor.call(this, registry, {
      name: name,
      scopeName: scopeName
    });
  }

  JSONiqGrammar.prototype.getScore = function() {
    return 0;
  };

  JSONiqGrammar.prototype.tokenizeLine = function(line, ruleStack, firstLine) {
    console.log(line);
    console.log(ruleStack);
    console.log(firstLine);
    console.log('====');
  };

  return JSONiqGrammar;

})(Grammar);
