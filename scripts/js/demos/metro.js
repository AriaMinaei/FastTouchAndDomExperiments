
require(['domReady', 'gesture/handler', 'dommy/dambo', 'dommy/dommy', 'type/scrolls', 'benchmark'], function(dr, GestureHandler, Dambo, Dommy, Scrolls, Benchmark) {
  window.dambo = new Dambo;
  window.dommy = new Dommy;
  GestureHandler.create();
  dambo.forThe('scrolls').addLazy('scrolls', function(id, dommy) {
    return new Scrolls(id, dommy);
  }).addEvent('move', function(e, id, el, dommy) {
    return dommy.getLazy(id, 'scrolls').scroll(e.translateX, e.translateY);
  }).addEvent('move-end', function(e, id, el, dommy) {
    return dommy.getLazy(id, 'scrolls').release();
  });
  return dr(function() {});
});
