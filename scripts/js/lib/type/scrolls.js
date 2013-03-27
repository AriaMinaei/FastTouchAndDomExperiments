var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['behavior/scroll/singleAxis', 'native', 'dom'], function(SingleAxisScroller) {
  var Scrolls, emptyFunction;
  emptyFunction = function() {};
  return Scrolls = (function() {

    function Scrolls(id, dommy) {
      var boundNeedAnimation, childRects, parentRects,
        _this = this;
      this.id = id;
      this.dommy = dommy;
      this.parentEl = this.dommy.el(this.id);
      this.options = {
        axis: 'both'
      };
      this.options = Object.append(this.options, JSON.parse('{' + this.parentEl.getAttribute('data-scroll-options') + '}'));
      this._enabledAxis = {
        x: 1,
        y: 1
      };
      if (this.options.axis === 'x') {
        this._enabledAxis.y = 0;
      } else if (this.options.axis === 'y') {
        this._enabledAxis.x = 0;
      }
      parentRects = this.parentEl.getBoundingClientRect();
      this._childEl = this.parentEl.children[0];
      this._childElId = this.dommy.fastId(this._childEl);
      this._transform = this.dommy.styles.getTransform(this._childElId, this._childEl);
      childRects = this._childEl.getBoundingClientRect();
      boundNeedAnimation = this._scrollerAskedForAnimation.bind(this);
      this.propsX = {
        delta: 0
      };
      this._scrollerX = new SingleAxisScroller(this.propsX, boundNeedAnimation, (function() {
        var ops;
        ops = {
          size: childRects.width,
          space: parentRects.width
        };
        if (_this.options.x != null) {
          Object.append(ops, _this.options.x);
        }
        return ops;
      })());
      this._lastScrollX = 0;
      this.propsY = {
        delta: 0
      };
      this._scrollerY = new SingleAxisScroller(this.propsY, boundNeedAnimation, (function() {
        var ops;
        ops = {
          size: childRects.height,
          space: parentRects.height
        };
        if (_this.options.y != null) {
          Object.append(ops, _this.options.y);
        }
        return ops;
      })());
      this._lastScrollY = 0;
      this._animFrame = 0;
      this._boundAnimFunction = this._animFunction.bind(this);
      this._finishCallback = emptyFunction;
      this._finishCallbackWaiting = false;
      this._cacheInGPU();
    }

    Scrolls.prototype.drag = function(x, y) {
      this._cancelAnimation();
      if (this._enabledAxis.x) {
        this._scrollerX.drag(x - this._lastScrollX);
        this._lastScrollX = x;
      }
      if (this._enabledAxis.y) {
        this._scrollerY.drag(y - this._lastScrollY);
        this._lastScrollY = y;
      }
      return this._transformElement();
    };

    Scrolls.prototype.release = function(finish) {
      if (this._enabledAxis.x) {
        this._scrollerX.release();
        this._lastScrollX = 0;
      }
      if (this._enabledAxis.y) {
        this._scrollerY.release();
        this._lastScrollY = 0;
      }
      if (finish) {
        if (this._animFrame) {
          this._finishCallback = function() {
            return finish();
          };
          return this._finishCallbackWaiting = true;
        } else {
          return finish();
        }
      }
    };

    Scrolls.prototype._scrollerAskedForAnimation = function() {
      if (!this._animFrame) {
        return this._animFrame = requestAnimationFrame(this._boundAnimFunction);
      }
    };

    Scrolls.prototype._cancelAnimation = function() {
      if (this._animFrame) {
        cancelAnimationFrame(this._animFrame);
        return this._animFrame = 0;
      }
    };

    Scrolls.prototype._animFunction = function() {
      this._animFrame = 0;
      if (this._enabledAxis.x) {
        this._scrollerX.animate();
      }
      if (this._enabledAxis.y) {
        this._scrollerY.animate();
      }
      this._transformElement();
      if (this._finishCallbackWaiting) {
        if (!this._animFrame) {
          this._finishCallback();
          return this.finish();
        }
      }
    };

    Scrolls.prototype.finish = function() {
      this._finishCallback = emptyFunction;
      return this._finishCallbackWaiting = false;
    };

    Scrolls.prototype._transformElement = function() {
      var x, y;
      x = 0;
      if (this._enabledAxis.x) {
        x = this.propsX.delta;
      }
      y = 0;
      if (this._enabledAxis.y) {
        y = this.propsY.delta;
      }
      return this._setTranslate(x, y);
    };

    Scrolls.prototype._setTranslate = function(x, y) {
      this._transform.currently().setTranslate(x, y);
      return this._transform.commit(this._childEl);
    };

    Scrolls.prototype._cacheInGPU = function() {};

    return Scrolls;

  })();
});
