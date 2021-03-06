var define,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['gesture/definitions/standard'], function(setupStandardDefinitions) {
  var BasicGesture, Definitions, classes, defineGesture;

  classes = {};
  classes['basic'] = BasicGesture = (function() {
    function BasicGesture() {}

    BasicGesture.prototype.check = function(h) {
      return -1;
    };

    BasicGesture.prototype.init = function() {};

    BasicGesture.prototype.start = function(h, e) {};

    BasicGesture.prototype.end = function(h, e) {};

    BasicGesture.prototype.move = function(h, e) {};

    BasicGesture.prototype.cancel = function(h, e) {
      return console.log('cancel');
    };

    BasicGesture.prototype.shouldFinish = function(h) {
      return true;
    };

    BasicGesture.prototype.finish = function(h) {
      return h.fireCustom(this.name + ':finish', {});
    };

    return BasicGesture;

  })();
  Definitions = {
    list: {},
    define: function(structure) {
      var ExtendsFrom, NewGesture, key, name;

      name = structure.name;
      ExtendsFrom = (function() {
        var extendsFrom;

        extendsFrom = structure["extends"] || 'basic';
        return classes[extendsFrom];
      })();
      NewGesture = function() {
        return NewGesture.__super__.constructor.apply(this, arguments);
      };
      __extends(NewGesture, ExtendsFrom);
      for (key in structure) {
        NewGesture.prototype[key] = structure[key];
      }
      classes[name] = NewGesture;
      return Definitions.list[name] = new NewGesture();
    }
  };
  defineGesture = function(what) {
    return Definitions.define(what);
  };
  setupStandardDefinitions(defineGesture);
  return Definitions;
});

/*
//@ sourceMappingURL=definitions.map
*/
