var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  var array;

  return array = {
    pluck: function(a, i) {
      var index, value, _i, _len;

      for (index = _i = 0, _len = a.length; _i < _len; index = ++_i) {
        value = a[index];
        if (index > i) {
          a[index - 1] = a[index];
        }
      }
      a.length = a.length - 1;
      return a;
    }
  };
});

/*
//@ sourceMappingURL=array.map
*/
