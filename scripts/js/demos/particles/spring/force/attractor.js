define(['utility/math'], function(math) {
  var Attractor;

  return Attractor = (function() {
    function Attractor(pos, radius, intensity) {
      this.pos = pos;
      this.radius = radius != null ? radius : 300;
      this.intensity = intensity != null ? intensity : -1000;
    }

    Attractor.prototype.applyTo = function(particle, currentForceVector) {
      var d, distance, dx, dy, teta;

      dx = particle.pos.x - this.pos.x;
      dy = particle.pos.y - this.pos.y;
      teta = Math.atan(dy / dx);
      if (dx < 0) {
        teta -= Math.PI;
      }
      distance = math.distance(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
      if (distance < this.radius) {
        d = this._curve(1 - distance / this.radius);
        currentForceVector.x += (this.intensity * d * Math.cos(teta)) + (-this.intensity * math.unit(dx) * d / 10);
        currentForceVector.y += (this.intensity * d * Math.sin(teta)) + (-this.intensity * math.unit(dy) * d / 10);
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
