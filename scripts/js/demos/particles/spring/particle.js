var __slice = [].slice;

define(['./vector', 'visuals/lightmatrix'], function(Vector, LightMatrix) {
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
      this._externalForces = new Vector(0, 0);
      this._springForce = new Vector(0, 0);
      this._damperForce = new Vector(0, 0);
      this._t0 = Date.now();
      this._appliedPos = new Vector(0, 0);
      this._moveEl(this.initPos.x, this.initPos.y);
    }

    Particle.prototype._gotoPos = function(nextX, nextY) {
      var moved;

      moved = false;
      if (Math.abs(Math.abs(nextX) - Math.abs(this._appliedPos.x)) > 0.99 || Math.abs(Math.abs(nextY) - Math.abs(this._appliedPos.y)) > 0.99) {
        this._moveEl(nextX, nextY);
        moved = true;
      }
      this.pos.x = nextX;
      this.pos.y = nextY;
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

    Particle.prototype.applyForces = function() {
      var force, forces, _i, _len, _results;

      forces = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = forces.length; _i < _len; _i++) {
        force = forces[_i];
        this._externalForces.x += force.x;
        _results.push(this._externalForces.y += force.y);
      }
      return _results;
    };

    Particle.prototype.applyForce = function(force) {
      this._externalForces.x += force.x;
      return this._externalForces.y += force.y;
    };

    Particle.prototype.continueMove = function() {
      var aX, aY, dt, nextX, nextY;

      this._springForce.x = this.pos.x - this.initPos.x;
      this._springForce.y = this.pos.y - this.initPos.y;
      this._damperForce.x = 2 * this.v.x;
      this._damperForce.y = 2 * this.v.y;
      dt = 0.5;
      aX = (this._externalForces.x - this._springForce.x - this._damperForce.x) / this.m;
      nextX = this._integrateD(aX, dt, this.v.x, this.pos.x);
      this.v.x = this._integrateV(aX, dt, this.v.x);
      aY = (this._externalForces.y - this._springForce.y - this._damperForce.y) / this.m;
      nextY = this._integrateD(aY, dt, this.v.y, this.pos.y);
      this.v.y = this._integrateV(aY, dt, this.v.y);
      this._externalForces.x = 0;
      this._externalForces.y = 0;
      return this._gotoPos(nextX, nextY);
    };

    return Particle;

  })();
});

/*
//@ sourceMappingURL=particle.map
*/
