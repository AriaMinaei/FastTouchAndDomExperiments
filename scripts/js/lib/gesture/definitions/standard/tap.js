var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  return function(defineGesture) {
    return defineGesture({
      name: 'tap',
      tap_time: 250,
      check: function(h) {
        if (h.starts !== 1 || h.hadRealMove) {
          return -1;
        }
        if (h.lastEventType !== 'end') {
          return 0;
        }
        if (h.lastEvents.end.timeStamp - h.firstEvent.timeStamp > this.tap_time) {
          return -1;
        }
        return 1;
      },
      end: function(h, e) {
        return h.fire({});
      }
    });
  };
});

/*
//@ sourceMappingURL=tap.map
*/
