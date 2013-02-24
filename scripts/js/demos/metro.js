
require(['domReady', 'gesture/handler', 'dommy/dambo', 'dommy/dommy', 'type/scroll', 'benchmark'], function(dr, GestureHandler, Dambo, Dommy, Scroll, Benchmark) {
  window.dambo = new Dambo;
  window.dommy = new Dommy;
  GestureHandler.create();
  dambo.forThe('scroll').addLazy('scroll', function(id, dommy) {
    return new Scroll(id, dommy);
  }).addEvent('move', function(e, id, el, dommy) {
    return dommy.getLazy(id, 'scroll').scroll(e.translateX, e.translateY);
  }).addEvent('move-end', function(e, id, el, dommy) {
    return dommy.getLazy(id, 'scroll').release();
  });
  return dr(function() {});
});
