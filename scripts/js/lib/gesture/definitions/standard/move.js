var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define({
  name: 'move',
  check: function() {
    if (!this.h.hadRealMove) {
      if (this.h.starts === 1) {
        return 0;
      } else {
        return -1;
      }
    }
    return 1;
  },
  init: function(h) {
    return this._initFromEvent(this.h, this.h.lastEvents.move);
  },
  _initFromEvent: function(h, e) {
    this.h.vars.startX = e.touches[0].pageX;
    this.h.vars.startY = e.touches[0].pageY;
    this.h.vars.id = e.touches[0].identifier;
    return this.h.fire({
      translateX: 0,
      translateY: 0
    });
  },
  move: function(h, e) {
    return this.h.fire({
      translateX: e.touches[0].pageX - this.h.vars.startX,
      translateY: e.touches[0].pageY - this.h.vars.startY
    });
  },
  end: function(h, e) {
    if (e.touches.length === 0) {
      return;
    }
    if (e.changedTouches[0].identifier !== this.h.vars.id) {
      return;
    }
    this.h.vars.id = e.touches[0].identifier;
    this.h.vars.startX = e.touches[0].pageX - (e.changedTouches[0].pageX - this.h.vars.startX);
    return this.h.vars.startY = e.touches[0].pageY - (e.changedTouches[0].pageY - this.h.vars.startY);
  }
});

/*
//@ sourceMappingURL=move.map
*/
