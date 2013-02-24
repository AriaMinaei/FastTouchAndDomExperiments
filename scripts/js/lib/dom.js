
define([], function() {
  window.$ = function(id) {
    return document.getElementById(id);
  };
  window.$$ = function(selector) {
    return document.querySelectorAll(selector);
  };
  return (function() {
    var time, vendor, vendors, _i, _len;
    time = 0;
    vendors = ['ms', 'moz', 'webkit'];
    for (_i = 0, _len = vendors.length; _i < _len; _i++) {
      vendor = vendors[_i];
      if (!(!window.requestAnimationFrame)) {
        continue;
      }
      window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame'];
      window.cancelRequestAnimationFrame = window[vendor + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        var delta, now, old;
        now = new Date().getTime();
        delta = Math.max(0, 16 - (now - old));
        setTimeout((function() {
          return callback(time + delta);
        }), delta);
        return old = now + delta;
      };
    }
    if (!window.cancelAnimationFrame) {
      return window.cancelAnimationFrame = function(id) {
        return clearTimeout(id);
      };
    }
  })();
});
