var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['./easing'], function(Easing) {
  var Tween;

  return Tween = (function() {
    function Tween(from, to, duration, curve) {
      this.from = from;
      this.to = to;
      this.duration = duration;
      this.curve = curve != null ? curve : Easing.linear;
      this.start = 0;
    }

    Tween.prototype.on = function(t) {
      return (this.to - this.from) * this.curve((t - this.start) / this.duration) + this.from;
    };

    Tween.prototype.frame = function() {
      return this.on(Date.now());
    };

    Tween.prototype.startsAt = function(start) {
      this.start = start;
    };

    return Tween;

  })();
});

/*
//@ sourceMappingURL=tween.map
*/
