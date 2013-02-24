
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
      this._outOfBoundScrollBeginX = 0;
      this._outOfBoundScrollEndX = -(this._childWidth - this._width);
      this._lastCommitedScrollX = 0;
      this.x = 0;
    }

    Scroll.prototype.scroll = function(x, y) {
      var intendedScrollX, realX;
      intendedScrollX = this._lastCommitedScrollX + x;
      if (intendedScrollX > this._outOfBoundScrollBeginX) {
        realX = this._outOfBoundScrollBeginX + this._curveOutOfBoundScroll(intendedScrollX - this._outOfBoundScrollBeginX);
      } else if (intendedScrollX < this._outOfBoundScrollEndX) {
        realX = this._outOfBoundScrollEndX - this._curveOutOfBoundScroll(-(intendedScrollX - this._outOfBoundScrollEndX));
      } else {
        realX = intendedScrollX;
      }
      return this._setTranslate(realX, 0);
    };

    Scroll.prototype._curveOutOfBoundScroll = function(n) {
      var curve, temp;
      temp = Math.limit(n, 0, 800);
      curve = Math.sin(Math.PI / 2 * temp / 800);
      return temp / (1 + (2 * curve));
    };

    Scroll.prototype.release = function() {
      this._lastCommitedScrollX = this.x;
      return this._transform.commit(this._child);
    };

    Scroll.prototype._translate = function(x, y) {
      this.x = this._lastCommitedScrollX + x;
      this._transform.temporarily().translate(x, 0);
      return this._transform.apply(this._child);
    };

    Scroll.prototype._setTranslate = function(x, y) {
      this.x = x;
      this._transform.temporarily().setTranslate(x, 0);
      return this._transform.apply(this._child);
    };

    return Scroll;

  })();
});
