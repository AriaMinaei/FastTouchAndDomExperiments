var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  return function(defineGesture) {
    return defineGesture({
      name: 'move-persistent',
      "extends": 'move',
      init: function(h) {
        return this.constructor.__super__.init.apply(this, arguments);
      },
      shouldFinish: function() {
        return false;
      },
      start: function(h, e, isFirst) {
        if (e.touches.length === 1 && !isFirst) {
          if (h.isTouchInsideElement(e.touches[0])) {
            return this._initFromEvent(h, e);
          } else {
            return h.restartFromEvent(e);
          }
        } else {
          return this.constructor.__super__.start.apply(this, arguments);
        }
      },
      end: function(h, e) {
        if (e.touches.length === 0) {
          h.fireCustom(this.name + ':release', {
            finish: h.forceFinish
          });
        }
        return this.constructor.__super__.end.apply(this, arguments);
      }
    });
  };
});

/*
//@ sourceMappingURL=persistent.map
*/
