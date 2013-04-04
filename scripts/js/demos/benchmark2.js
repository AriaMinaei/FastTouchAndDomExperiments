require(['domReady', 'benchmark', 'graphics/lightmatrix', 'native'], function(domReady, Benchmark, LightMatrix) {
  var Animate, doTofmal, tofmalAnim, tofmalCurrent, tofmals;

  tofmals = {
    a: [],
    b: [],
    current: 'a'
  };
  tofmalCurrent = 1;
  tofmalAnim = function(request) {
    return tofmals[tofmals.current].push(request);
  };
  doTofmal = function() {
    var request, requests, _i, _len;

    requests = tofmals[tofmals.current];
    tofmals.current = tofmals.current === 'b' ? 'a' : 'b';
    for (_i = 0, _len = requests.length; _i < _len; _i++) {
      request = requests[_i];
      request();
    }
    requests.length = 0;
    return webkitRequestAnimationFrame(doTofmal);
  };
  doTofmal();
  Animate = (function() {
    function Animate(el) {
      this.el = el;
      this.matrix = new LightMatrix;
    }

    Animate.prototype.applyToEl = function(css) {
      return this.el.style.webkitTransform = css;
    };

    Animate.prototype.transition = function(X, Y, duration, delay) {
      var animate, distance, oldX, oldY, startTime, translate,
        _this = this;

      translate = this.matrix.movement();
      oldX = parseInt(translate.x);
      oldY = parseInt(translate.y);
      distance = {
        X: X - oldX,
        Y: Y - oldY
      };
      startTime = Date.now() + delay;
      animate = function() {
        var a, passed, progress;

        passed = Date.now() - startTime;
        progress = passed / duration;
        if (startTime < Date.now()) {
          _this.matrix.setMovementX(distance.X * progress + oldX);
          _this.matrix.setMovementY(distance.Y * progress + oldY);
          _this.matrix.setScaleAll(progress);
          _this.matrix.setRotationX(progress * 6.283);
          _this.matrix.setRotationY(progress * 6.283);
          _this.matrix.setRotationZ(progress * 6.283);
          _this.applyToEl(_this.matrix.toCss());
        }
        if (progress < 1) {
          tofmalAnim(animate);
          return a = 0;
        } else {
          _this.matrix.setMovementX(distance.X + oldX);
          _this.matrix.setMovementY(distance.Y + oldY);
          _this.matrix.setRotationX(6.283);
          _this.matrix.setRotationY(6.283);
          _this.matrix.setRotationZ(6.283);
          return _this.applyToEl(_this.matrix.toCss());
        }
      };
      return animate();
    };

    return Animate;

  })();
  return domReady(function() {
    var animates, baba, blue, color, el, els, green, i, index, red, start, startIt, _i, _j, _len, _test;

    _test = document.createElement('div');
    _test.classList.add('test');
    baba = document.querySelector('.baba');
    for (i = _i = 0; _i <= 100; i = ++_i) {
      baba.appendChild(_test.cloneNode());
    }
    start = document.getElementById('start');
    els = document.querySelectorAll('.test');
    animates = [];
    for (index = _j = 0, _len = els.length; _j < _len; index = ++_j) {
      el = els[index];
      red = parseInt(Math.random() * 255);
      green = parseInt(Math.random() * 255);
      blue = parseInt(Math.random() * 255);
      color = 'rgb(' + red + ',' + green + ',' + blue + ')';
      el.style.backgroundColor = color;
      animates[index] = new Animate(el);
    }
    startIt = function() {
      var animate, _k, _len1;

      for (_k = 0, _len1 = animates.length; _k < _len1; _k++) {
        animate = animates[_k];
        animate.transition(Math.random() * document.width, Math.random() * document.height, 2000, Math.random() * 1000);
      }
      return null;
    };
    window.s = startIt;
    document.addEventListener('click', startIt);
    return (function() {
      var suite;

      suite = new Benchmark.Suite;
      suite.add('uncached', function() {
        var a;

        return a = 2 * Math.PI;
      });
      suite.add('cached', function() {
        var a;

        return a = 6.283185307179586;
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
//@ sourceMappingURL=benchmark2.map
*/
