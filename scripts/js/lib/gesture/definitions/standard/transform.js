var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  return function(defineGesture) {
    defineGesture({
      name: 'transform',
      check: function(h) {
        if (h.lastEvents[h.lastEventType].touches.length > 1) {
          return 1;
        }
        if (h.hadRealMove && h.starts === 1) {
          return -1;
        }
        return 0;
      },
      init: function(h) {
        var last;

        last = h.lastEvents[h.lastEventType];
        h.vars.lastTranslateX = 0;
        h.vars.lastTranslateY = 0;
        h.vars.lastScale = 1;
        this._prepareForTransform(h, last.touches[0], last.touches[1]);
        return null;
      },
      _prepareForTransform: function(h, a, b) {
        var elDims, startX, startY;

        h.vars.mode = 1;
        h.vars.aId = a.identifier;
        h.vars.bId = b.identifier;
        h.vars.scaleMultiplier = h.vars.lastScale;
        h.vars.distance = Math.distance(a.pageX, a.pageY, b.pageX, b.pageY);
        startX = parseInt((b.pageX + a.pageX) / 2);
        startY = parseInt((b.pageY + a.pageY) / 2);
        elDims = h.vars.elDims = h.el.getBoundingClientRect();
        h.vars.pX = ((startX - elDims.left) / elDims.width) - 0.5;
        h.vars.pY = ((startY - elDims.top) / elDims.height) - 0.5;
        h.vars.width = elDims.width;
        h.vars.height = elDims.height;
        h.vars.startX = startX - h.vars.lastTranslateX;
        h.vars.startY = startY - h.vars.lastTranslateY;
        return null;
      },
      _prepareForMove: function(h, touch) {
        h.vars.mode = 0;
        h.vars.scaleMultiplier = h.vars.lastScale;
        h.vars.startX = touch.pageX - h.vars.lastTranslateX;
        h.vars.startY = touch.pageY - h.vars.lastTranslateY;
        return null;
      },
      move: function(h, e) {
        var a, b, distance, removeFromTranslateX, removeFromTranslateY, scale, translateX, translateY;

        if (h.vars.mode === 0) {
          a = e.touches[0];
          translateX = a.pageX - h.vars.startX;
          translateY = a.pageY - h.vars.startY;
          h.fire({
            scale: h.vars.scaleMultiplier,
            translateX: translateX,
            translateY: translateY
          });
          h.vars.lastTranslateX = translateX;
          h.vars.lastTranslateY = translateY;
          return;
        }
        a = e.touches[0];
        b = e.touches[1];
        distance = Math.distance(a.pageX, a.pageY, b.pageX, b.pageY);
        scale = distance / h.vars.distance;
        removeFromTranslateX = (scale - 1) * h.vars.width * h.vars.pX;
        removeFromTranslateY = (scale - 1) * h.vars.height * h.vars.pY;
        translateX = parseInt((b.pageX + a.pageX) / 2) - h.vars.startX - removeFromTranslateX;
        translateY = parseInt((b.pageY + a.pageY) / 2) - h.vars.startY - removeFromTranslateY;
        scale *= h.vars.scaleMultiplier;
        h.fire({
          scale: scale,
          translateX: translateX,
          translateY: translateY
        });
        h.vars.lastTranslateX = translateX;
        h.vars.lastTranslateY = translateY;
        h.vars.lastScale = scale;
        return null;
      },
      end: function(h, e) {
        var a, b;

        if (e.touches.length === 0) {
          return;
        }
        if (h.vars.mode === 1) {
          if (e.touches.length === 1) {
            this._prepareForMove(h, e.touches[0]);
            return;
          }
          if (e.touches[0].identifier === h.vars.aId && e.touches[1].identifier === h.vars.bId) {
            return;
          }
          a = e.touches[0];
          b = e.touches[1];
          return this._prepareForTransform(h, a, b);
        }
      },
      start: function(h, e) {
        if (h.vars.mode === 1) {
          if (e.touches.length <= 2) {
            console.error('mode was 1, but touches.length is <= 2');
          }
          return;
        }
        if (e.touches.length === 1) {
          return;
        }
        return this._prepareForTransform(h, e.touches[0], e.touches[1]);
      }
    });
    return defineGesture({
      name: 'transform-instant',
      "extends": 'transform',
      check: function(h) {
        return 1;
      },
      init: function(h) {
        var last;

        last = h.lastEvents[h.lastEventType];
        h.vars.lastTranslateX = 0;
        h.vars.lastTranslateY = 0;
        h.vars.lastScale = 1;
        if (last.touches.length === 1) {
          return this._prepareForMove(h, last.touches[0]);
        } else {
          return this._prepareForTransform(h, last.touches[0], last.touches[1]);
        }
      }
    });
  };
});

/*
//@ sourceMappingURL=transform.map
*/
