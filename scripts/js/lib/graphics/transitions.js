var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['native'], function() {
  var Transitions;
  Transitions = {
    linear: function(p) {
      return p;
    }
  };
  Transitions.define = function(name, func) {
    var _func, _name;
    if (typeof name === 'object') {
      for (_name in name) {
        _func = name[_name];
        Transitions.define(_name, _func);
      }
      return;
    }
    return Transitions[name] = {
      easeIn: func,
      easeOut: function(p) {
        return 1 - func(1 - p);
      },
      easeInOut: function(p) {
        if (p <= 0.5) {
          return 0.5 * func(p * 2);
        } else {
          return 0.5 * (2 - func(2 * (1 - p)));
        }
      }
    };
  };
  Transitions.define({
    quad: function(p) {
      return Math.pow(p, 2);
    },
    cubic: function(p) {
      return Math.pow(p, 3);
    },
    quart: function(p) {
      return Math.pow(p, 4);
    },
    quint: function(p) {
      return Math.pow(p, 5);
    },
    expo: function(p) {
      return Math.pow(2, 8 * (p - 1));
    },
    circ: function(p) {
      return 1 - Math.sin(Math.cos(p));
    },
    sine: function(p) {
      return 1 - Math.cos(p * Math.PI / 2);
    }
  });
  return Transitions;
});
