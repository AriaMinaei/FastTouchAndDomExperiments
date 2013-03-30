require(['domReady', 'native'], function(domReady) {
  var Transformer, dad, getDot, _dot;

  Transformer = (function() {
    function Transformer() {
      this.tX = this.tY = this.tZ = this.rX = this.rY = this.rZ = 0;
      this.p = 100000;
    }

    Transformer.prototype.translate = function(tX, tY, tZ) {
      this.tX = tX;
      this.tY = tY;
      this.tZ = tZ;
    };

    Transformer.prototype.rotate = function(rX, rY, rZ) {
      this.rX = rX;
      this.rY = rY;
      this.rZ = rZ;
    };

    Transformer.prototype.perspective = function(p) {
      this.p = p;
    };

    Transformer.prototype.applyTo = function(el) {
      var tr;

      tr = ("translate3d(" + this.tX + "px, " + this.tY + "px, " + this.tZ + "px) ") + ("perspective(" + this.p + ") ") + ("rotate3d(1, 0, 0, " + this.rX + "rad) ") + ("rotate3d(0, 1, 0, " + this.rY + "rad) ") + ("rotate3d(0, 0, 1, " + this.rZ + "rad) ");
      console.log(tr);
      return el.style.webkitTransform = tr;
    };

    return Transformer;

  })();
  dad = document.querySelector('.dad');
  _dot = document.createElement('div');
  _dot.classList.add('dot');
  getDot = function() {
    return _dot.cloneNode();
  };
  return domReady(function() {
    var c, dot, i, j, num, phi, r, t, teta, x, y, z, _i, _results;

    num = 16;
    r = 316;
    c = {
      x: 1500,
      y: 500,
      z: 0
    };
    _results = [];
    for (i = _i = 0; 0 <= num ? _i < num : _i > num; i = 0 <= num ? ++_i : --_i) {
      _results.push((function() {
        var _j, _results1;

        _results1 = [];
        for (j = _j = 0; 0 <= num ? _j < num : _j > num; j = 0 <= num ? ++_j : --_j) {
          teta = i / num * Math.PI * 2;
          phi = j / num * Math.PI * 2;
          x = (r * Math.cos(teta) * Math.cos(phi)).toFixed(2);
          z = (r * Math.sin(teta) * Math.cos(phi)).toFixed(2);
          y = (r * Math.sin(phi)).toFixed(2);
          dot = getDot();
          t = new Transformer;
          t.translate(x + c.x, y + c.y, z + c.z);
          t.rotate(0, Math.atan(x / z), Math.atan(x / y));
          t.applyTo(dot);
          _results1.push(dad.appendChild(dot));
        }
        return _results1;
      })());
    }
    return _results;
  });
});

/*
//@ sourceMappingURL=pg2.map
*/
