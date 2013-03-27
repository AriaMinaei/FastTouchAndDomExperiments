var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['./matrix3d/base', './matrix3d/skew', './matrix3d/scale', './matrix3d/perspective', './matrix3d/rotation', './matrix3d/translation'], function(Base, Skew, Scale, Perspective, Rotation, Translation) {
  var Matrix3d;
  Matrix3d = (function() {

    function Matrix3d(arg) {
      this._skew = new Skew(0.0, 0.0);
      this._hasSkew = false;
      this._scale = new Scale(1.0, 1.0, 1.0);
      this._hasScale = false;
      this._perspective = new Perspective(100000.0);
      this._hasPerspective = false;
      this._rotation = new Rotation(0.0, 0.0, 0.0);
      this._hasRotation = false;
      this._translation = new Translation(0.0, 0.0, 0.0);
      this._hasTranslation = false;
      if (Array.isArray(arg)) {
        this.r = arg;
      } else if (typeof arg === 'string') {
        this.fromString(arg);
      } else {
        this.r = Base.identity();
      }
    }

    Matrix3d.prototype.fromMatrix = function(m) {
      this.r = Base.clone16(m.r);
      return this;
    };

    Matrix3d.prototype.generateMatrix = function() {
      var result;
      result = null;
      if (this._hasTranslation) {
        if (result) {
          result = Base.multiply(result, this._translation.getMatrix());
        } else {
          result = this._translation.getMatrix();
        }
      }
      if (this._hasSkew) {
        if (result) {
          result = Base.multiply(result, this._skew.getMatrix());
        } else {
          result = this._skew.getMatrix();
        }
      }
      if (this._hasScale) {
        if (result) {
          result = Base.multiply(result, this._scale.getMatrix());
        } else {
          result = this._scale.getMatrix();
        }
      }
      if (this._hasPerspective) {
        if (result) {
          result = Base.multiply(result, this._perspective.getMatrix());
        } else {
          result = this._perspective.getMatrix();
        }
      }
      if (this._hasRotation) {
        if (result) {
          result = Base.multiply(result, this._rotation.getMatrix());
        } else {
          result = this._rotation.getMatrix();
        }
      }
      if (!result) {
        result = Base.identity();
      }
      return this.r = result;
    };

    Matrix3d.prototype.fromString = function(s) {
      return this.r = Base.cssToArray(s);
    };

    Matrix3d.prototype.fromWebkit = function(w) {
      return this.r = Base.webkit2Array(w);
    };

    Matrix3d.prototype.setSkew = function(x, y) {
      this._skew.set(x, y);
      return this._hasSkew = true;
    };

    Matrix3d.prototype.setScale = function(x, y, z) {
      this._scale.set(x, y, z);
      return this._hasScale = true;
    };

    Matrix3d.prototype.setPerspective = function(d) {
      this._perspective.set(d);
      return this._hasPerspective = true;
    };

    Matrix3d.prototype.setRotation = function(x, y, z) {
      this._rotation.set(x, y, z);
      return this._hasRotation = true;
    };

    Matrix3d.prototype.setTranslation = function(x, y, z) {
      this._translation.set(x, y, z);
      return this._hasTranslation = true;
    };

    return Matrix3d;

  })();
  return Matrix3d;
});
