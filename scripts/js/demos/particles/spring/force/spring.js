define(function() {
  var SpringForce;

  return SpringForce = (function() {
    function SpringForce(pos, intensity) {
      this.pos = pos;
      this.intensity = intensity != null ? intensity : 1000;
    }

    SpringForce.prototype.applyTo = function(particle, currentForceVector) {
      currentForceVector.x -= (particle.pos.x - this.pos.x) * this.intensity;
      currentForceVector.y -= (particle.pos.y - this.pos.y) * this.intensity;
      return currentForceVector;
    };

    return SpringForce;

  })();
});

/*
//@ sourceMappingURL=spring.map
*/
