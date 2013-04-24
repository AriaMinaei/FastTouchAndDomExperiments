define(['./vector', './particle'], function(Vector, Particle) {
  var SpringField;

  return SpringField = (function() {
    function SpringField(root) {
      this.root = root != null ? root : document.querySelector('body');
      this._fieldSize = new Vector(40, 40);
      this._particleMargin = {
        x: (window.innerWidth - window.innerWidth / this._fieldSize.x) / this._fieldSize.x,
        y: (window.innerHeight - window.innerHeight / this._fieldSize.y) / this._fieldSize.y
      };
      this._particles = [];
      this._boundFrame = this._frame.bind(this);
      this._prepareParticles();
      this._senseMouse();
      this._frame();
    }

    SpringField.prototype._prepareParticles = function() {
      var i, j, particle, _i, _ref, _results;

      _results = [];
      for (i = _i = 0, _ref = this._fieldSize.x; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push((function() {
          var _j, _ref1, _results1;

          _results1 = [];
          for (j = _j = 0, _ref1 = this._fieldSize.y; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
            particle = new Particle(new Vector((j + 1) * this._particleMargin.x, (i + 1) * this._particleMargin.y));
            this.root.appendChild(particle.el);
            _results1.push(this._particles.push(particle));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    SpringField.prototype._frame = function() {
      var particle, _i, _len, _ref;

      _ref = this._particles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        particle = _ref[_i];
        particle.continueMove();
      }
      return webkitRequestAnimationFrame(this._boundFrame);
    };

    SpringField.prototype._senseMouse = function() {
      var _this = this;

      return document.addEventListener('mousemove', function(e) {
        var dx, dy, particle, x, y, _i, _len, _ref, _results;

        x = e.clientX;
        y = e.clientY;
        _ref = _this._particles;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          particle = _ref[_i];
          dx = x - particle.pos.x;
          dy = y - particle.pos.y;
          if (Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) < 50) {
            _results.push(particle.applyForces(new Vector(-10 * dx, -10 * dy)));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    };

    return SpringField;

  })();
});

/*
//@ sourceMappingURL=field.map
*/
