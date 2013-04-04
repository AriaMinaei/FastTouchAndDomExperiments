var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  var DommyType;

  return DommyType = (function() {
    function DommyType(name) {
      this.name = name;
      this.events = {};
      this.lazies = {};
    }

    DommyType.prototype.addEvent = function(eventName, listener) {
      if (!this.events[eventName]) {
        this.events[eventName] = [listener];
        return this;
      }
      this.events[eventName].push(listener);
      return this;
    };

    DommyType.prototype.getListeners = function(eventName) {
      var forName;

      forName = this.events[eventName];
      if (!forName) {
        return [];
      }
      return forName;
    };

    DommyType.prototype.addLazy = function(name, initializer) {
      this.lazies[name] = initializer;
      return this;
    };

    DommyType.prototype.getLazy = function(name) {
      return this.lazies[name];
    };

    return DommyType;

  })();
});

/*
//@ sourceMappingURL=type.map
*/
