var define,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['../../visuals/lightmatrix'], function(LightMatrix) {
  var Transform;

  return Transform = (function(_super) {
    __extends(Transform, _super);

    function Transform(dommy, id, el) {
      this.dommy = dommy;
      this.id = id;
      Transform.__super__.constructor.apply(this, arguments);
    }

    Transform.prototype.applyTo = function(el) {
      el.style.webkitTransform = this.toCss();
      return this;
    };

    return Transform;

  })(LightMatrix);
});

/*
//@ sourceMappingURL=transform.map
*/
