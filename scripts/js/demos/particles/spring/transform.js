define(function() {
  var Transform;

  return Transform = (function() {
    function Transform(el) {
      this.el = el;
      this.currentTransform = {
        tX: 0,
        tY: 0,
        tZ: 0
      };
    }

    Transform.prototype.toState = function(x, y) {
      this.currentTransform.tX = parseFloat(x);
      this.currentTransform.tY = parseFloat(y);
      this.currentTransform.tZ = 0;
      return this._applyToElement();
    };

    Transform.prototype._applyToElement = function() {
      return this.el.style.webkitTransform = "translate3d(" + (this.currentTransform.tX.toFixed(5)) + "px, " + (this.currentTransform.tY.toFixed(5)) + "px, " + (this.currentTransform.tZ.toFixed(5)) + "px)";
    };

    return Transform;

  })();
});

/*
//@ sourceMappingURL=transform.map
*/
