
require(['domReady', 'gesture/handler', 'dommy/dommy'], function(dr, GestureHandler, Dommy) {
  window.dommy = new Dommy;
  return dr(function() {
    var g, html;
    html = document.querySelector('html');
    g = new GestureHandler(html);
    g.listen();
    window.g = g;
    return (function() {
      var transforms;
      transforms = {};
      dommy.addEvent('babs', 'instanttransform', function(e, id, el) {
        var t;
        if (!transforms[id]) {
          transforms[id] = t = dommy.styles.getTransform(id, el);
        } else {
          t = transforms[id];
        }
        t.temporarily()._scale(e.scale, e.scale, 1).translate(e.translateX, e.translateY, 0);
        return t.apply(el);
      });
      dommy.addEvent('babs', 'instanttransform-end', function(e, id, el) {
        transforms[id].commit(el);
        if (transforms[id]) {
          return transforms[id] = null;
        }
      });
      dommy.addEvent('babs', 'instantmove', function(e, id, el) {
        var t;
        if (!transforms[id]) {
          transforms[id] = t = dommy.styles.getTransform(id, el);
        } else {
          t = transforms[id];
        }
        t.temporarily().translate(e.translateX, e.translateY, 0);
        return t.apply(el);
      });
      return dommy.addEvent('babs', 'instantmove-end', function(e, id, el) {
        transforms[id].commit(el);
        if (transforms[id]) {
          return transforms[id] = null;
        }
      });
    })();
  });
});
