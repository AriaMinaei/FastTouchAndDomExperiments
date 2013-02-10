(function() {
  var root;

  root = this;

  document.addEventListener("DOMContentLoaded", function() {
    var g;
    g = new GestureHandler(html);
    g.listen();
    root.g = g;
    return (function() {
      var transforms;
      transforms = {};
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

}).call(this);
