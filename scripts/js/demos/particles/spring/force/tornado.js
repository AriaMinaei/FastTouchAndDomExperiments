define(['utility/math', 'utility/func'], function(math, func) {
  var Tornado;

  return Tornado = (function() {
    function Tornado(pos, radius, intensity, direction) {
      this.pos = pos;
      this.radius = radius != null ? radius : 300;
      this.intensity = intensity != null ? intensity : -1000;
      this.direction = direction != null ? direction : 1;
    }

    Tornado.prototype.applyTo = function(particle, currentForceVector) {
      var d, distance, dx, dy, teta;

      dx = particle.pos.x - this.pos.x;
      dy = particle.pos.y - this.pos.y;
      teta = (Math.atan(dy / dx)) - math.halfPi;
      if (dx < 0) {
        teta -= Math.PI;
      }
      distance = math.distance(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
      if (distance < this.radius) {
        d = this._curve(1 - distance / this.radius);
        currentForceVector.x += this.intensity * d * Math.cos(teta);
        currentForceVector.y += this.intensity * d * Math.sin(teta);
      } else {

      }
      return currentForceVector;
    };

    Tornado.prototype._curve = function(d) {
      return d;
    };

    return Tornado;

  })();
});

/*
//@ sourceMappingURL=tornado.map
*/
