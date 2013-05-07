define(['domReady', 'gesture/handler', 'dommy/dambo', 'dommy/dommy'], function(dr, GestureHandler, Dambo, Dommy) {
  var g;

  window.dambo = new Dambo;
  window.dommy = new Dommy;
  g = new GestureHandler;
  g.listen();
  return dr(function() {
    var transforms;

    transforms = {};
    return dambo.forThe('babs').addEvent('transform', function(e, id, el) {
      var t;

      console.log('t');
      if (!transforms[id]) {
        transforms[id] = t = dommy.styles.getTransform(id, el);
      } else {
        t = transforms[id];
      }
      t.temporarily().scale(e.scale, e.scale, 1).move(e.translateX, e.translateY, 0);
      return t.applyTo(el);
    }).addEvent('transform:finish', function(e, id, el) {
      transforms[id].commit();
      if (transforms[id]) {
        return transforms[id] = null;
      }
    }).addEvent('move', function(e, id, el) {
      var t;

      if (!transforms[id]) {
        transforms[id] = t = dommy.styles.getTransform(id, el);
      } else {
        t = transforms[id];
      }
      t.temporarily().move(e.translateX, e.translateY, 0);
      return t.applyTo(el);
    }).addEvent('move:finish', function(e, id, el) {
      transforms[id].commit();
      if (transforms[id]) {
        return transforms[id] = null;
      }
    });
  });
});

/*
//@ sourceMappingURL=gestures.map
*/
