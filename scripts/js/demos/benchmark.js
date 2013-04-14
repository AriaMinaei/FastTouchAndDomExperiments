require(['domReady', 'benchmark'], function(domReady, Benchmark) {
  return domReady(function() {
    return (function() {
      var suite;

      suite = new Benchmark.Suite;
      suite.add('1', function() {});
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
