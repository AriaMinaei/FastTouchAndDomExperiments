require(['domReady', 'benchmark', 'graphics/lightmatrix', 'graphics/lightmatrix/base', 'graphics/matrix3d/base', 'native'], function(domReady, Benchmark, LightMatrix, Base, OldBase) {
  var cssToMatrix, dummyDiv;

  dummyDiv = document.createElement('div');
  document.body.appendChild(dummyDiv);
  cssToMatrix = function(css) {
    dummyDiv.style.webkitTransform = css;
    return Base.fromString(getComputedStyle(dummyDiv).webkitTransform);
  };
  return domReady(function() {
    return (function() {
      var i, suite, w;

      suite = new Benchmark.Suite;
      w = Base.identity();
      i = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      suite.add('1', function() {
        return Base.toCss(w);
      });
      suite.add('2', function() {});
      suite.on('cycle', function(e) {
        return console.log(String(e.target));
      });
      suite.on('complete', function() {
        console.log(Base.toCss(w) === 'matrix3d(' + i.join(', ') + ')');
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
//@ sourceMappingURL=benchmark.map
*/
