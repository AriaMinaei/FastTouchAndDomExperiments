require(['domReady', 'benchmark', 'graphics/matrix3d', 'graphics/matrix3d/base', 'graphics/matrix3d/rotation', 'native'], function(domReady, Benchmark, Matrix3d, Base, Rotation) {
  var cssToMatrix, dummyDiv;

  dummyDiv = document.createElement('div');
  document.body.appendChild(dummyDiv);
  cssToMatrix = function(css) {
    dummyDiv.style.webkitTransform = css;
    return Base.fromString(getComputedStyle(dummyDiv).webkitTransform);
  };
  return domReady(function() {
    return (function() {
      var createArray, createObject, suite;

      suite = new Benchmark.Suite;
      createObject = function() {
        return {
          x: 1,
          y: 2,
          z: 3
        };
      };
      createArray = function() {
        return [1, 2, 3];
      };
      suite.add('o', function() {
        var b;

        return b = createObject();
      });
      suite.add('a', function() {
        var b;

        return b = createArray();
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

/*
//@ sourceMappingURL=pg2.map
*/
