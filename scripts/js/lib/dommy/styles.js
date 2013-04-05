var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['dommy/styles/transform'], function(Transform) {
  var Styles;

  return Styles = (function() {
    function Styles(dommy) {
      this.dommy = dommy;
    }

    Styles.prototype.getTransform = function(id, el) {
      var transform;

      transform = this.dommy.get(id, '_style.transform');
      if (!transform) {
        transform = new Transform(this.dommy, id, el);
        this.dommy.set(id, '_style.transform', transform);
      }
      return transform;
    };

    return Styles;

  })();
});

/*
//@ sourceMappingURL=styles.map
*/
