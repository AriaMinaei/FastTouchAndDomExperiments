var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  window.$ = function(id) {
    return document.getElementById(id);
  };
  window.$$ = function(selector) {
    return document.querySelectorAll(selector);
  };
  return (function() {
    var time, vendor, vendors, _i, _len, _results;

    time = 0;
    vendors = ['ms', 'moz', 'webkit'];
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
});

/*
//@ sourceMappingURL=dom.map
*/
