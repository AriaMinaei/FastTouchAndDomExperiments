
define(['native'], function() {
  var SingleAxisScroller;
  return SingleAxisScroller = (function() {
    /*
    		 * @param  {Object} @props 	Reference to an object where
    		 * this scroller can keep and update the current
    		 * delta and stretch.
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
      this.minDelta = 0;
      if (this.size > this.space) {
        this.minDelta = -(this.size - this.space);
      }
      this.maxDelta = 0;
      this.realMinDelta = this.minDelta - 1000;
      this.realMaxDelta = this.maxDelta + 1000;
      if (options.delta) {
        this.props.delta = parseInt(options.delta);
      }
      if (!this.props.delta) {
        this.props.delta = 0;
      }
      this.realDelta = this.props.delta;
      if (options.stretch) {
        this.props.stretch = parseInt(options.stretch);
      }
      if (!this.props.stretch) {
        this.props.stretch = 0;
      }
      this.velocityThreshold = 1;
      this._velocityRecords = [];
      this._lastVelocity = {
        v: 0,
        t: 0
      };
      null;
    }

    SingleAxisScroller.prototype.scroll = function(delta) {
      var newProps;
      this._recordForVelocity(delta);
      this.realDelta = this._limitReal(this.realDelta + delta);
      newProps = this._realToSticky(this.realDelta);
      this.props.delta = newProps.delta;
      return this.props.stretch = newProps.stretch;
    };

    SingleAxisScroller.prototype.release = function() {
      var v;
      v = this._getRecordedVelocity();
      if (v) {
        this._lastVelocity.v = v;
        this._lastVelocity.t = Date.now();
        return this.askForAnimation();
      }
    };

    SingleAxisScroller.prototype.animate = function() {
      var deltaT, friction, limitedRealDelta, needMoreAnimation, newProps, newV, v;
      v = this._lastVelocity.v;
      deltaT = Date.now() - this._lastVelocity.t;
      friction = 0.002;
      if (v > 0) {
        friction = -friction;
      }
      if (v === 0) {
        return;
      }
      this.realDelta += v * deltaT + (0.5 * friction * Math.pow(deltaT, 2));
      newV = deltaT * friction + v;
      if (newV * v < 0 || Math.abs(newV) < 0.1) {
        return;
      }
      this._setLastVelocity(newV);
      limitedRealDelta = this._limitReal(this.realDelta);
      needMoreAnimation = true;
      if (this.realDelta !== limitedRealDelta) {
        needMoreAnimation = false;
      }
      newProps = this._realToSticky(this.realDelta);
      this.props.delta = newProps.delta;
      this.props.stretch = newProps.stretch;
      if (needMoreAnimation) {
        return this.askForAnimation();
      }
    };

    SingleAxisScroller.prototype._limitReal = function(real) {
      if (real > this.realMaxDelta) {
        return this.realMaxDelta;
      } else if (real < this.realMinDelta) {
        return this.realMinDelta;
      } else {
        return real;
      }
    };

    SingleAxisScroller.prototype._realToSticky = function(real) {
      var sticky;
      sticky = {
        delta: 0,
        stretch: 0
      };
      if (real > 0) {
        sticky.stretch = this._stretch(real);
      } else if (real < this.minDelta) {
        sticky.stretch = this._stretch(real - this.minDelta);
        sticky.delta = this.minDelta;
      } else {
        sticky.delta = real;
      }
      return sticky;
    };

    SingleAxisScroller.prototype._stretch = function(real) {
      return real / 2;
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
      if (length < 2) {
        v = 0;
      } else {
        first = this._velocityRecords[0];
        last = this._velocityRecords[length - 1];
        v = (last.d - first.d) / (last.t - first.t);
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
      this._lastVelocity.v = v;
      return this._lastVelocity.t = Date.now();
    };

    return SingleAxisScroller;

  })();
});
