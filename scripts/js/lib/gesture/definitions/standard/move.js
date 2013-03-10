
define(['./move/instant', './move/persistent'], function(setupInstant, setupPersistent) {
  return function(defineGesture) {
    defineGesture({
      name: 'move',
      check: function(h) {
        if (!h.hadRealMove) {
          if (h.starts === 1) {
            return 0;
          } else {
            return -1;
          }
        }
        return 1;
      },
      init: function(h) {
        return this._initFromEvent(h, h.lastEvents.move);
      },
      _initFromEvent: function(h, e) {
        h.vars.startX = e.touches[0].pageX;
        h.vars.startY = e.touches[0].pageY;
        h.vars.id = e.touches[0].identifier;
        return h.fire({
          translateX: 0,
          translateY: 0
        });
      },
      move: function(h, e) {
        return h.fire({
          translateX: e.touches[0].pageX - h.vars.startX,
          translateY: e.touches[0].pageY - h.vars.startY
        });
      },
      end: function(h, e) {
        if (e.touches.length === 0) {
          return;
        }
        if (e.changedTouches[0].identifier !== h.vars.id) {
          return;
        }
        h.vars.id = e.touches[0].identifier;
        h.vars.startX = e.touches[0].pageX - (e.changedTouches[0].pageX - h.vars.startX);
        return h.vars.startY = e.touches[0].pageY - (e.changedTouches[0].pageY - h.vars.startY);
      }
    });
    setupInstant(defineGesture);
    return setupPersistent(defineGesture);
  };
});
