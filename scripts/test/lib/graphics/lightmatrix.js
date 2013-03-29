require('../../prepare');

spec(['graphics/lightmatrix'], function(LightMatrix) {
  var l;

  l = new LightMatrix;
  return;
  l.setRotationX(2);
  l.rotateX(1);
  l.rotation().x.should.equal(3);
  l.temporarily().rotateX(2);
  l.rotation().x.should.equal(5);
  l.temporarily().rotation().x.should.equal(3);
  l.rotateX(2).commit();
  return l.rotation().x.should.equal(3);
});

/*
//@ sourceMappingURL=lightmatrix.map
*/
