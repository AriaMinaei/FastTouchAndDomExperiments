
define(function() {
  var A;
  return function(defineGesture) {
    return defineGesture({
      name: 'move-persistent',
      "extends": 'move',
      init: function(h) {
        h.vars.shouldInitAgain = false;
        return this.constructor.__super__.init.apply(this, arguments);
      },
      shouldFinish: function() {
        return false;
      },
      start: function(h, e) {
        if (e.touches.length === 1 && h.vars.shouldInitAgain) {
          return this._initOnEvent(h, e);
        }
      },
      end: function(h, e) {
        if (e.touches.length === 0) {
          h.vars.shouldInitAgain = true;
          h.fireCustom(this.name + ':end', {
            finish: h.forceFinish
          });
        }
        return this.constructor.__super__.end.apply(this, arguments);
      }
    });
  };
  return A = (function() {

    function A() {}

    A.prototype.ft = function() {
      return A.__super__.ft.apply(this, arguments);
    };

    return A;

  })();
});
