var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  var Matrix3d, Perspective, Rotation, clone16, fromString, fromWebkit, identity, multiply, toWebkit;
  clone16 = function(r) {
    return [r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]];
  };
  multiply = function(b, a) {
    return [a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12], a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13], a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14], a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15], a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12], a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13], a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14], a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15], a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12], a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13], a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14], a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15], a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12], a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13], a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14], a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]];
  };
  identity = function() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  };
  fromString = function(s) {
    result;

    var result, temp;
    if (s.substr(8, 1) === '(') {
      s = s.substr(9, s.length - 10);
      result = s.split(', ').map(parseFloat);
    } else if (s.substr(6, 1) === '(') {
      s = s.substr(7, s.length - 8);
      temp = s.split(', ').map(parseFloat);
      result = [temp[0], temp[1], 0, 0, temp[2], temp[3], 0, 0, 0, 0, 1, 0, temp[4], temp[5], 0, 1];
    } else if (s[0] === 'n') {
      result = identity();
    } else {
      throw Error('Unkown matrix format');
    }
    return result;
  };
  fromWebkit = function(w) {
    return [w.m11, w.m12, w.m13, w.m14, w.m21, w.m22, w.m23, w.m24, w.m31, w.m32, w.m33, w.m34, w.m41, w.m42, w.m43, w.m44];
  };
  toWebkit = function(r) {
    var w;
    w = new WebKitCSSMatrix;
    w.m11 = r[0];
    w.m12 = r[1];
    w.m13 = r[2];
    w.m14 = r[3];
    w.m21 = r[4];
    w.m22 = r[5];
    w.m23 = r[6];
    w.m24 = r[7];
    w.m31 = r[8];
    w.m32 = r[9];
    w.m33 = r[10];
    w.m34 = r[11];
    w.m41 = r[12];
    w.m42 = r[13];
    w.m43 = r[14];
    w.m44 = r[15];
    return w;
  };
  Rotation = (function() {

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
  Perspective = (function() {

    function Perspective(d) {
      this.set(d);
    }

    Perspective.prototype.set = function(d) {
      return this.d = parseFloat(d);
    };

    Perspective.prototype.getMatrix = function() {
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -1 / this.d, 0, 0, 0, 1];
    };

    return Perspective;

  })();
  Matrix3d = (function() {

    function Matrix3d(arg) {
      this._perspective = new Perspective(1500.0);
      this._hasPerspective = false;
      this._rotation = new Rotation(0.0, 0.0, 0.0);
      this._hasRotation = false;
      if (Array.isArray(arg)) {
        this.r = arg;
      } else if (typeof arg === 'string') {
        this.fromString(arg);
      } else {
        this.r = identity();
      }
    }

    Matrix3d.prototype.fromMatrix = function(m) {
      this.r = clone16(m.r);
      return this;
    };

    Matrix3d.prototype.copy = function() {
      return new FastMatrix(clone16(this.r));
    };

    Matrix3d.prototype.toString = function() {
      var a;
      this.generateMatrix();
      a = this.r;
      return 'matrix3d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
    };

    Matrix3d.prototype.generateMatrix = function() {
      var result;
      result = null;
      if (this._hasPerspective) {
        result = this._perspective.getMatrix();
      } else {
        result = identity();
      }
      if (this._hasRotation) {
        result = multiply(result, this._rotation.getMatrix());
      }
      return this.r = result;
    };

    Matrix3d.prototype.fromString = function(s) {
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

    Matrix3d.prototype.fromWebkit = function(w) {
      this.r = [w.m11, w.m12, w.m13, w.m14, w.m21, w.m22, w.m23, w.m24, w.m31, w.m32, w.m33, w.m34, w.m41, w.m42, w.m43, w.m44];
      return this;
    };

    Matrix3d.prototype.setPerspective = function(d) {
      this._perspective.set(d);
      return this._hasPerspective = true;
    };

    Matrix3d.prototype.setRotation = function(x, y, z) {
      this._rotation.set(x, y, z);
      return this._hasRotation = true;
    };

    return Matrix3d;

  })();
  Matrix3d.Rotation = Rotation;
  Matrix3d.fromString = fromString;
  Matrix3d.fromWebkit = fromWebkit;
  Matrix3d.toWebkit = toWebkit;
  Matrix3d.multiply = multiply;
  return Matrix3d;
});
