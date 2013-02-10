(function() {
  var root;

  root = this;

  document.addEventListener("DOMContentLoaded", function() {
    var g;
    g = new Dommy.Gesture.Handler(html);
    g.listen();
    root.g = g;
    return (function() {
      var started, times, transforms;
      transforms = {};
      times = 0;
      started = 0;
      dommy.addEvent('babs', 'instantmove', function(e, id, el) {
        var t;
        if (!started) {
          started = Date.now();
        }
        times++;
        if (!transforms[id]) {
          transforms[id] = t = dommy.styles.getTransform(id, el);
        } else {
          t = transforms[id];
        }
        t.temporarily().translate(e.translateX, e.translateY, 0);
        return t.apply(el);
      });
      return dommy.addEvent('babs', 'instantmove-end', function(e, id, el) {
        console.log('fired ' + times + ' in ' + (Date.now() - started) + '. average: ' + (times / (Date.now() - started) * 1000));
        transforms[id].commit(el);
        if (transforms[id]) {
          return transforms[id] = null;
        }
      });
    })();
  });

}).call(this);
