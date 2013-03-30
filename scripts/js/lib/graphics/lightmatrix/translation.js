var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  var Translation;

  return Translation = {
    components: function(x, y, z) {
      return {
        m41: x,
        m42: y,
        m43: z
      };
    },
    matrix: function(x, y, z) {
      return {
        m11: 1,
        m12: 0,
        m13: 0,
        m14: 0,
        m21: 0,
        m22: 1,
        m23: 0,
        m24: 0,
        m31: 0,
        m32: 0,
        m33: 1,
        m34: 0,
        m41: x,
        m42: y,
        m43: z,
        m44: 1
      };
    },
    applyTo: function(b, x, y, z) {
      var a;

      a = Translation.components(x, y, z);
      b.m41 = a.m41 * b.m11 + a.m42 * b.m21 + a.m43 * b.m31 + b.m41;
      b.m42 = a.m41 * b.m12 + a.m42 * b.m22 + a.m43 * b.m32 + b.m42;
      b.m43 = a.m41 * b.m13 + a.m42 * b.m23 + a.m43 * b.m33 + b.m43;
      b.m44 = a.m41 * b.m14 + a.m42 * b.m24 + a.m43 * b.m34 + b.m44;
      return b;
    }
  };
});

/*
//@ sourceMappingURL=translation.map
*/