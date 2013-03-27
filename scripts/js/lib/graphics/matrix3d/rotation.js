var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  var Rotation;
  return Rotation = (function() {

    function Rotation(x, y, z) {
      this.set(x, y, z);
    }

    Rotation.prototype.set = function(x, y, z) {
      this.x = parseFloat(x);
      this.y = parseFloat(y);
      return this.z = parseFloat(z);
    };

    Rotation.rotateX = function(alpha) {
      var alphaHalf, f, sc, sinAlphaHalf, sq;
      alphaHalf = alpha / 2;
      sinAlphaHalf = Math.sin(alphaHalf);
      sc = sinAlphaHalf * Math.cos(alphaHalf);
      sq = Math.pow(sinAlphaHalf, 2);
      f = 1 - (2 * sq);
      return [1, 0, 0, 0, 0, f, 2 * sc, 0, 0, -2 * sc, f, 0, 0, 0, 0, 1];
    };

    Rotation.rotateY = function(alpha) {
      var alphaHalf, f, sc, sinAlphaHalf, sq;
      alphaHalf = alpha / 2;
      sinAlphaHalf = Math.sin(alphaHalf);
      sc = sinAlphaHalf * Math.cos(alphaHalf);
      sq = Math.pow(sinAlphaHalf, 2);
      f = 1 - (2 * sq);
      return [f, 0, -2 * sc, 0, 0, 1, 0, 0, 2 * sc, 0, f, 0, 0, 0, 0, 1];
    };

    Rotation.rotateZ = function(alpha) {
      var alphaHalf, f, sc, sinAlphaHalf, sq;
      alphaHalf = alpha / 2;
      sinAlphaHalf = Math.sin(alphaHalf);
      sc = sinAlphaHalf * Math.cos(alphaHalf);
      sq = Math.pow(sinAlphaHalf, 2);
      f = 1 - (2 * sq);
      return [f, 2 * sc, 0, 0, -2 * sc, f, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    Rotation.rotate = function(x, y, z) {
      var cosx, cosy, cosz, sinx, siny, sinz;
      cosx = Math.cos(x);
      sinx = Math.sin(x);
      cosy = Math.cos(y);
      siny = Math.sin(y);
      cosz = Math.cos(z);
      sinz = Math.sin(z);
      return [cosy * cosz, cosx * sinz + sinx * siny * cosz, sinx * sinz - cosx * siny * cosz, 0, -cosy * sinz, cosx * cosz - sinx * siny * sinz, sinx * cosz + cosx * siny * sinz, 0, siny, -sinx * cosy, cosx * cosy, 0, 0, 0, 0, 1];
    };

    Rotation.prototype.getMatrix = function() {
      return Rotation.rotate(this.x, this.y, this.z);
    };

    return Rotation;

  })();
});
