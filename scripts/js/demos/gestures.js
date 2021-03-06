define(['domReady', 'gesture/handler', 'dommy/dambo', 'dommy/dommy'], function(dr, GestureHandler, Dambo, Dommy) {
  var g;

  window.dambo = new Dambo;
  window.dommy = new Dommy;
  g = new GestureHandler(document);
  g.listen();
  window.g = g;
  return dr(function() {
    return (function() {
      var transforms;

      transforms = {};
      return dambo.forThe('babs').addEvent('transform-instant', function(e, id, el) {
        var t;

        if (!transforms[id]) {
          transforms[id] = t = dommy.styles.getTransform(id, el);
        } else {
          t = transforms[id];
        }
        t.temporarily().scale(e.scale, e.scale, 1).move(e.translateX, e.translateY, 0);
        return t.applyTo(el);
      }).addEvent('transform-instant:finish', function(e, id, el) {
        transforms[id].commit();
        if (transforms[id]) {
          return transforms[id] = null;
        }
      }).addEvent('move-instant', function(e, id, el) {
        var t;

        if (!transforms[id]) {
          transforms[id] = t = dommy.styles.getTransform(id, el);
        } else {
          t = transforms[id];
        }
        t.temporarily().move(e.translateX, e.translateY, 0);
        return t.applyTo(el);
      }).addEvent('move-instant:finish', function(e, id, el) {
        transforms[id].commit();
        if (transforms[id]) {
          return transforms[id] = null;
        }
      });
    })();
  });
});

/*
//@ sourceMappingURL=gestures.map
*/
