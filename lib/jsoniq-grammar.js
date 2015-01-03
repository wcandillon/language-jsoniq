'use strict';

var JSONiqGrammar,
__hasProp = {}.hasOwnProperty,
__extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
__indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

var $ = require("atom").$;

var Grammar = require(atom.config.resourcePath + '/node_modules/first-mate/lib/grammar.js');
var xqlintLib = require('xqlint');
var JSONiqLexer = xqlintLib.JSONiqLexer;
var XQueryLexer = xqlintLib.XQueryLexer;


module.exports = JSONiqGrammar = (function(_super) {
  __extends(JSONiqGrammar, _super);

  function JSONiqGrammar(registry) {
    var name = 'JSONiq';
    var scopeName = 'source.jq';
    JSONiqGrammar.__super__.constructor.call(this, registry, {
      name: name,
      scopeName: scopeName
    });
  }

  JSONiqGrammar.prototype.getScore = function(filePath, content) {
    if(filePath && (filePath.substring(filePath.lastIndexOf('.')) === '.jq' || filePath.substring(filePath.lastIndexOf('.')) === '.xq')) {
      var isJSONiq = (
          (filePath.substring(filePath.length - '.jq'.length).indexOf('.jq') !== -1) &&
          content.indexOf('xquery version') !== 0) || content.indexOf('jsoniq version') === 0;
      this.lexer = isJSONiq ? new JSONiqLexer() : new XQueryLexer();
      return 2;
    }
    return -1;
  };

  JSONiqGrammar.prototype.mapScope = function(type){
    if(type === 'meta.tag') {
      return 'entity.name.tag';
    } else {
      return type;
    }
  };

  JSONiqGrammar.prototype.tokenizeLine = function(line, ruleStack, firstLine) {
    var that = this;
    if(firstLine && line.indexOf('xquery version') === 0) {
      this.lexer = new XQueryLexer();
    }
    if(firstLine && line.indexOf('jsoniq version') === 0) {
      this.lexer = new JSONiqLexer();
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
