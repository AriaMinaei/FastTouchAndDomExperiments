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
        Scale.applyTo(soFar, this._current.sX, this._current.sY, this._current.sZ);
      }
      if (this._has.p) {
        Perspective.applyTo(soFar, this._current.p);
      }
      if (this._has.r) {
        Rotation.applyTo(soFar, this._current.rX, this._current.rY, this._current.rZ);
      }
      if (this._has.t) {
        Translation.applyTo(soFar, this._current.tX, this._current.tY, this._current.tZ);
      }
      return soFar;
    };

    /*
    		Movement
    */


    LightMatrix.prototype.resetMovement = function() {
      this._has.m = false;
      this._current.mX = 0;
      this._current.mY = 0;
      this._current.mZ = 0;
      return this;
    };

    LightMatrix.prototype.movement = function() {
      return {
        x: this._current.mX,
        y: this._current.mY,
        z: this._current.mZ
      };
    };

    LightMatrix.prototype.setMovement = function(x, y, z) {
      if (!x && !y && !z) {
        this._has.m = false;
      }
      this._current.mX = x;
      this._current.mY = y;
      this._current.mZ = z;
      return this;
    };

    LightMatrix.prototype.setMovementX = function(x) {
      if (x) {
        this._has.m = true;
      }
      this._current.mX = x;
      return this;
    };

    LightMatrix.prototype.setMovementY = function(y) {
      if (y) {
        this._has.m = true;
      }
      this._current.mY = y;
      return this;
    };

    LightMatrix.prototype.setMovementZ = function(z) {
      if (z) {
        this._has.m = true;
      }
      this._current.mZ = z;
      return this;
    };

    LightMatrix.prototype.move = function(x, y, z) {
      if (x || y || z) {
        this._has.m = true;
      }
      this._current.mX += x;
      this._current.mY += y;
      this._current.mZ += z;
      return this;
    };

    LightMatrix.prototype.moveX = function(x) {
      if (x) {
        this._has.m = true;
      }
      this._current.mX += x;
      return this;
    };

    LightMatrix.prototype.moveY = function(y) {
      if (y) {
        this._has.m = true;
      }
      this._current.mY += y;
      return this;
    };

    LightMatrix.prototype.moveZ = function(z) {
      if (z) {
        this._has.m = true;
      }
      this._current.mZ += z;
      return this;
    };

    /*
    		Scale
    */


    LightMatrix.prototype.resetScale = function() {
      this._has.s = false;
      this._current.sX = 1;
      this._current.sY = 1;
      this._current.sZ = 1;
      return this;
    };

    LightMatrix.prototype.getScale = function() {
      return {
        x: this._current.sX,
        y: this._current.sY,
        z: this._current.sZ
      };
    };

    LightMatrix.prototype.setScale = function(x, y, z) {
      if (x === 1 && y === 1 && z === 1) {
        this._has.s = false;
      }
      this._current.sX = x;
      this._current.sY = y;
      this._current.sZ = z;
      return this;
    };

    LightMatrix.prototype.setScaleX = function(x) {
      if (x !== 1) {
        this._has.s = true;
      }
      this._current.sX = x;
      return this;
    };

    LightMatrix.prototype.setScaleY = function(y) {
      if (y !== 1) {
        this._has.s = true;
      }
      this._current.sY = y;
      return this;
    };

    LightMatrix.prototype.setScaleZ = function(z) {
      if (z !== 1) {
        this._has.s = true;
      }
      this._current.sZ = z;
      return this;
    };

    LightMatrix.prototype.scale = function(x, y, z) {
      if (x !== 1 || y !== 1 || z !== 1) {
        this._has.s = true;
      }
      this._current.sX *= x;
      this._current.sY *= y;
      this._current.sZ *= z;
      return this;
    };

    LightMatrix.prototype.setScaleAll = function(x) {
      if (x === 1) {
        this._has.s = false;
      }
      this._current.sX = this._current.sY = this._current.sZ = x;
      return this;
    };

    LightMatrix.prototype.scaleX = function(x) {
      if (x) {
        this._has.s = true;
      }
      this._current.sX *= x;
      return this;
    };

    LightMatrix.prototype.scaleY = function(y) {
      if (y) {
        this._has.s = true;
      }
      this._current.sY *= y;
      return this;
    };

    LightMatrix.prototype.scaleZ = function(z) {
      if (z) {
        this._has.s = true;
      }
      this._current.sZ *= z;
      return this;
    };

    /*
    		Perspective
    */


    LightMatrix.prototype.setPerspective = function(d) {
      this._current.p = d;
      if (d) {
        this._has.p = true;
      }
      return this;
    };

    /*
    		Rotation
    */


    LightMatrix.prototype.resetRotation = function() {
      this._has.r = false;
      this._current.rX = 0;
      this._current.rY = 0;
      this._current.rZ = 0;
      return this;
    };

    LightMatrix.prototype.rotation = function() {
      return {
        x: this._current.rX,
        y: this._current.rY,
        z: this._current.rZ
      };
    };

    LightMatrix.prototype.setRotation = function(x, y, z) {
      if (!x && !y && !z) {
        this._has.r = false;
      }
      this._current.rX = x;
      this._current.rY = y;
      this._current.rZ = z;
      return this;
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

    /*
    		Translation
    */


    LightMatrix.prototype.resetTranslation = function() {
      this._has.t = false;
      this._current.tX = 0;
      this._current.tY = 0;
      this._current.tZ = 0;
      return this;
    };

    LightMatrix.prototype.translation = function() {
      return {
        x: this._current.tX,
        y: this._current.tY,
        z: this._current.tZ
      };
    };

    LightMatrix.prototype.setTranslation = function(x, y, z) {
      if (!x && !y && !z) {
        this._has.t = false;
      }
      this._current.tX = x;
      this._current.tY = y;
      this._current.tZ = z;
      return this;
    };

    LightMatrix.prototype.setTranslationX = function(x) {
      if (x) {
        this._has.t = true;
      }
      this._current.tX = x;
      return this;
    };

    LightMatrix.prototype.setTranslationY = function(y) {
      if (y) {
        this._has.t = true;
      }
      this._current.tY = y;
      return this;
    };

    LightMatrix.prototype.setTranslationZ = function(z) {
      if (z) {
        this._has.t = true;
      }
      this._current.tZ = z;
      return this;
    };

    LightMatrix.prototype.translate = function(x, y, z) {
      if (x || y || z) {
        this._has.t = true;
      }
      this._current.tX += x;
      this._current.tY += y;
      this._current.tZ += z;
      return this;
    };

    LightMatrix.prototype.translateX = function(x) {
      if (x) {
        this._has.t = true;
      }
      this._current.tX += x;
      return this;
    };

    LightMatrix.prototype.translateY = function(y) {
      if (y) {
        this._has.t = true;
      }
      this._current.tY += y;
      return this;
    };

    LightMatrix.prototype.translateZ = function(z) {
      if (z) {
        this._has.t = true;
      }
      this._current.tZ += z;
      return this;
    };

    return LightMatrix;

  })();
});

/*
//@ sourceMappingURL=lightmatrix.map
*/