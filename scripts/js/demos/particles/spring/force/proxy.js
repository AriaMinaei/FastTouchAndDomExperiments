define(function() {
  var ProxyForce;

  return ProxyForce = (function() {
    function ProxyForce(force) {
      this.force = force;
    }

    ProxyForce.prototype.applyTo = function(particle, currentForceVector) {
      return this.force.applyTo(particle, currentForceVector);
    };

    return ProxyForce;

  })();
});

/*
//@ sourceMappingURL=proxy.map
*/
