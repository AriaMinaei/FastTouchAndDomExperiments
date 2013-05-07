require(['dev/benchmark/simple-suite', 'visuals/lightmatrix/base'], function(suite, base) {
  var matrix;

  window.original = 1.2246063538223773e-15;
  matrix = base.fromArray([1.2246063538223773e-15, 15, 2, 10, 1.2246063538223773e-15, 0, 20, 10, 3, 15, 1.2246063538223773e-15, 3, 1.2246063538223773e-15, 1, 0, 10]);
  suite.add('toCss', function() {
    return base.toCss(matrix);
  });
  return suite.add('toCss2', function() {
    return base.toCss2(matrix);
  });
});

/*
//@ sourceMappingURL=benchmark.map
*/
