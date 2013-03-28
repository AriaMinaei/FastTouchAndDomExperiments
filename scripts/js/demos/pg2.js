require(['domReady', 'benchmark', 'graphics/matrix3d', 'graphics/matrix3d/base', 'graphics/matrix3d/rotation', 'native'], function(domReady, Benchmark, Matrix3d, Rotation, Base) {
  var cssToMatrix, dummyDiv;

  Rotation = Matrix3d.Rotation;
  dummyDiv = document.createElement('div');
  document.body.appendChild(dummyDiv);
  cssToMatrix = function(css) {
    dummyDiv.style.webkitTransform = css;
    return Base.fromString(getComputedStyle(dummyDiv).webkitTransform);
  };
  return domReady(function() {
    return (function() {
      var a, b, d, rotation, suite;

      suite = new Benchmark.Suite;
      a = [1, 2, 3, 4, 5, 6, 7, 8, 8, 7, 6, 5, 4, 3, 2, 1];
      d = 200;
      rotation = new Rotation(1, 2, 3);
      b = rotation.generateMatrix();
      suite.add('cached', function() {
        return Base.multiply(a, b);
      });
      suite.add('uncached', function() {
        return Base.multiply(a, rotation.generateMatrix());
      });
      suite.on('cycle', function(e) {
        return console.log(String(e.target));
      });
      suite.on('complete', function() {
        return console.log('Fastest:', this.filter('fastest').pluck('name')[0]);
      });
      return window.run = function() {
        suite.run({
          async: true
        });
        return null;
      };
    })();
  });
});
