(function() {
  var root;

  root = this;

  document.addEventListener("DOMContentLoaded", function() {
    window.t = {
      el: null,
      m: new Graphics.Matrix3d,
      "default": function() {
        this.fromEl(document.querySelectorAll('.two.extra')[0]);
        return this;
      },
      fromEl: function(el) {
        this.el = el;
        this.m.fromString(getComputedStyle(this.el).webkitTransform);
        return this;
      },
      apply: function() {
        this.el.style.webkitTransform = this.m.toString();
        return this;
      }
    };
    t["default"]();
    window.m = t.m;
    setInterval(function() {
      return t.apply();
    }, 1000);
    m._setRotationZ(Math.PI / 4);
    console.log('m', m.toString());
    return console.log('w', getComputedStyle(document.querySelectorAll('.two.alone')[0]).webkitTransform);
  });

}).call(this);
