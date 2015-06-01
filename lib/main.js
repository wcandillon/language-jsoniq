'use strict';

module.exports = {
  deactivate: function(){
    return this.atomXQlint.destroy();
  }
};
