var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['dommy/styles/transform'], function(DommyStylesTransform) {
  var DommyStyles;

  return DommyStyles = (function() {
    function DommyStyles(dommy) {
      this.dommy = dommy;
    }

    DommyStyles.prototype.getTransform = function(fastId, el) {
      var t;

      t = this.dommy._get(fastId, 'style.transform');
      if (!t) {
        t = new DommyStylesTransform(this.dommy, fastId, el);
        this.dommy._set(fastId, 'style.transform', t);
      }
      return t;
    };

    return DommyStyles;

  })();
});

/*
//@ sourceMappingURL=styles.map
*/
