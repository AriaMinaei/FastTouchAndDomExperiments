(function() {
  var Graphics, clone16, identity, multiply;

  Graphics = {};

  window.Graphics = Graphics;

  clone16 = function(r) {
    return [r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]];
  };

  multiply = function(a, b) {
    return [a[0] * b[0] + a[1] * b[4] + a[2] * b[8], a[0] * b[1] + a[1] * b[5] + a[2] * b[9], a[0] * b[2] + a[1] * b[6] + a[2] * b[10], 0, a[4] * b[0] + a[5] * b[4] + a[6] * b[8], a[4] * b[1] + a[5] * b[5] + a[6] * b[9], a[4] * b[2] + a[5] * b[6] + a[6] * b[10], 0, a[8] * b[0] + a[9] * b[4] + a[10] * b[8], a[8] * b[1] + a[9] * b[5] + a[10] * b[9], a[8] * b[2] + a[9] * b[6] + a[10] * b[10], 0, a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + b[12], a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + b[13], a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + b[14], 1];
  };

  identity = function() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  };

  Graphics.Matrix3d = (function() {

    function Matrix3d(arg) {
      if (Array.isArray(arg)) {
        this.r = arg;
      }
      if (typeof arg === 'string') {
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
      return new Graphics.Matrix3d(clone16(this.r));
    };

    Matrix3d.prototype.toString = function() {
      var a;
      a = this.r;
      return 'matrix3d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
    };

    Matrix3d.prototype.fromString = function(s) {
      var temp;
      if (s.substr(8, 1) === '(') {
        s = s.substr(9, s.length - 10);
        this.r = s.split(', ').map(parseFloat);
      } else if (s.substr(6, 1) === '(') {
        s = s.substr(7, s.length - 8);
        temp = s.split(', ').map(parseFloat);
        console.log('s.split', s.split(', '));
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

    Matrix3d.prototype.setTranslate = function(x, y, z) {
      if (z == null) {
        z = 0;
      }
      this.r[12] = parseFloat(x);
      this.r[13] = parseFloat(y);
      this.r[14] = parseFloat(z);
      return this;
    };

    Matrix3d.prototype.setTranslateX = function(x) {
      this.r[12] = parseFloat(x);
      return this;
    };

    Matrix3d.prototype.setTranslateY = function(y) {
      this.r[13] = parseFloat(y);
      return this;
    };

    Matrix3d.prototype.setTranslateZ = function(z) {
      this.r[14] = parseFloat(z);
      return this;
    };

    Matrix3d.prototype.translate = function(x, y, z) {
      if (z == null) {
        z = 0;
      }
      this.r[12] += parseFloat(x);
      this.r[13] += parseFloat(y);
      this.r[14] += parseFloat(z);
      return this;
    };

    Matrix3d.prototype.translateX = function(x) {
      this.r[12] += parseFloat(x);
      return this;
    };

    Matrix3d.prototype.translateY = function(y) {
      this.r[13] += parseFloat(y);
      return this;
    };

    Matrix3d.prototype.translateZ = function(z) {
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


    Matrix3d.prototype._setScale = function(x, y, z) {
      this.r[0] = parseFloat(x);
      this.r[5] = parseFloat(y);
      this.r[10] = parseFloat(x);
      return this;
    };

    Matrix3d.prototype._setScaleX = function(x) {
      this.r[0] = parseFloat(x);
      return this;
    };

    Matrix3d.prototype._setScaleY = function(y) {
      this.r[5] = parseFloat(y);
      return this;
    };

    Matrix3d.prototype._setScaleZ = function(z) {
      this.r[10] = parseFloat(z);
      return this;
    };

    Matrix3d.prototype._scale = function(x, y, z) {
      this.r[0] *= parseFloat(x);
      this.r[5] *= parseFloat(y);
      this.r[10] *= parseFloat(x);
      return this;
    };

    Matrix3d.prototype._scaleX = function(x) {
      this.r[0] *= parseFloat(x);
      return this;
    };

    Matrix3d.prototype._scaleY = function(y) {
      this.r[5] *= parseFloat(y);
      return this;
    };

    Matrix3d.prototype._scaleZ = function(z) {
      this.r[10] *= parseFloat(z);
      return this;
    };

    Matrix3d.prototype._setRotationFamous = function(x, y, z) {
      var a, b, d, e, h, s;
      h = Math.cos(x);
      a = Math.sin(x);
      s = Math.cos(y);
      b = Math.sin(y);
      e = Math.cos(z);
      d = Math.sin(z);
      this.r[0] = s * e;
      this.r[1] = h * d + a * b * e;
      this.r[2] = a * d - h * b * e;
      this.r[4] = -s * d;
      this.r[5] = h * e - a * b * d;
      this.r[6] = a * e + h * b * d;
      this.r[8] = b;
      this.r[9] = -a * s;
      this.r[10] = h * s;
      return this;
    };

    Matrix3d.prototype._setRotationW3 = function(x, y, z, alpha) {
      var sc, sin, sq, x2, xsc, xysq, xzsq, y2, ysc, yzsq, z2, zsc;
      alpha = alpha / 2;
      sin = Math.sin(alpha);
      sc = sin * Math.cos(alpha);
      sq = sin * sin;
      x2 = x * x;
      y2 = y * y;
      z2 = z * z;
      xysq = x * y * sq;
      xzsq = x * z * sq;
      yzsq = y * z * sq;
      xsc = x * sc;
      ysc = y * sc;
      zsc = z * sc;
      this.r[0] = 1 - 2 * (y2 + z2) * sq;
      this.r[1] = 2 * (xysq + zsc);
      this.r[2] = 2 * (xzsq - ysc);
      this.r[4] = 2 * (xysq - zsc);
      this.r[5] = 1 - 2 * (x2 + z2) * sq;
      this.r[6] = 2 * (yzsq + xsc);
      this.r[8] = 2 * (xzsq + ysc);
      this.r[9] = 2 * (yzsq - xsc);
      this.r[10] = 1 - 2 * (x2 + y2) * sq;
      return this;
    };

    return Matrix3d;

  })();

  (function() {
    var g, rad, suite;
    suite = new Benchmark.Suite;
    g = new Graphics.Matrix3d;
    rad = Math.PI / 4;
    suite.on('cycle', function(e) {
      return console.log(String(e.target));
    });
    suite.add('w3', function() {
      return g._setRotationFamous(1, 0, 0, rad);
    });
    suite.add('famous', function() {
      return g._setRotationFamous(rad, 0, 0);
    });
    suite.on('complete', function() {
      return console.log('Fastest:', this);
    });
    return window.run = function() {
      suite.run({
        async: true
      });
      return null;
    };
  })();

}).call(this);
