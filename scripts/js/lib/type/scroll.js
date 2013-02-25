
define(['native', 'dom'], function() {
  var OneDirectionalScroller, Range, Ranges, Scroll;
  Ranges = (function() {

    function Ranges(toAdd) {
      this.ranges = [];
      this.currentRange = 0;
      this.lastNum = null;
      if (toAdd) {
        this.add(toAdd);
      }
    }

    Ranges.prototype.add = function(toAdd) {
      var range, _i, _len, _results;
      if (toAdd instanceof Range) {
        toAdd.setRanges(this);
        this.ranges.push(toAdd);
        return;
      }
      _results = [];
      for (_i = 0, _len = toAdd.length; _i < _len; _i++) {
        range = toAdd[_i];
        _results.push(this.ranges.push(range));
      }
      return _results;
    };

    Ranges.prototype.sort = function() {
      return this.ranges.sort(function(a, b) {
        if (a.from === b.from) {
          return 0;
        }
        if (a.from > b.from) {
          return 1;
        } else {
          return -1;
        }
      });
    };

    Ranges.prototype.get = function(num) {
      var i, range, step;
      step = 1;
      if (this.currentRange !== 0 && num < this.lastNum) {
        step = -1;
      }
      i = this.currentRange;
      while (range = this.ranges[i]) {
        if (range.includes(num)) {
          this.lastNum = num;
          this.currentRange = i;
          return range;
        }
        i += step;
      }
    };

    return Ranges;

  })();
  Range = (function() {

    function Range(from, to) {
      this.from = from;
      this.to = to;
    }

    Range.prototype.setRange = function(from, to) {
      this.from = from;
      this.to = to;
    };

    Range.prototype.setRanges = function(ranges) {
      this.ranges = ranges;
    };

    Range.prototype.includes = function(num) {
      if ((this.from <= num && num <= this.to)) {
        return true;
      }
      return false;
    };

    Range.prototype._howMuchOutside = function(num) {
      if (num < this.from) {
        return num - this.from;
      }
      if (num > this.to) {
        return num - this.to;
      }
      return 0;
    };

    return Range;

  })();
  OneDirectionalScroller = (function() {

    OneDirectionalScroller.prototype.velocityThreshold = 2;

    function OneDirectionalScroller(scroller, containerWidth, childWidth) {
      this.scroller = scroller;
      this.containerWidth = containerWidth;
      this.childWidth = childWidth;
      this.freeScrollFrom = -(this.childWidth - this.containerWidth);
      this.freeScrollTo = 0;
      this.lastCommitedSticky = 0;
      this.lastCommitedReal = 0;
      this.lastReal = 0;
      this.current = 0;
      this._velocityRecords = [];
      this._lastVelocity = {
        t: 0,
        v: 0
      };
      this.mode = 0;
    }

    OneDirectionalScroller.prototype.scroll = function(delta) {
      var sticky;
      this.mode = 0;
      this._recordForVelocity(delta);
      this.lastReal = this.lastCommitedReal + delta;
      sticky = this._realToSticky(this.lastReal);
      return this.current = sticky;
    };

    OneDirectionalScroller.prototype._realToSticky = function(real) {
      var sticky;
      if (real > this.freeScrollTo) {
        sticky = this.freeScrollTo + this._makeSticky(real - this.freeScrollTo);
      } else if (real < this.freeScrollFrom) {
        sticky = this.freeScrollFrom - this._makeSticky(-(real - this.freeScrollFrom));
      } else {
        sticky = real;
      }
      return sticky;
    };

    OneDirectionalScroller.prototype._recordForVelocity = function(delta) {
      if (this._velocityRecords.length > 2) {
        this._velocityRecords.shift();
      }
      return this._velocityRecords.push({
        x: delta,
        t: Date.now()
      });
    };

    OneDirectionalScroller.prototype._recordedVelocity = function() {
      var first, last, v;
      if (this._velocityRecords.length < 2) {
        this._velocityRecords.length = 0;
        return 0;
      } else {
        first = this._velocityRecords[0];
        last = this._velocityRecords[this._velocityRecords.length - 1];
        v = (last.x - first.x) / (last.t - first.t);
        this._velocityRecords.length = 0;
        if ((Math.abs(v)) < this.velocityThreshold) {
          return 0;
        }
        return v;
      }
    };

    OneDirectionalScroller.prototype.release = function() {
      var v;
      v = this._recordedVelocity();
      if (v) {
        this._lastVelocity.v = v;
        this._lastVelocity.t = Date.now();
      }
      return this._commit();
    };

    OneDirectionalScroller.prototype.animate = function() {
      var x;
      this.scroller.needAnimation();
      x = 1;
      this.current += x;
      this._commit();
      return x;
    };

    OneDirectionalScroller.prototype._commit = function() {
      this.lastCommitedReal = this.lastReal;
      return this.lastReal = 0;
    };

    OneDirectionalScroller.prototype._makeSticky = function(n) {
      var curve, temp;
      temp = Math.limit(n, 0, 800);
      curve = Math.pow(1 + temp / 800, 2);
      return temp / (4 * curve);
    };

    OneDirectionalScroller.prototype._makeReal = function(result) {
      var temp;
      return temp = result * cuvra;
    };

    return OneDirectionalScroller;

  })();
  return Scroll = (function() {

    function Scroll(id, dommy) {
      var childRects, rects;
      this.id = id;
      this.dommy = dommy;
      this.el = this.dommy.el(this.id);
      this.options = {
        axis: 'both'
      };
      this.options = Object.append(this.options, JSON.parse('{' + this.el.getAttribute('data-scroll-options') + '}'));
      this.axis = {
        x: 1,
        y: 1
      };
      if (this.options.axis === 'x') {
        this.axis.y = 0;
      } else if (this.options.axis === 'y') {
        this.axis.x = 0;
      }
      this._rects = rects = this.el.getBoundingClientRect();
      this._width = rects.width;
      this._height = rects.height;
      this._child = this.el.children[0];
      this._childId = this.dommy.fastId(this._child);
      this._transform = this.dommy.styles.getTransform(this._childId, this._child);
      childRects = this._child.getBoundingClientRect();
      this._childWidth = childRects.width;
      this._childHeight = childRects.height;
      this.scrollerX = new OneDirectionalScroller(this, this._width, this._childWidth);
      this.scrollerY = new OneDirectionalScroller(this, this._height, this._childHeight);
      this._animFrame = 0;
      this._boundAnimFunction = this._animFunction.bind(this);
    }

    Scroll.prototype.scroll = function(x, y) {
      this.cancelAnimation();
      if (!this.axis.x) {
        x = 0;
      } else {
        x = this.scrollerX.scroll(x);
      }
      if (!this.axis.y) {
        y = 0;
      } else {
        y = this.scrollerY.scroll(y);
      }
      return this._setTranslate(x, y);
    };

    Scroll.prototype.release = function() {
      if (this.axis.x) {
        this.scrollerX.release();
      }
      if (this.axis.y) {
        this.scrollerY.release();
      }
      return this._transform.commit(this._child);
    };

    Scroll.prototype.needAnimation = function() {
      if (!this._animFrame) {
        return this._animFrame = requestAnimationFrame(this._boundAnimFunction);
      }
    };

    Scroll.prototype.cancelAnimation = function() {
      if (this._animFrame) {
        cancelAnimationFrame(this._animFrame);
        return this._animFrame = 0;
      }
    };

    Scroll.prototype._animFunction = function() {
      var x, y;
      this._animFrame = 0;
      x = 0;
      if (this.axis.x) {
        x = this.scrollerX.animate();
      }
      y = 0;
      if (this.axis.y) {
        y = this.scrollerY.animate();
      }
      this._translate(x, y);
      return this._transform.commit(this._child);
    };

    Scroll.prototype._translate = function(x, y) {
      this._transform.temporarily().translate(x, y);
      return this._transform.apply(this._child);
    };

    Scroll.prototype._setTranslate = function(x, y) {
      this._transform.temporarily().setTranslate(x, y);
      return this._transform.apply(this._child);
    };

    return Scroll;

  })();
});
