var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['native'], function() {
  var Range, Ranges, Scroll;
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
  Range.ScrollInside = (function(_super) {

    __extends(ScrollInside, _super);

    function ScrollInside() {
      return ScrollInside.__super__.constructor.apply(this, arguments);
    }

    ScrollInside.prototype.scroll = function(starting, howMuch) {
      var outside;
      if (!this.includes(starting)) {
        return this.ranges.get(starting).scroll(starting, howMuch, this.ranges);
      }
      outside = this._howMuchOutside(starting + howMuch);
      if (!outside) {
        return howMuch;
      }
      return howMuch;
    };

    return ScrollInside;

  })(Range);
  Range.ScrollOutside = (function(_super) {

    __extends(ScrollOutside, _super);

    function ScrollOutside(from, to, slowDirection) {
      this.from = from;
      this.to = to;
      this.slowDirection = slowDirection != null ? slowDirection : 1;
      ScrollOutside.__super__.constructor.apply(this, arguments);
    }

    ScrollOutside.prototype._multiplier = 0.1;

    ScrollOutside.prototype._determineMovement = function(howMuch) {
      if (howMuch * this.slowDirection >= 0) {
        return howMuch * this._multiplier;
      } else {
        return howMuch;
      }
    };

    ScrollOutside.prototype.scroll = function(starting, howMuch) {
      var movement, outside, startsNext;
      return this._determineMovement(howMuch);
      if (!this.includes(starting)) {
        return this.ranges.get(starting).scroll(starting, howMuch, this.ranges);
      }
      movement = this._determineMovement(howMuch);
      outside = this._howMuchOutside(starting + movement);
      if (!outside) {
        return movement;
      }
      startsNext = starting + movement - outside;
      return this.ranges.get(startsNext).scroll(startsNext, starting + howMuch - startsNext, this.ranges);
    };

    return ScrollOutside;

  })(Range);
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
      this._axisMultiplier = {
        x: 1,
        y: 1
      };
      if (this.options.axis === 'x') {
        this._axisMultiplier.y = 0;
      } else if (this.options.axis === 'y') {
        this._axisMultiplier.x = 0;
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
      this._determinescrollModifiers();
      this.x = 0;
      this.y = 0;
      this._lastTranslateX = 0;
      this._lastTranslateY = 0;
      this._lastScrollX = 0;
      this._lastScrollY = 0;
    }

    Scroll.prototype._determinescrollModifiers = function() {
      var inRangeX;
      this.scrollModifiersX = new Ranges();
      inRangeX = this._childWidth - this._width;
      if (inRangeX < 0) {
        inRangeX = 0;
      }
      this.scrollModifiersX.add(new Range.ScrollOutside(-inRangeX - 5000, -inRangeX - 1, -1));
      this.scrollModifiersX.add(new Range.ScrollInside(-inRangeX, 0));
      return this.scrollModifiersX.add(new Range.ScrollOutside(0, 5000, 1));
    };

    Scroll.prototype.scroll = function(x, y) {
      var diffX, realX;
      diffX = x - this._lastScrollX;
      this._lastScrollX = x;
      diffX *= this._axisMultiplier.x;
      realX = 0;
      if (diffX) {
        realX = this.scrollModifiersX.get(this.x).scroll(this.x, diffX);
        this.x += realX;
      }
      return this._translate(realX, 0);
    };

    Scroll.prototype.release = function() {
      this._lastTranslateX = 0;
      this._lastTranslateY = 0;
      this._lastScrollX = 0;
      this._lastScrollY = 0;
      return this._transform.commit(this._child);
    };

    Scroll.prototype._translate = function(x, y) {
      this._lastTranslateX += x;
      this._lastTranslateY += y;
      this._transform.temporarily().translate(this._lastTranslateX, this._lastTranslateY);
      return this._transform.apply(this._child);
    };

    return Scroll;

  })();
});
