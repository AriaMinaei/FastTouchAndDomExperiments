
define(['native'], function() {
  var SingleAxisScroller;
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
      this.velocityThreshold = 0.1;
      this._velocityRecords = [];
      this._lastV = 0;
      this._lastT = 0;
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

    SingleAxisScroller.prototype._stretch = function(extra) {
      return extra / 5;
    };

    SingleAxisScroller.prototype._unstretch = function(stretched) {
      return stretched * 5;
    };

    SingleAxisScroller.prototype._syncPuller = function() {
      this._puller = this._stickyToPuller(this.props.delta);
      return this._pullerInSync = true;
    };

    SingleAxisScroller.prototype.release = function() {
      var v;
      v = this._getRecordedVelocity();
      if (v) {
        this._lastV = v;
        this._lastT = Date.now();
        this.askForAnimation();
        return this._pullerInSync = false;
      }
    };

    SingleAxisScroller.prototype.animate = function() {
      var currentDelta, deltaT, friction, newV, v;
      v = this._lastV;
      deltaT = Date.now() - this._lastT;
      friction = 0.001;
      if (v > 0) {
        friction = -friction;
      }
      if (v === 0) {
        return;
      }
      currentDelta = this.props.delta + v * deltaT + (0.5 * friction * Math.pow(deltaT, 2));
      if (currentDelta < this.min - 100) {
        currentDelta = this.min - 100;
      } else if (currentDelta > this.max + 100) {
        currentDelta = this.max + 100;
      }
      newV = deltaT * friction + v;
      if (newV * v < 0) {
        return;
      }
      this._setLastVelocity(newV);
      this.askForAnimation();
      return this.props.delta = currentDelta;
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
          v = (last.d - first.d) / (last.t - first.t);
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
