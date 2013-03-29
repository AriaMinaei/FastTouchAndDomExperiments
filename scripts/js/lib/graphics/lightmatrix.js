var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['./matrix3d/base', './matrix3d/skew', './matrix3d/scale', './matrix3d/perspective', './matrix3d/rotation', './matrix3d/translation'], function(Base, Skew, Scale, Perspective, Rotation, Translation) {
  var LightMatrix;

  return LightMatrix = (function() {
    function LightMatrix() {}

    return LightMatrix;

  })();
});

/*
//@ sourceMappingURL=lightmatrix.map
*/
