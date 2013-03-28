require('../../../prepare');

spec(['graphics/matrix3d/scale'], function(Scale) {
  var correctMatrix, s;

  correctMatrix = [0.1, 0, 0, 0, 0, 0.2, 0, 0, 0, 0, 0.3, 0, 0, 0, 0, 1];
  s = new Scale(0.1, 0.2, 0.3);
  return s.getMatrix().shouldEqual(correctMatrix);
});
