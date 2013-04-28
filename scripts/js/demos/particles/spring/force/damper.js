define(function() {
  var DamperForce;

  return DamperForce = (function() {
    function DamperForce(intensity) {
      this.intensity = intensity != null ? intensity : 20;
    }

    DamperForce.prototype.applyTo = function(particle, currentForceVector) {
      currentForceVector.x -= particle.v.x * this.intensity;
      currentForceVector.y -= particle.v.y * this.intensity;
      return currentForceVector;
    };

    return DamperForce;

  })();
});

/*
//@ sourceMappingURL=damper.map
*/
