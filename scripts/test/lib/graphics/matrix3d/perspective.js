
require('../../../prepare');

spec(['graphics/matrix3d/perspective'], function(Perspective) {
  var correctMatrix, p;
  p = new Perspective(400);
  correctMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -0.0025, 0, 0, 0, 1];
  return p.getMatrix().shouldEqual(correctMatrix);
});
