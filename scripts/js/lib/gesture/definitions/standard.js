var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['./standard/tap', './standard/hold', './standard/move', './standard/transform'], function(tap, hold, move, transform) {
  return function(defineGesture) {
    defineGesture(tap);
    defineGesture(hold);
    defineGesture(move);
    return defineGesture(transform);
  };
});

/*
//@ sourceMappingURL=standard.map
*/
