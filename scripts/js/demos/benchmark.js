require(['dev/benchmark/simple-suite', 'utility/hash', 'utility/array'], function(suite, Hash, array) {
  var empty, h, i, num, obj, _i;

  num = 32;
  empty = function() {};
  array = [];
  obj = {};
  h = new Hash;
  for (i = _i = 0; 0 <= num ? _i < num : _i > num; i = 0 <= num ? ++_i : --_i) {
    array.push(empty);
    obj[i] = empty;
    h.set(i, empty);
  }
  suite.add('array', function() {
    var func, _j, _len;

    for (_j = 0, _len = array.length; _j < _len; _j++) {
      func = array[_j];
      func();
    }
    return null;
  });
  suite.add('hash.array', function() {
    var func, _j, _len, _ref;

    _ref = h.array;
    for (_j = 0, _len = _ref.length; _j < _len; _j++) {
      func = _ref[_j];
      func();
    }
    return null;
  });
  suite.add('hash.each', function() {
    h.each(function(i, val) {
      return val();
    });
    return null;
  });
  return suite.add('obj', function() {
    for (i in obj) {
      obj[i]();
    }
    return null;
  });
});

/*
//@ sourceMappingURL=benchmark.map
*/
