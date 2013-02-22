
require(['domReady', 'gesture/handler', 'dommy/dambo', 'dommy/dommy', 'benchmark'], function(dr, GestureHandler, Dambo, Dommy, Benchmark) {
  window.dambo = new Dambo;
  window.dommy = new Dommy;
  dambo.forThe('scroll-wrapper').addLazy('scroll', function(id, dommy) {
    console.log('initializing scroller');
    return {
      baloon: 'is mine'
    };
  }).addEvent('move', function(e, id, el, dommy) {
    return dommy.getLazy(id, 'scroll').scroll(e.translateX, e.translateY);
  }).addEvent('move-end', function(e, id, el, dommy) {
    return dommy.getLazy(id, 'scroll').commit();
  });
  GestureHandler.create();
  return dr(function() {});
});
