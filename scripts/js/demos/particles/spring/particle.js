var __slice = [].slice;

define(['./vector', './transform'], function(Vector, Transform) {
  var Particle;

  return Particle = (function() {
    function Particle(initPos) {
      this.initPos = initPos;
      this.el = document.createElement('div');
      this.el.classList.add('particle');
      this.transform = new Transform(this.el);
      this.gotoPos(this.initPos);
      this.m = 50;
      this.pos = new Vector(this.initPos.x, this.initPos.y);
      this.v = new Vector(0, 0);
      this.force = new Vector(0, 0);
      this.springForce = new Vector(0, 0);
      this.damperForce = new Vector(0, 0);
      this.t0 = Date.now();
      this.lastPos = this.initPos;
    }

    Particle.prototype.gotoPos = function(pos) {
      return this.transform.toState(pos);
    };

    Particle.prototype._integrate = function(ax, ay) {
      var dt;

      dt = .5;
      this.pos.x = .5 * ax * Math.pow(dt, 2) + this.v.x * dt + this.pos.x;
      this.pos.y = .5 * ay * Math.pow(dt, 2) + this.v.y * dt + this.pos.y;
      this.v.x = ax * dt + this.v.x;
      this.v.y = ay * dt + this.v.y;
      return this.pos;
    };

    Particle.prototype.applyForces = function() {
      var force, forces, _i, _len, _results;

      forces = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = forces.length; _i < _len; _i++) {
        force = forces[_i];
        this.force.x += force.x;
        _results.push(this.force.y += force.y);
      }
      return _results;
    };

    Particle.prototype.continueMove = function() {
      var nextPos;

      this.springForce.x = this.pos.x - this.initPos.x;
      this.springForce.y = this.pos.y - this.initPos.y;
      this.damperForce.x = 2 * this.v.x;
      this.damperForce.y = 2 * this.v.y;
      nextPos = this.gotoPos(this._integrate((this.force.x - this.springForce.x - this.damperForce.x) / this.m, (this.force.y - this.springForce.y - this.damperForce.y) / this.m));
      this.force.x = 0;
      return this.force.y = 0;
    };

    return Particle;

  })();
});

/*
//@ sourceMappingURL=particle.map
*/
