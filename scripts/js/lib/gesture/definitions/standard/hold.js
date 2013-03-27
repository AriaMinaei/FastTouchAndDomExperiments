var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  return function(defineGesture) {
    return defineGesture({
      name: 'hold',
      hold_time: 250,
      check: function(h) {
        if (h.starts !== 1 || h.hadRealMove) {
          return -1;
        }
        if (h.lastEventType !== 'end' || h.lastEvents.end.timeStamp - h.firstEvent.timeStamp < this.hold_time) {
          return 0;
        }
        return 1;
      },
      end: function(h, e) {
        return h.fire({});
      }
    });
  };
});
