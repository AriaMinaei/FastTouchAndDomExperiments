
define([], function() {
  window.$ = function(id) {
    return document.getElementById(id);
  };
  window.$$ = function(selector) {
    return document.querySelectorAll(selector);
  };
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
      return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, el) {
        return window.setTimeout(callback, 16);
      };
    })();
  }
  return window.html = document.getElementsByTagName('html')[0];
});
