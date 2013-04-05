var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  var math;

  return math = {
    square: function(n) {
      return n * n;
    },
    distance: function(x1, y1, x2, y2) {
      return Math.sqrt(math.square(x2 - x1) + math.square(y2 - y1));
    },
    limit: function(n, from, to) {
      if (n > to) {
        return to;
      }
      if (n < from) {
        return from;
      }
      return n;
    },
    unit: function(n) {
      if (n < 0) {
        return -1;
      }
      return 1;
    }
  };
});

/*
//@ sourceMappingURL=math.map
*/
