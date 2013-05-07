var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['utility/math'], function(math) {
  var Transform;

  return Transform = {
    name: 'transform',
    check: function() {
      return 1;
      if (this.h.lastEvents[this.h.lastEventType].touches.length > 1) {
        return 1;
      }
      if (this.h.hadRealMove && this.h.starts === 1) {
        return -1;
      }
      return 0;
    },
    init: function() {
      var last;

      last = this.h.lastEvents[this.h.lastEventType];
      this.h.vars.lastTranslateX = 0;
      this.h.vars.lastTranslateY = 0;
      this.h.vars.lastScale = 1;
      this._prepareForTransform(this.h, last.touches[0], last.touches[1]);
      return null;
    },
    _prepareForTransform: function(a, b) {
      var elDims, startX, startY;

      this.h.vars.mode = 1;
      this.h.vars.aId = a.identifier;
      this.h.vars.bId = b.identifier;
      this.h.vars.scaleMultiplier = this.h.vars.lastScale;
      this.h.vars.distance = math.distance(a.pageX, a.pageY, b.pageX, b.pageY);
      startX = parseInt((b.pageX + a.pageX) / 2);
      startY = parseInt((b.pageY + a.pageY) / 2);
      elDims = this.h.vars.elDims = this.h.el.getBoundingClientRect();
      this.h.vars.pX = ((startX - elDims.left) / elDims.width) - 0.5;
      this.h.vars.pY = ((startY - elDims.top) / elDims.height) - 0.5;
      this.h.vars.width = elDims.width;
      this.h.vars.height = elDims.height;
      this.h.vars.startX = startX - this.h.vars.lastTranslateX;
      this.h.vars.startY = startY - this.h.vars.lastTranslateY;
      return null;
    },
    _prepareForMove: function(touch) {
      this.h.vars.mode = 0;
      this.h.vars.scaleMultiplier = this.h.vars.lastScale;
      this.h.vars.startX = touch.pageX - this.h.vars.lastTranslateX;
      this.h.vars.startY = touch.pageY - this.h.vars.lastTranslateY;
      return null;
    },
    move: function(e) {
      var a, b, distance, removeFromTranslateX, removeFromTranslateY, scale, translateX, translateY;

      if (this.h.vars.mode === 0) {
        a = e.touches[0];
        translateX = a.pageX - this.h.vars.startX;
        translateY = a.pageY - this.h.vars.startY;
        this.h.fire({
          scale: this.h.vars.scaleMultiplier,
          translateX: translateX,
          translateY: translateY
        });
        this.h.vars.lastTranslateX = translateX;
        this.h.vars.lastTranslateY = translateY;
        return;
      }
      a = e.touches[0];
      b = e.touches[1];
      distance = math.distance(a.pageX, a.pageY, b.pageX, b.pageY);
      scale = distance / this.h.vars.distance;
      removeFromTranslateX = (scale - 1) * this.h.vars.width * this.h.vars.pX;
      removeFromTranslateY = (scale - 1) * this.h.vars.height * this.h.vars.pY;
      translateX = parseInt((b.pageX + a.pageX) / 2) - this.h.vars.startX - removeFromTranslateX;
      translateY = parseInt((b.pageY + a.pageY) / 2) - this.h.vars.startY - removeFromTranslateY;
      scale *= this.h.vars.scaleMultiplier;
      this.h.fire({
        scale: scale,
        translateX: translateX,
        translateY: translateY
      });
      this.h.vars.lastTranslateX = translateX;
      this.h.vars.lastTranslateY = translateY;
      this.h.vars.lastScale = scale;
      return null;
    },
    end: function(e) {
      var a, b;

      if (e.touches.length === 0) {
        return;
      }
      if (this.h.vars.mode === 1) {
        if (e.touches.length === 1) {
          this._prepareForMove(this.h, e.touches[0]);
          return;
        }
        if (e.touches[0].identifier === this.h.vars.aId && e.touches[1].identifier === this.h.vars.bId) {
          return;
        }
        a = e.touches[0];
        b = e.touches[1];
        return this._prepareForTransform(this.h, a, b);
      }
    },
    start: function(e) {
      if (this.h.vars.mode === 1) {
        if (e.touches.length <= 2) {
          console.error('mode was 1, but touches.length is <= 2');
        }
        return;
      }
      if (e.touches.length === 1) {
        return;
      }
      return this._prepareForTransform(this.h, e.touches[0], e.touches[1]);
    }
  };
});

/*
//@ sourceMappingURL=transform.map
*/
