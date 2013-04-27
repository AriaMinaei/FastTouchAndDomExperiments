require('../../prepare');

spec(['visuals/lightmatrix', 'visuals/lightmatrix/base'], function(LightMatrix, Base) {
  var l;

  l = new LightMatrix;
  test('rotate', function() {
    l.setRotationX(2);
    l.rotateX(1);
    l.rotation().x.should.equal(3);
    l.temporarily().rotateX(2);
    return l.rotation().x.should.equal(5);
  });
  test('temporarily', function() {
    l.temporarily().rotation().x.should.equal(3);
    l.rotateX(2).commit();
    return l.rotation().x.should.equal(5);
  });
  test('toCss', function() {
    return l.toCss().should.equal("matrix3d(1, 0, 0, 0, 0, 0.28366218546322625, -0.9589242746631385, 0, 0, 0.9589242746631385, 0.28366218546322625, 0, 0, 0, 0, 1)");
  });
  test('translate', function() {
    l.translate(10, 11, 12);
    return l.toCss().should.equal("matrix3d(1, 0, 0, 0, 0, 0.28366218546322625, -0.9589242746631385, 0, 0, 0.9589242746631385, 0.28366218546322625, 0, 10, 14.627375336053149, -7.144220795735808, 1)");
  });
  test('move', function() {
    l.move(1, 2, 3);
    return l.toCss().should.equal("matrix3d(1, 0, 0, 0, 0, 0.28366218546322625, -0.9589242746631385, 0, 0, 0.9589242746631385, 0.28366218546322625, 0, 11, 16.62737533605315, -4.144220795735808, 1)");
  });
  test('scale', function() {
    l.scale(1, 2, 3);
    return l.toCss().should.equal("matrix3d(1, 0, 0, 0, 0, 0.5673243709264525, -2.8767728239894153, 0, 0, 1.917848549326277, 0.8509865563896788, 0, 11, 31.254750672106297, -18.432662387207422, 1)");
  });
  test('perspective', function() {
    l.setPerspective(400);
    return l.toCss().should.equal("matrix3d(1, 0, 0, 0, 0.002397310686657846, 0.5721189922997681, -2.869580891929442, 0.002397310686657846, -0.0007091554636580657, 1.9164302383989609, 0.8488590899987046, -0.0007091554636580657, 11.01786055198934, 31.290471776084978, -18.379080731239405, 1.0178605519893396)");
  });
  return test('final', function() {
    l.rotateY(6);
    l.rotateZ(7);
    return (l.toArray().map(function(v) {
      return v.toPrecision(8);
    })).shouldEqual(Base.css2Array("matrix3d(0.7253001596549816, 0.7795743235475163, -1.706462346989038, 0.0014256159958137328, -0.6288814916308306, 0.07951841061412396, -2.319210466166395, 0.001937519186438091, -0.2800964082037461, 1.8400993713489595, 0.815049275769825, -0.0006809100048202381, -2.0258517098342743, 32.75163820841804, -29.795347288482823, 1.0273979509511135)").map(function(v) {
      return v.toPrecision(8);
    }));
  });
});

/*
//@ sourceMappingURL=lightmatrix.map
*/
