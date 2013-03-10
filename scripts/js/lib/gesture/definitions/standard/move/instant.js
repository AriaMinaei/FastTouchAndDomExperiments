
define(function() {
  return function(defineGesture) {
    return defineGesture({
      name: 'move-instant',
      "extends": 'move',
      check: function(h) {
        return 1;
      },
      init: function(h) {
        return this._initFromEvent(h.lastEvents[h.lastEventType]);
      }
    });
  };
});
