define(['./vector', './particle', 'utility/belt', 'utility/shims'], function(Vector, Particle, belt) {
  var SpringField, _containerEl;

  _containerEl = document.createElement('div');
  _containerEl.classList.add('container');
  return SpringField = (function() {
    function SpringField(root) {
      var options;

      this.root = root != null ? root : document.querySelector('body', options = {});
      this.options = {
        particleMargin: 40
      };
      belt.deepAppend(this.options, options);
      this._fieldSize = new Vector(Math.floor(this.root.clientWidth / this.options.particleMargin), Math.floor(this.root.clientHeight / this.options.particleMargin));
      this._containerCapacity = 600;
      this._particles = [];
      this._boundFrame = this._frame.bind(this);
      this._mousePos = new Vector(this.root.clientWidth / 2, this.root.clientHeight / 2);
      this._mouseForce = new Vector(0, 0);
      this._prepareParticles();
      this._currentParticlesCursor = 0;
      this._particlesCount = this._particles.length;
      this._maxFrameDuration = 7;
      this._senseMouse();
      this._frame2();
    }

    SpringField.prototype._prepareParticles = function() {
      var container, i, j, particle, _i, _ref, _results;

      _results = [];
      for (i = _i = 0, _ref = this._fieldSize.x; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push((function() {
          var _j, _ref1, _results1;

          _results1 = [];
          for (j = _j = 0, _ref1 = this._fieldSize.y; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
            if (this._particles.length % this._containerCapacity === 0) {
              container = this._getContainer();
              this.root.appendChild(container);
            }
            particle = new Particle(new Vector((i + 1) * this.options.particleMargin, (j + 1) * this.options.particleMargin));
            container.appendChild(particle.el);
            _results1.push(this._particles.push(particle));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    SpringField.prototype._getContainer = function() {
      return _containerEl.cloneNode();
    };

    SpringField.prototype._frame = function() {
      var dx, dy, particle, renderedInThisFrame, started, _results;

      requestAnimationFrame(this._boundFrame);
      renderedInThisFrame = 0;
      started = Date.now();
      _results = [];
      while (true) {
        this._currentParticlesCursor++;
        if (this._currentParticlesCursor === this._particlesCount) {
          this._currentParticlesCursor = 0;
        }
        particle = this._particles[this._currentParticlesCursor];
        dx = this._mousePos.x - particle.pos.x;
        dy = this._mousePos.y - particle.pos.y;
        if (Math.pow(dx, 2) + Math.pow(dy, 2) < 16000) {
          this._mouseForce.x = -10 * dx;
          this._mouseForce.y = -10 * dy;
          particle.applyForce(this._mouseForce);
        }
        particle.continueMove();
        renderedInThisFrame++;
        if (renderedInThisFrame === this._particlesCount) {
          break;
        }
        if (renderedInThisFrame % 50 === 0) {
          if (Date.now() - started > this._maxFrameDuration) {
            break;
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    SpringField.prototype._frame2 = function() {
      var dx, dy, particle;

      requestAnimationFrame(this._boundFrame);
      this._currentParticlesCursor++;
      if (this._currentParticlesCursor === this._particlesCount) {
        this._currentParticlesCursor = 0;
      }
      particle = this._particles[this._currentParticlesCursor];
      dx = this._mousePos.x - particle.pos.x;
      dy = this._mousePos.y - particle.pos.y;
      if (Math.pow(dx, 2) + Math.pow(dy, 2) < 16000) {
        this._mouseForce.x = -10 * dx;
        this._mouseForce.y = -10 * dy;
        particle.applyForce(this._mouseForce);
      }
      return particle.continueMove();
    };

    SpringField.prototype._senseMouse = function() {
      var _this = this;

      return document.addEventListener('mousemove', function(e) {
        _this._mousePos.x = e.clientX;
        return _this._mousePos.y = e.clientY;
      });
    };

    return SpringField;

  })();
});

/*
//@ sourceMappingURL=field.map
*/
