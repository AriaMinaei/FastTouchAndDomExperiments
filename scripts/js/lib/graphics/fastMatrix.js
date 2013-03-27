var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  var FastMatrix, clone16, identity, multiply;
  clone16 = function(r) {
    return [r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]];
  };
  multiply = function(a, b) {
    return [a[0] * b[0] + a[1] * b[4] + a[2] * b[8], a[0] * b[1] + a[1] * b[5] + a[2] * b[9], a[0] * b[2] + a[1] * b[6] + a[2] * b[10], 0, a[4] * b[0] + a[5] * b[4] + a[6] * b[8], a[4] * b[1] + a[5] * b[5] + a[6] * b[9], a[4] * b[2] + a[5] * b[6] + a[6] * b[10], 0, a[8] * b[0] + a[9] * b[4] + a[10] * b[8], a[8] * b[1] + a[9] * b[5] + a[10] * b[9], a[8] * b[2] + a[9] * b[6] + a[10] * b[10], 0, a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + b[12], a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + b[13], a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + b[14], 1];
  };
  identity = function() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  };
  FastMatrix = (function() {

    function FastMatrix(arg) {
      if (Array.isArray(arg)) {
        this.r = arg;
      } else if (typeof arg === 'string') {
        this.fromString(arg);
      } else {
        this.r = identity();
      }
    }

    FastMatrix.prototype.fromMatrix = function(m) {
      this.r = clone16(m.r);
      return this;
    };

    FastMatrix.prototype.copy = function() {
      return new FastMatrix(clone16(this.r));
    };

    FastMatrix.prototype.toString = function() {
      var a;
      a = this.r;
      return 'matrix3d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
    };

    FastMatrix.prototype.fromString = function(s) {
      var temp;
      if (s.substr(8, 1) === '(') {
        s = s.substr(9, s.length - 10);
        this.r = s.split(', ').map(parseFloat);
      } else if (s.substr(6, 1) === '(') {
        s = s.substr(7, s.length - 8);
        temp = s.split(', ').map(parseFloat);
        this.r = [temp[0], temp[1], 0, 0, temp[2], temp[3], 0, 0, 0, 0, 1, 0, temp[4], temp[5], 0, 1];
      } else if (s[0] === 'n') {
        this.r = identity();
      } else {
        throw Error('Unkown matrix format');
      }
      return this;
    };

    FastMatrix.prototype.fromWebkit = function(w) {
      this.r = [w.m11, w.m12, w.m13, w.m14, w.m21, w.m22, w.m23, w.m24, w.m31, w.m32, w.m33, w.m34, w.m41, w.m42, w.m43, w.m44];
      return this;
    };

    FastMatrix.prototype.setTranslate = function(x, y, z) {
      if (z == null) {
        z = 0;
      }
      this.r[12] = parseFloat(x);
      this.r[13] = parseFloat(y);
      this.r[14] = parseFloat(z);
      return this;
    };

    FastMatrix.prototype.setTranslateX = function(x) {
      this.r[12] = parseFloat(x);
      return this;
    };

    FastMatrix.prototype.setTranslateY = function(y) {
      this.r[13] = parseFloat(y);
      return this;
    };

    FastMatrix.prototype.setTranslateZ = function(z) {
      this.r[14] = parseFloat(z);
      return this;
    };

    FastMatrix.prototype.translate = function(x, y, z) {
      if (z == null) {
        z = 0;
      }
      this.r[12] += parseFloat(x);
      this.r[13] += parseFloat(y);
      this.r[14] += parseFloat(z);
      return this;
    };

    FastMatrix.prototype.translateX = function(x) {
      this.r[12] += parseFloat(x);
      return this;
    };

    FastMatrix.prototype.translateY = function(y) {
      this.r[13] += parseFloat(y);
      return this;
    };

    FastMatrix.prototype.translateZ = function(z) {
      this.r[14] += parseFloat(z);
      return this;
    };

    /*
    		 # Here is where it gets creepy!
    		 # 
    		 # All methods starting with '_' are supposed to work on matrixes
    		 # that dont have any pair of [rotation, scale, skew] at the same time.
    		 #
    		 # For example, if a matrix has a scale other than [1, 1, 1], then you can't
    		 # apply a rotation to it, or it will look weired.
    		 #
    		 # But since many transformations don't have these pairs, we can use these fast functions
    		 # to save some calculation time.
    */


    FastMatrix.prototype._setScale = function(x, y, z) {
      this.r[0] = parseFloat(x);
      this.r[5] = parseFloat(y);
      this.r[10] = parseFloat(x);
      return this;
    };

    FastMatrix.prototype._setScaleX = function(x) {
      this.r[0] = parseFloat(x);
      return this;
    };

    FastMatrix.prototype._setScaleY = function(y) {
      this.r[5] = parseFloat(y);
      return this;
    };

    FastMatrix.prototype._setScaleZ = function(z) {
      this.r[10] = parseFloat(z);
      return this;
    };

    FastMatrix.prototype._scale = function(x, y, z) {
      this.r[0] *= parseFloat(x);
      this.r[5] *= parseFloat(y);
      this.r[10] *= parseFloat(x);
      return this;
    };

    FastMatrix.prototype._scaleX = function(x) {
      this.r[0] *= parseFloat(x);
      return this;
    };

    FastMatrix.prototype._scaleY = function(y) {
      this.r[5] *= parseFloat(y);
      return this;
    };

    FastMatrix.prototype._scaleZ = function(z) {
      this.r[10] *= parseFloat(z);
      return this;
    };

    FastMatrix.prototype._setRotation = function(x, y, z) {
      var cosx, cosy, cosz, sinx, siny, sinz;
      cosx = Math.cos(x);
      sinx = Math.sin(x);
      cosy = Math.cos(y);
      siny = Math.sin(y);
      cosz = Math.cos(z);
      sinz = Math.sin(z);
      this.r[0] = cosy * cosz;
      this.r[1] = cosx * sinz + sinx * siny * cosz;
      this.r[2] = sinx * sinz - cosx * siny * cosz;
      this.r[4] = -cosy * sinz;
      this.r[5] = cosx * cosz - sinx * siny * sinz;
      this.r[6] = sinx * cosz + cosx * siny * sinz;
      this.r[8] = siny;
      this.r[9] = -sinx * cosy;
      this.r[10] = cosx * cosy;
      return this;
    };

    FastMatrix.prototype._setRotationX = function(x) {
      var cosx, sinx;
      cosx = Math.cos(x);
      sinx = Math.sin(x);
      this.r[5] = cosx;
      this.r[6] = sinx;
      this.r[9] = -sinx;
      this.r[10] = cosx;
      return this;
    };

    FastMatrix.prototype._setRotationY = function(y) {
      var cosy, siny;
      cosy = Math.cos(y);
      siny = Math.sin(y);
      this.r[0] = cosy;
      this.r[2] = -siny;
      this.r[8] = siny;
      this.r[10] = cosy;
      return this;
    };

    FastMatrix.prototype._setRotationZ = function(z) {
      var cosz, sinz;
      cosz = Math.cos(z);
      sinz = Math.sin(z);
      this.r[0] = cosz;
      this.r[1] = sinz;
      this.r[4] = -sinz;
      this.r[5] = cosz;
      return this;
    };

    return FastMatrix;

  })();
  FastMatrix.identity = identity;
  FastMatrix.clone16 = clone16;
  FastMatrix.multiply = multiply;
  return FastMatrix;
});
