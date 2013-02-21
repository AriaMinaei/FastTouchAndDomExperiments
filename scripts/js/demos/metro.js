
require(['domReady', 'gesture/handler', 'dommy/dommy'], function(dr, GestureHandler, Dommy) {
  window.dommy = new Dommy;
  return dr(function() {});
});
