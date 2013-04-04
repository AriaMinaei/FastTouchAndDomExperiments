require(['domReady', 'benchmark', 'graphics/lightmatrix', 'native'], function(domReady, Benchmark, LightMatrix) {
  var Transform = function (el){

	this.el = el;

	this.rotation  = [0, 0, 0, 0];

	this.translate    = [0, 0, 0];

	this.pers = 100000;

	this.sca = 1;

	Transform.prototype.getTranslate = function() {
		return this.translate;
	};

	Transform.prototype.getEl = function() {

		return this.el;
	};	

	Transform.prototype.scale = function(input) {

		this.sca = input;

		return this;
	};

	Transform.prototype.perspective = function(input) {

		this.pers = input;

		return this;
	};

	Transform.prototype.rotationX = function(input) {

		this.rotation[0] = input;

		return this;
	};

	Transform.prototype.rotationY = function(input) {

		this.rotation[1] = input;

		return this;
	};

	Transform.prototype.rotationZ = function(input) {

		this.rotation[2] = input;

		return this;
	};

	Transform.prototype.rotationXZ = function(input) {

		this.rotation[3] = input;

		return this;
	};

	Transform.prototype.translateX = function(input) {

		this.translate[0] = input;

		return this;
	};

	Transform.prototype.translateY = function(input) {

		this.translate[1] = input;

		return this;
	};

	Transform.prototype.translateZ = function(input) {

		this.translate[2] = input;

		return this;
	};

	Transform.prototype.applyToElement = function() {
		
		this.el.style.webkitTransform = 
		
			'perspective(' + this.pers + ') '+
			'translateX(' + this.translate[0] + 'px) '+
			'translateY(' + this.translate[1] + 'px) '+
			'translateZ(' + this.translate[2] + 'px) '+
			'rotate3d(1,0,0,' + this.rotation[0] + 'deg) '+
			'rotate3d(0,1,0,' + this.rotation[1] + 'deg) '+
			'rotate3d(0,0,1,' + this.rotation[2] + 'deg) '+
			'rotate3d(1,0,1,' + this.rotation[3] + 'deg) '+
			'scale(' + this.sca + ')';

	};
};
  var Animate;

  Animate = (function() {
    function Animate(el) {
      this.el = el;
      this.transform = new Transform(this.el);
    }

    Animate.prototype.transition = function(X, Y, duration, delay) {
      var animate, distance, oldX, oldY, startTime, translate,
        _this = this;

      translate = this.transform.getTranslate();
      oldX = parseInt(translate[0]);
      oldY = parseInt(translate[1]);
      distance = {
        X: X - oldX,
        Y: Y - oldY
      };
      startTime = Date.now() + delay;
      animate = function() {
        var passed, progress;

        passed = Date.now() - startTime;
        progress = passed / duration;
        if (startTime < Date.now()) {
          _this.transform.translateX(distance.X * progress + oldX);
          _this.transform.translateY(distance.Y * progress + oldY);
          _this.transform.scale(progress);
          _this.transform.rotationX(progress * 360);
          _this.transform.rotationY(progress * 360);
          _this.transform.rotationZ(progress * 360);
          _this.transform.applyToElement();
        }
        if (progress < 1) {
          return webkitRequestAnimationFrame(animate);
        } else {
          _this.transform.translateX(distance.X + oldX);
          _this.transform.translateY(distance.Y + oldY);
          _this.transform.rotationX(360);
          _this.transform.rotationY(360);
          _this.transform.rotationZ(360);
          return _this.transform.applyToElement();
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
    for (i = _i = 0; _i <= 200; i = ++_i) {
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
      suite.add('l', function() {});
      suite.add('l', function() {});
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
//@ sourceMappingURL=benchmark-pn.map
*/
