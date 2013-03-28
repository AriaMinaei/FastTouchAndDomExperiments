var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  var Base, clone16, fromString, fromWebkit, identity, matrix2Matrix3d, multiply, toWebkit;

  Base = {};
  clone16 = Base.clone16 = function(r) {
    return [r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]];
  };
  multiply = Base.multiply = function(b, a) {
    return [a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12], a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13], a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14], a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15], a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12], a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13], a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14], a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15], a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12], a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13], a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14], a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15], a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12], a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13], a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14], a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]];
  };
  identity = Base.identity = function() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  };
  matrix2Matrix3d = Base.matrix2Matrix3d = function(matrix) {
    return [matrix[0], matrix[1], 0, 0, matrix[2], matrix[3], 0, 0, 0, 0, 1, 0, matrix[4], matrix[5], 0, 1];
  };
  fromString = Base.css2Array = function(s) {
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
  fromWebkit = Base.webkitToArray = function(w) {
    return [w.m11, w.m12, w.m13, w.m14, w.m21, w.m22, w.m23, w.m24, w.m31, w.m32, w.m33, w.m34, w.m41, w.m42, w.m43, w.m44];
  };
  toWebkit = Base.arrayToWebkit = function(r) {
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
  return Base;
});

/*
//@ sourceMappingURL=base.map
*/
