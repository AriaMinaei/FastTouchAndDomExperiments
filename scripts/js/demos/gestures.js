
require(['domReady', 'gesture/handler', 'dommy/dambo', 'dommy/dommy'], function(dr, GestureHandler, Dambo, Dommy) {
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
      return dambo.forThe('babs').addEvent('instant-transform', function(e, id, el) {
        var t;
        if (!transforms[id]) {
          transforms[id] = t = dommy.styles.getTransform(id, el);
        } else {
          t = transforms[id];
        }
        t.temporarily()._scale(e.scale, e.scale, 1).translate(e.translateX, e.translateY, 0);
        return t.apply(el);
      }).addEvent('instant-transform-end', function(e, id, el) {
        transforms[id].commit(el);
        if (transforms[id]) {
          return transforms[id] = null;
        }
      }).addEvent('instant-move', function(e, id, el) {
        var t;
        if (!transforms[id]) {
          transforms[id] = t = dommy.styles.getTransform(id, el);
        } else {
          t = transforms[id];
        }
        t.temporarily().translate(e.translateX, e.translateY, 0);
        return t.apply(el);
      }).addEvent('instant-move-end', function(e, id, el) {
        transforms[id].commit(el);
        if (transforms[id]) {
          return transforms[id] = null;
        }
      });
    })();
  });
});
