var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  (function() {
    var vendor, vendors, _i, _len, _results;

    vendors = ['webkit', 'moz'];
    _results = [];
    for (_i = 0, _len = vendors.length; _i < _len; _i++) {
      vendor = vendors[_i];
      if (!(!window.requestAnimationFrame)) {
        continue;
      }
      window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame'];
      _results.push(window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame']);
    }
    return _results;
  })();
  return null;
});

/*
//@ sourceMappingURL=shims.map
*/
