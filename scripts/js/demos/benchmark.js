require(['domReady', 'benchmark', 'graphics/lightmatrix', 'native'], function(domReady, Benchmark, LightMatrix) {
  var cssToMatrix, dummyDiv;

  dummyDiv = document.createElement('div');
  document.body.appendChild(dummyDiv);
  cssToMatrix = function(css) {
    dummyDiv.style.webkitTransform = css;
    return Base.fromString(getComputedStyle(dummyDiv).webkitTransform);
  };
  return domReady(function() {
    return (function() {
      var l, suite, w;

      suite = new Benchmark.Suite;
      l = new LightMatrix;
      w = new WebKitCSSMatrix;
      suite.add('l', function() {
        l.rotate(1, 2, 3);
        return l.toCss();
      });
      suite.add('w', function() {
        w = w.rotate(1, 2, 3);
        return w.toString();
      });
      suite.on('cycle', function(e) {
        return console.log(String(e.target));
      });
      suite.on('complete', function() {
        console.log(l, w);
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
