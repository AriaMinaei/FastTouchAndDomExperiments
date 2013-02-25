var __slice = [].slice;

define(['behavior/scroll/singleAxis', 'native'], function(SingleAxisScroller) {
  var BasicScroller;
  return BasicScroller = (function() {

    function BasicScroller(axis, fn) {
      var props, single, _i, _len;
      this.fn = fn;
      this.axisScrollers = [];
      this.axisProps = [];
      for (_i = 0, _len = axis.length; _i < _len; _i++) {
        single = axis[_i];
        props = {
          d: 0,
          stretch: 0
        };
        this.axisProps.push(props);
        this.axisScrollers.push(new SingleAxisScroller(single, props, this));
      }
      null;
    }

    BasicScroller.prototype.scroll = function() {
      var delta, deltas, _i, _len;
      deltas = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = deltas.length; _i < _len; _i++) {
        delta = deltas[_i];
        this.axisScrollers.scroll(delta);
      }
      return null;
    };

    BasicScroller.prototype.release = function() {
      var scroller, _i, _len, _ref;
      _ref = this.axisScrollers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        scroller = _ref[_i];
        scroller.release();
      }
      return null;
    };

    return BasicScroller;

  })();
});
