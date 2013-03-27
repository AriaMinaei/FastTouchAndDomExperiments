
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
    var matrix1, matrix2, rad, transform1, transform2, w1, w2, wm;
    rad = 30 * Math.PI / 180;
    transform1 = 'perspective(400) rotate3d(0.5, 1, 0.3, 32deg) scale3d(1.1, 0.5, 1.05) skew(10deg, 12deg) translate3d(10px, 11px, 12px)';
    matrix1 = cssToMatrix(transform1);
    w1 = Base.toWebkit(matrix1);
    console.log('matrix1', matrix1);
    transform2 = 'perspective(450) rotate3d(0.4, 3, 0.5, 32deg) scale3d(1.2, 1.5, 0.05) skew(12deg, 11deg) translate3d(11px, 13px, 14px)';
    matrix2 = cssToMatrix(transform2);
    w2 = Base.toWebkit(matrix2);
    console.log('matrix2', matrix2);
    wm = w1.multiply(w2);
    return console.log('multiplied', Base.fromWebkit(wm));
  });
});
