define(['utility/math'], function(math) {
  var Tornado;

  return Tornado = (function() {
    function Tornado(pos, radius, intensity, direction) {
      this.pos = pos;
      this.radius = radius != null ? radius : 300;
      this.intensity = intensity != null ? intensity : -1000;
      this.direction = direction != null ? direction : 1;
    }

    Tornado.prototype.applyTo = function(particle, currentForceVector) {
      var cot, distance, dx, dy, tan;

      dx = particle.pos.x - this.pos.x;
      dy = particle.pos.y - this.pos.y;
      tan = -(dy / dx);
      cot = 1 / tan;
      distance = math.distance(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
      if (distance < this.radius) {
        currentForceVector.x += this.intensity * tan;
        currentForceVector.y += this.intensity * cot;
      }
      return currentForceVector;
    };

    Tornado.prototype._curve = function(d) {
      return d * d;
    };

    return Tornado;

  })();
});

/*
//@ sourceMappingURL=tornado.map
*/
