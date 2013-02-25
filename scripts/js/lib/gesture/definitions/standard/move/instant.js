
define(function() {
  return function(defineGesture) {
    return defineGesture({
      name: 'instant-move',
      "extends": 'move',
      check: function(h) {
        return 1;
      },
      init: function(h) {
        return this._initOnEvent(h.lastEvents[h.lastEventType]);
      }
    });
  };
});
