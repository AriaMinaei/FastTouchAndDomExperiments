define(['./vector', './particle', './force/spring', './force/damper', './force/proxy', './force/attractor', 'utility/belt', 'utility/shims'], function(Vector, Particle, SpringForce, DamperForce, ProxyForce, AttractorForce, belt) {
  var SpringField;

  return SpringField = (function() {
    function SpringField(root, options) {
      this.root = root != null ? root : document.querySelector('body');
      if (options == null) {
        options = {};
      }
      this.options = {
        particleMargin: 60,
        forces: {
          spring: {
            intensity: 1000
          },
          damper: {
            intensity: 20
          },
          mouse: {
            radius: 100,
            intensity: 150
          }
        }
      };
      belt.deepAppend(this.options, options);
      this._fieldSize = new Vector(Math.floor(this.root.clientWidth / this.options.particleMargin), Math.floor(this.root.clientHeight / this.options.particleMargin));
      this._prepareMouse();
      this._prepareParticles();
      this._prepareAnimation();
      this._frame();
    }

    SpringField.prototype._prepareMouse = function() {
      var _this = this;

      this._mousePos = new Vector(this.root.clientWidth * 2, this.root.clientHeight * 2);
      this._mouseForce = new ProxyForce(new AttractorForce(this._mousePos, this.options.forces.mouse.radius, this.options.forces.mouse.intensity));
      return this.root.addEventListener('mousemove', function(e) {
        _this._mousePos.x = e.clientX;
        return _this._mousePos.y = e.clientY;
      });
    };

    SpringField.prototype._prepareParticles = function() {
      var i, j, particle, pos, _i, _ref, _results;

      this._damperForce = new DamperForce(this.options.forces.damper.intensity);
      this._particles = [];
      _results = [];
      for (i = _i = 0, _ref = this._fieldSize.x; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push((function() {
          var _j, _ref1, _results1;

          _results1 = [];
          for (j = _j = 0, _ref1 = this._fieldSize.y; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
            pos = new Vector(i * this.options.particleMargin, j * this.options.particleMargin);
            particle = new Particle(pos);
            particle.addForce('spring', new SpringForce(pos, this.options.forces.spring.intensity));
            particle.addForce('damper', this._damperForce);
            particle.addForce('mouse', this._mouseForce);
            this.root.appendChild(particle.el);
            _results1.push(this._particles.push(particle));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    SpringField.prototype._prepareAnimation = function() {
      this._boundFrame = this._frame.bind(this);
      this._currentParticlesCursor = 0;
      this._particlesCount = this._particles.length;
      this._maxFrameDuration = 7;
      return this._lastFrameTime = 0;
    };

    SpringField.prototype._frame = function(t) {
      var dt, renderedInThisFrame, started, _results;

      requestAnimationFrame(this._boundFrame);
      renderedInThisFrame = 0;
      if (!t) {
        this._lastFrameTime = 0;
        dt = 0.016;
      } else {
        dt = (t - this._lastFrameTime) / 1000;
        this._lastFrameTime = t;
      }
      started = Date.now();
      _results = [];
      while (true) {
        this._currentParticlesCursor++;
        if (this._currentParticlesCursor === this._particlesCount) {
          this._currentParticlesCursor = 0;
        }
        this._particles[this._currentParticlesCursor].continueMove(dt);
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

    return SpringField;

  })();
});

/*
//@ sourceMappingURL=field.map
*/
