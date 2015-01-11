'use strict';

var __extends = function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) {
          d[p] = b[p];
        }
      }
      function __() {
        /*jshint validthis:true */
        this.constructor = d;
      }
      __.prototype = b.prototype;
      d.prototype = new __();
};

var Grammar = require(atom.config.resourcePath + '/node_modules/first-mate/lib/grammar.js');
var xqlintLib = require('xqlint');
var JSONiqLexer = xqlintLib.JSONiqLexer;
var XQueryLexer = xqlintLib.XQueryLexer;

module.exports = (function(_super) {

  function JSONiqGrammar(registry) {
    var name = 'JSONiq';
    var scopeName = 'source.jq';
    _super.call(this, registry, {
      name: name,
      scopeName: scopeName,
      fileTypes: ['jq', 'xq']
    });
  }
  __extends(JSONiqGrammar, _super);

  JSONiqGrammar.prototype.mapScope = function(type){
    if(type === 'meta.tag' || type === 'meta.tag.r') {
      return 'entity.name.tag';
    } else {
      return type;
    }
  };

  JSONiqGrammar.prototype.tokenizeLines = function(text) {
    var lines = text.split('\n');
    var ruleStack = null;
    var _results = [];
    lines.forEach(function(line, i){
      var ref = this.tokenizeLine(line, ruleStack, i === 0);
      ruleStack = ref.ruleStack;
      _results.push(ref.tokens);
    });
    return _results;
  };

  JSONiqGrammar.prototype.tokenizeLine = function(line, ruleStack, firstLine) {
    var that = this;
    if(firstLine && line.indexOf('xquery version') === 0) {
      this.lexer = new XQueryLexer();
    } else if(firstLine && line.indexOf('jsoniq version') === 0) {
      this.lexer = new JSONiqLexer();
    } else if(firstLine) {
      var path = atom.workspace.getActiveEditor() ? atom.workspace.getActiveEditor().getPath() : '';
      if(!path) {
        path = '';
      }
      this.lexer = path.substring(path.lastIndexOf('.')) === '.jq'  ? new JSONiqLexer() : new XQueryLexer();
    }
    ruleStack = ruleStack ? ruleStack : ['start'];
    var tokens = this.lexer.getLineTokens(line, JSON.stringify(ruleStack));
    var t = [];
    tokens.tokens.forEach(function(token){
      t.push(that.registry.createToken(token.value, ['source.jq.' + that.mapScope(token.type)]));
    });
    t.push(that.registry.createToken('', ['source.jq']));
    return {
      tokens: t,
      ruleStack: JSON.parse(tokens.state)
    };
  };

  return JSONiqGrammar;

})(Grammar);
