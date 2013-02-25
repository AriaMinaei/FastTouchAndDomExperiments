
define(['behavior/scroll/singleAxis', 'native', 'dom'], function(SingleAxisScroller) {
  var Scrolls;
  return Scrolls = (function() {

    function Scrolls(id, dommy) {
      var boundNeedAnimation, childRects, parentRects;
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
        d: 0,
        stretch: 0
      };
      this._scrollerX = new SingleAxisScroller(this.propsX, boundNeedAnimation, {
        size: childRects.width,
        space: parentRects.width
      });
      this._lastScrollX = 0;
      this.propsY = {
        d: 0,
        stretch: 0
      };
      this._scrollerY = new SingleAxisScroller(this.propsY, boundNeedAnimation, {
        size: childRects.height,
        space: parentRects.height
      });
      this._lastScrollY = 0;
      this._animFrame = 0;
      this._boundAnimFunction = this._animFunction.bind(this);
    }

    Scrolls.prototype.scroll = function(x, y) {
      this._cancelAnimation();
      if (this._enabledAxis.x) {
        this._scrollerX.scroll(x - this._lastScrollX);
        this._lastScrollX = x;
      }
      if (this._enabledAxis.y) {
        this._scrollerY.scroll(y - this._lastScrollY);
        this._lastScrollY = y;
      }
      return this._transformElement();
    };

    Scrolls.prototype.release = function() {
      if (this._enabledAxis.x) {
        this._scrollerX.release();
        this._lastScrollX = 0;
      }
      if (this._enabledAxis.y) {
        this._scrollerY.release();
        return this._lastScrollY = 0;
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
      return this._transformElement();
    };

    Scrolls.prototype._transformElement = function() {
      var x, y;
      x = 0;
      if (this._enabledAxis.x) {
        x = this.propsX.d;
      }
      y = 0;
      if (this._enabledAxis.y) {
        y = this.propsY.d;
      }
      return this._setTranslate(x, y);
    };

    Scrolls.prototype._setTranslate = function(x, y) {
      this._transform.currently().setTranslate(x, y);
      return this._transform.commit(this._childEl);
    };

    return Scrolls;

  })();
});
