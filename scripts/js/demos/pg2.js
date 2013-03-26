
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
    var fromX, fromY, rad;
    rad = 30 * Math.PI / 180;
    fromX = Matrix3d.toWebkit(Rotation.rotateX(rad));
    fromY = Matrix3d.toWebkit(Rotation.rotateY(rad));
    console.log('us  ', Matrix3d.fromWebkit(fromX.multiply(fromY)));
    return console.log('them', Matrix3d.multiply(Rotation.rotateX(rad), Rotation.rotateY(rad)));
  });
});
