'use strict';

module.exports = (function() {
    //TODO: https://github.com/atom-community/autocomplete-plus/wiki/Provider-API
    function AutoCompleteProvider(){

    }

    AutoCompleteProvider.prototype.getSuggestions = function(request){
        console.log(request);
    };

    AutoCompleteProvider.prototype.dispose = function() {

    };

    return AutoCompleteProvider;
})();
