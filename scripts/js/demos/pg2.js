
require(['domReady', 'graphics/matrix3d', 'graphics/fastMatrix', 'utils/test', 'native'], function(domReady, Matrix3d, FastMatrix, Test) {
  var Rotation, cssToMatrix, dummyDiv, eq;
  eq = Test.eq;
  Rotation = Matrix3d.Rotation;
  dummyDiv = document.createElement('div');
  document.body.appendChild(dummyDiv);
  cssToMatrix = function(css) {
    dummyDiv.style.webkitTransform = css;
    return Matrix3d.fromString(getComputedStyle(dummyDiv).webkitTransform);
  };
  return domReady(function() {
    var matrix, rad;
    rad = 30 * Math.PI / 180;
    matrix = new Matrix3d;
    matrix.setRotation(1, 1, 1);
    console.log(matrix.generateMatrix());
    return console.log(cssToMatrix('rotate3d(1, 0, 0, ' + 1 + 'rad) rotate3d(0, 1, 0, ' + 1 + 'rad) rotate3d(0, 0, 1, ' + 1 + 'rad)'));
  });
});
