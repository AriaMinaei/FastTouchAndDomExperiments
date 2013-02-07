(function() {
  var root;

  root = this;

  document.addEventListener("DOMContentLoaded", function() {
    var g;
    g = new GestureHandler(html);
    (function() {
      var raf, rafactive, rafdo, transforms;
      transforms = {};
      rafactive = false;
      raf = null;
      rafdo = function() {};
      dommy.addEvent('babs', 'instantmove', function(e, id, el) {
        var t;
        if (!transforms[id]) {
          transforms[id] = t = dommy.styles.getTransform(id, el);
        } else {
          t = transforms[id];
        }
        t.temporarily()._setRotationY(e.translateX * Math.PI / 720).translate(e.translateX, e.translateY, 0);
        return t.apply(el);
      });
      return dommy.addEvent('babs', 'instantmove-end', function(e, id, el) {
        console.log('received instantmove-end event for', e);
        transforms[id].commit(el);
        if (transforms[id]) {
          return transforms[id] = null;
        }
      });
    })();
    g.listen();
    return root.g = g;
  });

}).call(this);
