define(function() {
  var func;

  return func = {
    throttle: function(func, time) {
      var lastCalled;

      if (time == null) {
        time = 1000;
      }
      lastCalled = 0;
      return function() {
        var now;

        now = Date.now();
        if (now - lastCalled < time) {
          return;
        }
        lastCalled = now;
        return func.apply(null, arguments);
      };
    }
  };
});

/*
//@ sourceMappingURL=func.map
*/
