
define(['graphics/transitions', 'native'], function(Transitions) {
  var SingleAxisScroller, cache;
  cache = {
    stretch: {
      0: 0
    },
    unstretch: {
      0: 0
    }
  };
  return SingleAxisScroller = (function() {
    /*
    		 * @param  {Object} @props 	Reference to an object where
    		 * this scroller can keep and update the current
    		 * delta.
    		 *                                 
    		 * @param  {Function} @askForAnimation This function gets called when
    		 * this scroller needs to request an animation.
    		 * 
    		 * @param  {Object} options = {} Options - Look at the source
    */

    function SingleAxisScroller(props, askForAnimation, options) {
      this.props = props;
      this.askForAnimation = askForAnimation;
      if (options == null) {
        options = {};
      }
      this.space = parseInt(options.space);
      this.size = parseInt(options.size);
      this.min = 0;
      if (this.size > this.space) {
        this.min = -(this.size - this.space);
      }
      this.max = 0;
      if (options.delta) {
        this.props.delta = parseInt(options.delta);
      }
      if (!this.props.delta) {
        this.props.delta = 0;
      }
      this._puller = this.props.delta;
      this._pullerInSync = true;
      this._velocityRecords = [];
      this._lastV = 0;
      this._lastT = 0;
      this._stretchEasingFunction = Transitions.quint.easeOut;
      this._maxStretch = 1200;
      if (cache.stretch[this._maxStretch] === void 0) {
        cache.stretch[this._maxStretch] = {};
      }
      this._stretchCache = cache.stretch[this._maxStretch];
      if (cache.unstretch[this._maxStretch] === void 0) {
        cache.unstretch[this._maxStretch] = {};
      }
      this._unstretchCache = cache.unstretch[this._maxStretch];
      this._stretchedMax = 0;
      return null;
    }

    SingleAxisScroller.prototype.drag = function(delta) {
      if (!this._pullerInSync) {
        this._syncPuller();
      }
      this._recordForVelocity(delta);
      this._puller = this._puller + delta;
      return this.props.delta = this._pullerToSticky(this._puller);
    };

    SingleAxisScroller.prototype._pullerToSticky = function(puller) {
      if (puller > this.max) {
        return this.max + this._stretch(puller - this.max);
      } else if (puller < this.min) {
        return this.min - this._stretch(-(puller - this.min));
      } else {
        return puller;
      }
    };

    SingleAxisScroller.prototype._stickyToPuller = function(sticky) {
      if (sticky > this.max) {
        return this.max + this._unstretch(sticky - this.max);
      } else if (sticky < this.min) {
        return this.min - this._unstretch(-(sticky - this.min));
      } else {
        return sticky;
      }
    };

    SingleAxisScroller.prototype._stretch = function(puller) {
      var cached;
      puller = Math.min(puller, this._maxStretch);
      cached = this._stretchCache[puller];
      if (cached === void 0) {
        this._cacheStretches();
        return this._stretchCache[puller] || 0;
      } else {
        return cached;
      }
    };

    SingleAxisScroller.prototype._unstretch = function(stretched) {
      var cached;
      stretched = Math.min(Math.round(stretched), this._stretchedMax);
      cached = this._unstretchCache[stretched];
      if (cached === void 0) {
        this._cacheStretches();
        return this._unstretchCache[stretched] || 0;
      } else {
        return cached;
      }
    };

    SingleAxisScroller.prototype._cacheStretches = function() {
      var current, stretched;
      stretched = 0;
      current = 0;
      while (true) {
        if (current > this._maxStretch) {
          break;
        }
        stretched += 1.0 - this._stretchEasingFunction(current / this._maxStretch);
        this._stretchCache[current] = stretched;
        this._unstretchCache[Math.round(stretched)] = current;
        current++;
      }
      return this._stretchedMax = stretched;
    };

    SingleAxisScroller.prototype._syncPuller = function() {
      this._puller = this._stickyToPuller(this.props.delta);
      return this._pullerInSync = true;
    };

    SingleAxisScroller.prototype.release = function() {
      this._setLastVelocity(this._getRecordedVelocity());
      this._pullerInSync = false;
      return this.animate();
    };

    SingleAxisScroller.prototype.animate = function() {
      var deltaT, i, smallerDeltaT, v, v0, x, x0, _i, _ref, _ref1;
      x0 = this.props.delta;
      v0 = this._lastV;
      deltaT = Date.now() - this._lastT;
      _ref = this._animStep(x0, v0, deltaT), x = _ref.x, v = _ref.v;
      if (x - x0 > 10) {
        smallerDeltaT = deltaT / 4;
        x = x0;
        v = v0;
        for (i = _i = 1; _i <= 4; i = ++_i) {
          _ref1 = this._animStep(x, v, smallerDeltaT), x = _ref1.x, v = _ref1.v;
        }
      }
      this._setLastVelocity(v);
      this.props.delta = x;
      if (!((this.min < x && x < this.max) && v * v0 < 0.001)) {
        this.askForAnimation();
      }
      return null;
    };

    SingleAxisScroller.prototype._animStep = function(x0, v0, deltaT) {
      var deltas, ret;
      ret = {
        x: 0,
        v: 0
      };
      if (x0 < this.min) {
        ret.x = x0;
      } else if (x0 > this.max) {

      } else {
        deltas = this._deltasForInside(v0, deltaT);
        ret.x = x0 + deltas.deltaX;
        ret.v = v0 + deltas.deltaV;
      }
      return ret;
    };

    SingleAxisScroller.prototype._deltasForInside = function(v0, deltaT) {
      var deltaV, direction, friction, ret;
      direction = parseFloat(Math.unit(v0));
      friction = -direction * 0.031 * Math.min(Math.abs(v0), 0.1);
      deltaV = friction * deltaT;
      return ret = {
        deltaX: 0.5 * deltaV * deltaT + v0 * deltaT,
        deltaV: deltaV
      };
    };

    SingleAxisScroller.prototype._recordForVelocity = function(delta) {
      if (this._velocityRecords.length === 0) {
        this._velocityRecords.push({
          d: delta,
          t: Date.now()
        });
      } else {
        this._velocityRecords.push({
          d: delta + this._velocityRecords[this._velocityRecords.length - 1].d,
          t: Date.now()
        });
        if (this._velocityRecords.length > 3) {
          return this._velocityRecords.shift();
        }
      }
    };

    SingleAxisScroller.prototype._getRecordedVelocity = function() {
      var first, last, length, v;
      length = this._velocityRecords.length;
      v = 0;
      if (length > 1) {
        first = this._velocityRecords[0];
        last = this._velocityRecords[length - 1];
        if (Date.now() - last.t < 50) {
          v = (last.d - first.d) / (last.t - first.t) / 1.1;
        }
      }
      this._clearVelocityRecords();
      if (!((Math.abs(v)) > this.velocityThreshold)) {
        v = 0;
      }
      return v;
    };

    SingleAxisScroller.prototype._clearVelocityRecords = function() {
      return this._velocityRecords.length = 0;
    };

    SingleAxisScroller.prototype._setLastVelocity = function(v) {
      this._lastV = v;
      return this._lastT = Date.now();
    };

    return SingleAxisScroller;

  })();
});
