
define(['./standard/tap', './standard/hold', './standard/move', './standard/transform'], function(tap, hold, move, transform) {
  return function(defineGesture) {
    tap(defineGesture);
    hold(defineGesture);
    move(defineGesture);
    return transform(defineGesture);
  };
});
