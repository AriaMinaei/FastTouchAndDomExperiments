
require(['domReady', 'graphics/matrix3d', 'graphics/matrix3d/base', 'native'], function(domReady, Matrix3d, Base) {
  var Rotation, cssToMatrix, dummyDiv;
  Rotation = Matrix3d.Rotation;
  dummyDiv = document.createElement('div');
  document.body.appendChild(dummyDiv);
  cssToMatrix = function(css) {
    dummyDiv.style.webkitTransform = css;
    return Base.fromString(getComputedStyle(dummyDiv).webkitTransform);
  };
  return domReady(function() {
    var rad;
    return rad = 30 * Math.PI / 180;
  });
});
