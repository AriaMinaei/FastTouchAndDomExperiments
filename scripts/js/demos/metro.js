
require(['domReady', 'gesture/handler', 'dommy/dambo', 'dommy/dommy', 'type/scrolls', 'benchmark', 'graphics/transitions'], function(dr, GestureHandler, Dambo, Dommy, Scrolls, Benchmark, Transitions) {
  window.dambo = new Dambo;
  window.dommy = new Dommy;
  GestureHandler.create();
  dambo.forThe('scrolls').addLazy('scrolls', function(id, dommy) {
    return new Scrolls(id, dommy);
  }).addEvent('move-persistent', function(e, id, el, dommy) {
    return dommy.getLazy(id, 'scrolls').drag(e.translateX, e.translateY);
  }).addEvent('move-persistent:release', function(e, id, el, dommy) {
    return dommy.getLazy(id, 'scrolls').release(e.finish);
  }).addEvent('move-persistent:finish', function(e, id, el, dommy) {
    return dommy.getLazy(id, 'scrolls').finish();
  });
  dambo.forThe('stress').addEvent('tap', function(e, id, el, dommy) {
    return el.classList.toggle('stress');
  });
  return dr(function() {});
});
