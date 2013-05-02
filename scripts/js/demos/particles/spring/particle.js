define(['./vector', 'visuals/lightmatrix', 'utility/hash'], function(Vector, LightMatrix, Hash) {
  var Particle;

  return Particle = (function() {
    function Particle(initPos) {
      this.initPos = initPos;
      this.el = document.createElement('div');
      this.el.classList.add('particle');
      this._transformMatrix = new LightMatrix;
      this.m = 50;
      this.pos = new Vector(this.initPos.x, this.initPos.y);
      this.v = new Vector(0, 0);
      this._forces = new Hash;
      this._forceVector = new Vector(0, 0);
      this._t0 = Date.now();
      this._appliedPos = new Vector(0, 0);
      this._moveEl(this.initPos.x, this.initPos.y);
    }

    Particle.prototype._gotoPos = function(nextX, nextY) {
      var max, moved, v;

      moved = false;
      this.pos.x = nextX;
      this.pos.y = nextY;
      if (Math.abs(Math.abs(nextX) - Math.abs(this._appliedPos.x)) > 0.5 || Math.abs(Math.abs(nextY) - Math.abs(this._appliedPos.y)) > 0.5) {
        this._moveEl(nextX, nextY);
        moved = true;
      }
      v = Math.max(Math.abs(this.v.x), Math.abs(this.v.y));
      max = 50;
      if (v < max) {
        this.el.style.opacity = Math.max(v / max, 0.1);
      } else {
        this.el.style.opacity = 1;
      }
      return moved;
    };

    Particle.prototype._moveEl = function(nextX, nextY) {
      this._appliedPos.x = nextX;
      this._appliedPos.y = nextY;
      this._transformMatrix.setMovement(nextX, nextY, 0);
      return this.el.style.webkitTransform = this._transformMatrix.toCss();
    };

    Particle.prototype._integrateD = function(a, dt, v0, d0) {
      return a / 2 * Math.pow(dt, 2) + v0 * dt + d0;
    };

    Particle.prototype._integrateV = function(a, dt, v0) {
      return a * dt + v0;
    };

    Particle.prototype.addForce = function(name, force) {
      this._forces.set(name, force);
      return this;
    };

    Particle.prototype._getForceVector = function() {
      var force, _i, _len, _ref;

      this._forceVector.x = 0;
      this._forceVector.y = 0;
      _ref = this._forces.array;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        force = _ref[_i];
        force.applyTo(this, this._forceVector);
      }
      return this._forceVector;
    };

    Particle.prototype._getForceVector2 = function() {
      var name;

      this._forceVector.x = 0;
      this._forceVector.y = 0;
      for (name in this._forces._pairs) {
        this._forces._pairs[name].applyTo(this, this._forceVector);
      }
      return this._forceVector;
    };

    Particle.prototype.continueMove = function(dt) {
      var aX, aY, forceVector, nextX, nextY;

      forceVector = this._getForceVector2();
      aX = forceVector.x / this.m;
      nextX = this._integrateD(aX, dt, this.v.x, this.pos.x);
      this.v.x = this._integrateV(aX, dt, this.v.x);
      aY = forceVector.y / this.m;
      nextY = this._integrateD(aY, dt, this.v.y, this.pos.y);
      this.v.y = this._integrateV(aY, dt, this.v.y);
      return this._gotoPos(nextX, nextY);
    };

    return Particle;

  })();
});

/*
//@ sourceMappingURL=particle.map
*/
