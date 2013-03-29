var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['./lightmatrix/base', './lightmatrix/translation', './lightmatrix/scale', './lightmatrix/perspective', './lightmatrix/rotation'], function(Base, Translation, Scale, Perspective, Rotation) {
  var LightMatrix, cloneStack, emptyStack;

  emptyStack = function() {
    return {
      mX: 0,
      mY: 0,
      mZ: 0,
      sX: 1,
      sY: 1,
      sZ: 1,
      p: 0,
      rX: 0,
      rY: 0,
      rZ: 0,
      tX: 0,
      tY: 0,
      tZ: 0
    };
  };
  cloneStack = function(stack) {
    return {
      mX: stack.mX,
      mY: stack.mY,
      mZ: stack.mZ,
      sX: stack.sX,
      sY: stack.sY,
      sZ: stack.sZ,
      p: stack.p,
      rX: stack.rX,
      rY: stack.rY,
      rZ: stack.rZ,
      tX: stack.tX,
      tY: stack.tY,
      tZ: stack.tZ
    };
  };
  return LightMatrix = (function() {
    function LightMatrix() {
      this._main = emptyStack();
      this._temp = emptyStack();
      this._current = this._main;
      this._has = {
        movement: false,
        perspective: false,
        rotation: false,
        scale: false,
        translation: false
      };
      this._tempMode = false;
    }

    LightMatrix.prototype.temporarily = function() {
      this._temp = cloneStack(this._main);
      this._current = this._temp;
      this._tempMode = true;
      return this;
    };

    LightMatrix.prototype.commit = function() {
      this._main = cloneStack(this._temp);
      this._current = this._main;
      this._tempMode = false;
      return this;
    };

    LightMatrix.prototype.rollBack = function() {
      this._current = this._main;
      this._tempMode = false;
      return this;
    };

    LightMatrix.prototype.toCss = function() {
      return Base.toCss(this.toMatrix());
    };

    LightMatrix.prototype.toMatrix = function() {
      var soFar;

      soFar = Base.identity();
      if (this._has.m) {
        soFar = Translation.matrix(this._current.mX, this._current.mY, this._current.mZ);
      }
      if (this._has.s) {
        soFar = Scale.applyTo(soFar, this._current.sX, this._current.sY, this._current.sZ);
      }
      if (this._has.p) {
        soFar = Perspective.applyTo(soFar, this._current.p);
      }
      if (this._has.r) {
        soFar = Rotation.applyTo(soFar, this._current.rX, this._current.rY, this._current.rZ);
      }
      if (this._has.t) {
        soFar = Translation.applyTo(soFar, this._current.tX, this._current.tY, this._current.tZ);
      }
      return soFar;
    };

    LightMatrix.prototype.rotation = function() {
      return {
        x: this._current.rX,
        y: this._current.rY,
        z: this._current.rZ
      };
    };

    LightMatrix.prototype.setRotationX = function(x) {
      if (x) {
        this._has.r = true;
      }
      this._current.rX = x;
      return this;
    };

    LightMatrix.prototype.setRotationY = function(y) {
      if (y) {
        this._has.r = true;
      }
      this._current.rY = y;
      return this;
    };

    LightMatrix.prototype.setRotationZ = function(z) {
      if (z) {
        this._has.r = true;
      }
      this._current.rZ = z;
      return this;
    };

    LightMatrix.prototype.rotate = function(x, y, z) {
      if (x || y || z) {
        this._has.r = true;
      }
      this._current.rX += x;
      this._current.rY += y;
      this._current.rZ += z;
      return this;
    };

    LightMatrix.prototype.rotateX = function(x) {
      if (x) {
        this._has.r = true;
      }
      this._current.rX += x;
      return this;
    };

    LightMatrix.prototype.rotateY = function(y) {
      if (y) {
        this._has.r = true;
      }
      this._current.rY += y;
      return this;
    };

    LightMatrix.prototype.rotateZ = function(z) {
      if (z) {
        this._has.r = true;
      }
      this._current.rZ += z;
      return this;
    };

    LightMatrix.prototype.translate = function(x, y, z) {
      this._current.tX += x;
      this._current.tY += y;
      this._current.tZ += z;
      this._has.t = true;
      return this;
    };

    LightMatrix.prototype.move = function(x, y, z) {
      this._current.mX += x;
      this._current.mY += y;
      this._current.mZ += z;
      this._has.m = true;
      return this;
    };

    LightMatrix.prototype.scale = function(x, y, z) {
      this._current.sX *= x;
      this._current.sY *= y;
      this._current.sZ *= z;
      this._has.s = true;
      return this;
    };

    LightMatrix.prototype.setPerspective = function(d) {
      this._current.p = d;
      if (d) {
        this._has.p = true;
      }
      return this;
    };

    return LightMatrix;

  })();
});

/*
//@ sourceMappingURL=lightmatrix.map
*/
