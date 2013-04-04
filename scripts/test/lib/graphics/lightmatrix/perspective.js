require('../../../prepare');

spec(['graphics/lightmatrix/perspective', 'graphics/lightmatrix/base'], function(Perspective, Base) {
  return Base.toCss(Perspective.matrix(100)).should.equal("matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -0.01, 0, 0, 0, 1)");
});

/*
//@ sourceMappingURL=perspective.map
*/
