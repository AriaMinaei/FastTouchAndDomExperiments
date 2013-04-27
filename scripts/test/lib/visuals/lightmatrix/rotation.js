require('../../../prepare');

spec(['visuals/lightmatrix/rotation', 'visuals/lightmatrix/scale', 'visuals/lightmatrix/base'], function(Rotation, Scale, Base) {
  test('x', function() {
    return Base.toCss(Rotation.matrix(1, 0, 0)).should.equal("matrix3d(1, 0, 0, 0, 0, 0.5403023058681398, 0.8414709848078965, 0, 0, -0.8414709848078965, 0.5403023058681398, 0, 0, 0, 0, 1)");
  });
  test('y', function() {
    return Base.toCss(Rotation.matrix(0, 1, 0)).should.equal("matrix3d(0.5403023058681398, 0, -0.8414709848078965, 0, 0, 1, 0, 0, 0.8414709848078965, 0, 0.5403023058681398, 0, 0, 0, 0, 1)");
  });
  test('z', function() {
    return Base.toCss(Rotation.matrix(0, 0, 1)).should.equal(Base.toCss(Base.fromCss("matrix(0.5403023058681398, 0.8414709848078965, -0.8414709848078965, 0.5403023058681398, 0, 0)")));
  });
  test('xy', function() {
    return Base.toCss(Rotation.matrix(1, 2, 0)).should.equal("matrix3d(-0.4161468365471424, 0.7651474012342926, -0.49129549643388193, 0, 0, 0.5403023058681398, 0.8414709848078965, 0, 0.9092974268256817, 0.35017548837401463, -0.2248450953661529, 0, 0, 0, 0, 1)");
  });
  test('xyz', function() {
    return (Base.toArray(Rotation.matrix(1, 2, 3)).map(function(v) {
      return v.toPrecision(4);
    })).shouldEqual(Base.css2Array("matrix3d(0.41198224565683, -0.6812427202564033, 0.6051272472413688, 0, 0.05872664492762098, -0.642872836134547, -0.7637183366502791, 0, 0.9092974268256817, 0.35017548837401463, -0.2248450953661529, 0, 0, 0, 0, 1)").map(function(v) {
      return v.toPrecision(4);
    }));
  });
  test('applyTo', function() {
    return Base.toCss(Rotation.applyTo(Base.identity(), 1, 2, 3)).should.equal("matrix3d(0.411982245665683, -0.6812427202564033, 0.6051272472413688, 0, 0.05872664492762098, -0.642872836134547, -0.7637183366502791, 0, 0.9092974268256817, 0.35017548837401463, -0.2248450953661529, 0, 0, 0, 0, 1)");
  });
  return test('multiplication', function() {
    var correctArray, final, finalArray, i, rot, scale, val, _i, _len, _results;

    scale = Scale.matrix(1.1, 1.2, 1.3);
    rot = Rotation.matrix(1, 2, 3);
    final = Base.multiply(scale, rot);
    finalArray = Base.toArray(final);
    correctArray = Base.css2Array("matrix3d(0.45318047023225133, -0.817491264307684, 0.7866654214137794, 0, 0.06459930942038308, -0.7714474033614562, -0.9928338376453627, 0, 1.0002271695082499, 0.42021058604881756, -0.2922986239759988, 0, 0, 0, 0, 1)");
    _results = [];
    for (i = _i = 0, _len = finalArray.length; _i < _len; i = ++_i) {
      val = finalArray[i];
      _results.push(Number(val).toPrecision(14).should.equal(Number(correctArray[i]).toPrecision(14)));
    }
    return _results;
  });
});

/*
//@ sourceMappingURL=rotation.map
*/
