var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['dommy/dambo/type'], function(Type) {
  var Dambo;
  Dambo = (function() {

    function Dambo() {
      this.types = {};
    }

    Dambo.prototype.forThe = function(name) {
      if (!this.types[name]) {
        this.types[name] = new Type(name);
      }
      return this.types[name];
    };

    return Dambo;

  })();
  return Dambo;
});
