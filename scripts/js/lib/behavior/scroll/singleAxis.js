
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
      if (options.d) {
        this.props.d = parseInt(d);
      }
      if (options.stretch) {
        this.props.stretch = parseInt(stretch);
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
      var newDelta;
      this._recordForVelocity(delta);
      newDelta = this.props.d + delta;
      if (newDelta > 0) {
        this.props.stretch += newDelta;
        newDelta = 0;
      } else if (newDelta < this.minDelta) {
        this.props.stretch += newDelta - this.minDelta;
        newDelta = this.minDelta;
      }
      return this.props.d = newDelta;
    };

    SingleAxisScroller.prototype.release = function() {
      var v;
      v = this._getRecordedVelocity();
      console.log(v);
      if (v) {
        this._lastVelocity.v = v;
        this._lastVelocity.t = Date.now();
        return this.askForAnimation();
      }
    };

    SingleAxisScroller.prototype.animate = function() {
      var deltaT, needMoreAnimation, newDelta, v;
      v = this._lastVelocity.v;
      deltaT = Date.now() - this._lastVelocity.t;
      this._setLastVelocity(v);
      newDelta = this.props.d + v * deltaT;
      needMoreAnimation = true;
      if (newDelta > 0) {
        this.props.stretch += newDelta;
        newDelta = 0;
        needMoreAnimation = false;
      } else if (newDelta < this.minDelta) {
        this.props.stretch += newDelta - this.minDelta;
        newDelta = this.minDelta;
        needMoreAnimation = false;
      }
      this.props.d = newDelta;
      if (needMoreAnimation) {
        return this.askForAnimation();
      }
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
