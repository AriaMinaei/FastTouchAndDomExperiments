var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['./matrix3d/base', './matrix3d/rotation', './matrix3d/perspective'], function(Base, Rotation, Perspective) {
  var Matrix3d;
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
      if (this._hasPerspective) {
        result = this._perspective.getMatrix();
      } else {
        result = Base.identity();
      }
      if (this._hasRotation) {
        result = Base.multiply(result, this._rotation.getMatrix());
      }
      return this.r = result;
    };

    Matrix3d.prototype.fromString = function(s) {
      return this.r = Base.fromString(s);
    };

    Matrix3d.prototype.fromWebkit = function(w) {
      return this.r = Base.fromWebkit(w);
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
  return Matrix3d;
});
