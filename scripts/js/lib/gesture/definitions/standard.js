var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['./standard/tap', './standard/hold', './standard/move', './standard/transform'], function(tap, hold, move, transform) {
  return function(defineGesture) {
    tap(defineGesture);
    hold(defineGesture);
    move(defineGesture);
    return transform(defineGesture);
  };
});

/*
//@ sourceMappingURL=standard.map
*/
