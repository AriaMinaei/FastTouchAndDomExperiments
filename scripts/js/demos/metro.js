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
  (function() {
    var animate, began, d, div, els;

    return;
    div = 2000;
    began = Date.now();
    d = 0;
    els = document.querySelectorAll('.img');
    animate = function() {
      var el, transform, _i, _len;

      d = ((Date.now() - began) % div) / div;
      transform = 'rotate3d(0.1, 1, 0, ' + (d * Math.PI * 2) + 'rad)';
      for (_i = 0, _len = els.length; _i < _len; _i++) {
        el = els[_i];
        el.style.webkitTransform = transform;
      }
      return requestAnimationFrame(animate);
    };
    return animate();
  })();
  return dr(function() {});
});

/*
//@ sourceMappingURL=metro.map
*/
