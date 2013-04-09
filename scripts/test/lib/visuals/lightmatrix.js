require('../../prepare');

spec(['visuals/lightmatrix'], function(LightMatrix) {
  var l;

  l = new LightMatrix;
  l.setRotationX(2);
  l.rotateX(1);
  l.rotation().x.should.equal(3);
  l.temporarily().rotateX(2);
  l.rotation().x.should.equal(5);
  l.temporarily().rotation().x.should.equal(3);
  l.rotateX(2).commit();
  l.rotation().x.should.equal(5);
  l.toCss().should.equal("matrix3d(1, 0, 0, 0, 0, 0.28366218546322625, -0.9589242746631385, 0, 0, 0.9589242746631385, 0.28366218546322625, 0, 0, 0, 0, 1)");
  l.translate(10, 11, 12);
  l.toCss().should.equal("matrix3d(1, 0, 0, 0, 0, 0.28366218546322625, -0.9589242746631385, 0, 0, 0.9589242746631385, 0.28366218546322625, 0, 10, 14.627375336053149, -7.144220795735808, 1)");
  l.move(1, 2, 3);
  l.toCss().should.equal("matrix3d(1, 0, 0, 0, 0, 0.28366218546322625, -0.9589242746631385, 0, 0, 0.9589242746631385, 0.28366218546322625, 0, 11, 16.62737533605315, -4.144220795735808, 1)");
  l.scale(1, 2, 3);
  l.toCss().should.equal("matrix3d(1, 0, 0, 0, 0, 0.5673243709264525, -2.8767728239894153, 0, 0, 1.917848549326277, 0.8509865563896788, 0, 11, 31.254750672106297, -18.432662387207422, 1)");
  l.setPerspective(400);
  l.toCss().should.equal("matrix3d(1, 0, 0, 0, 0.002397310686657846, 0.5721189922997681, -2.869580891929442, 0.002397310686657846, -0.0007091554636580657, 1.9164302383989609, 0.8488590899987046, -0.0007091554636580657, 11.01786055198934, 31.290471776084978, -18.379080731239405, 1.0178605519893396)");
  l.rotateY(6);
  return l.rotateZ(7);
});

/*
//@ sourceMappingURL=lightmatrix.map
*/
