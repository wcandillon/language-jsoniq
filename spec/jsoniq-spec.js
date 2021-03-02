'use strict';

describe('JSONiq Grammar', function() {

    var grammar;

    beforeEach(function() {
        waitsForPromise(function() {
            return atom.packages.activatePackage('language-jsoniq');
        });
        return runs(function() {
            return grammar = atom.grammars.grammarForScopeName('source.jsoniq');
        });
    });

    it('parses the grammar', function() {
        expect(grammar).toBeTruthy();
        return expect(grammar.scopeName).toBe('source.jsoniq');
    });
});