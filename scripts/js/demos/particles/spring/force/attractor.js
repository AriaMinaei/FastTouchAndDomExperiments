define(['utility/math'], function(math) {
  var Attractor;

  return Attractor = (function() {
    function Attractor(pos, radius, intensity) {
      this.pos = pos;
      this.radius = radius != null ? radius : 300;
      this.intensity = intensity != null ? intensity : -1000;
    }

    Attractor.prototype.applyTo = function(particle, currentForceVector) {
      var d, distance, dx, dy;

      dx = math.unit(this.pos.x - particle.pos.x);
      dy = math.unit(this.pos.y - particle.pos.y);
      distance = math.distance(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
      if (distance < this.radius) {
        d = this._curve(1 - distance / this.radius);
        currentForceVector.x += this.intensity * dx * d;
        currentForceVector.y += this.intensity * dy * d;
      }
      return currentForceVector;
    };

    Attractor.prototype._curve = function(d) {
      return d * d;
    };

    return Attractor;

  })();
});

/*
//@ sourceMappingURL=attractor.map
*/
