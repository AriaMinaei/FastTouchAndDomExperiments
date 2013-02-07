(function() {
  var Gesture, GestureHandler, copyTouchEvent, copyTouchList;

  copyTouchList = function(list) {
    var copied, touch, _i, _len;
    copied = Array(0);
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      touch = list[_i];
      copied.push({
        clientX: touch.clientX,
        clientY: touch.clientY,
        pageX: touch.pageX,
        pageY: touch.pageY,
        screenX: touch.screenX,
        screenY: touch.screenY,
        identifier: touch.identifier
      });
    }
    return copied;
  };

  copyTouchEvent = function(e) {
    var copied;
    copied = {
      target: e.target,
      timeStamp: e.timeStamp,
      touches: copyTouchList(e.touches),
      changedTouches: copyTouchList(e.changedTouches),
      scale: e.scale,
      rotation: e.rotation
    };
    return copied;
  };

  GestureHandler = (function() {

    function GestureHandler(root, dommy) {
      this.root = root;
      this.dommy = dommy != null ? dommy : window.dommy;
      this._reset();
      this.options = {
        real_move_distance: 10
      };
    }

    GestureHandler.prototype._reset = function() {
      this._touchmoveThrottle = {
        active: false,
        frame: requestAnimationFrame(function() {})
      };
      this._boundListeners = {
        start: this._touchstartListener.bind(this),
        end: this._touchendListener.bind(this),
        move: this._touchmoveListener.bind(this),
        handleMove: this._handleTouchmove.bind(this)
      };
      this.lastEvents = {
        start: null,
        move: null,
        end: null
      };
      this.firstEvent = null;
      this.lastEventType = null;
      this.starts = 0;
      this.hadRealMove = false;
      this.candidates = [];
      this.gesture = null;
      this.gestureName = '';
      this.el = null;
      this.elFastId = 0;
      this.elEventListener = function() {};
      this.elEventListenerInitialized = false;
      this.elCustomEventListeners = {};
      return this.gestureVars = {};
    };

    GestureHandler.prototype.listen = function() {
      this.root.addEventListener('touchstart', this._boundListeners.start);
      this.root.addEventListener('touchend', this._boundListeners.end);
      this.root.addEventListener('touchmove', this._boundListeners.move);
      return this;
    };

    GestureHandler.prototype.quit = function() {
      this.root.removeEventListener('touchstart', this._boundListeners.start);
      this.root.removeEventListener('touchend', this._boundListeners.end);
      this.root.removeEventListener('touchmove', this._boundListeners.move);
      return this;
    };

    GestureHandler.prototype._touchstartListener = function(e) {
      e.stop();
      this.lastEvents.start = copyTouchEvent(e);
      this.lastEventType = 'start';
      this.starts++;
      if (!this.firstEvent) {
        this.firstEvent = copyTouchEvent(e);
        this._findCandidates();
      }
      if (this.gesture) {
        return this.gesture.start(this, e);
      } else {
        this._checkForType();
        if (this.gesture) {
          return this.gesture.start(this, e);
        }
      }
    };

    GestureHandler.prototype._touchendListener = function(e) {
      e.stop();
      this.lastEventType = 'end';
      this.lastEvents.end = copyTouchEvent(e);
      if (this.gesture) {
        this.gesture.end(this, e);
      } else {
        this._checkForType();
        if (this.gesture) {
          this.gesture.end(this, e);
        }
      }
      if (e.touches.length === 0) {
        return this.shouldFinish();
      }
    };

    GestureHandler.prototype._touchmoveListener = function(e) {
      e.stop();
      this.lastEvents.move = copyTouchEvent(e);
      this.lastEventType = 'move';
      if (!this._touchmoveThrottle.active) {
        this._touchmoveThrottle.frame = window.requestAnimationFrame(this._boundListeners.handleMove);
        return this._touchmoveThrottle.active = true;
      }
    };

    GestureHandler.prototype._handleTouchmove = function() {
      var first, touch, touches, _i, _len;
      this._touchmoveThrottle.active = false;
      if (!this.hadRealMove) {
        touches = this.lastEvents.move.touches;
        first = this.firstEvent.touches[0];
        for (_i = 0, _len = touches.length; _i < _len; _i++) {
          touch = touches[_i];
          if (Math.abs(touch.screenX - first.screenX) >= this.options.real_move_distance || Math.abs(touch.screenY - first.screenY) >= this.options.real_move_distance) {
            this.hadRealMove = true;
            break;
          }
        }
      }
      if (this.gesture) {
        return this.gesture.move(this, this.lastEvents.move);
      } else {
        this._checkForType();
        if (this.gesture) {
          return this.gesture.move(this, this.lastEvents.move);
        }
      }
    };

    GestureHandler.prototype.shouldFinish = function() {
      var shouldFinish;
      shouldFinish = true;
      if (this.gesture) {
        shouldFinish = this.gesture.shouldFinish(this);
      }
      if (!shouldFinish) {
        return;
      }
      return this.finish();
    };

    GestureHandler.prototype.finish = function() {
      if (this.gesture) {
        this.gesture.finish(this);
      }
      return this._reset();
    };

    GestureHandler.prototype._findCandidates = function() {
      var fastId, gestureName, gestures, target, tempGests, _i, _len, _results;
      target = this.firstEvent.target;
      tempGests = {};
      _results = [];
      while (target != null) {
        fastId = this.dommy.fastId(target);
        gestures = this._getElGestures(fastId, target);
        if (!gestures) {
          if (target === this.root) {
            break;
          }
          target = target.parentNode;
          continue;
        }
        for (_i = 0, _len = gestures.length; _i < _len; _i++) {
          gestureName = gestures[_i];
          if (!tempGests[gestureName]) {
            this.candidates.push({
              gestureName: gestureName,
              target: target,
              fastId: fastId
            });
          }
          tempGests[gestureName] = true;
        }
        if (target === this.root) {
          break;
        }
        _results.push(target = target.parentNode);
      }
      return _results;
    };

    GestureHandler.prototype._getElGestures = function(fastId, el) {
      var gestures;
      gestures = this.dommy._get(fastId, 'gestures');
      if (gestures !== void 0) {
        return gestures;
      }
      if (el.getAttribute) {
        gestures = el.getAttribute('data-gestures');
      }
      if (!gestures) {
        this.dommy._set(fastId, 'gestures', null);
        return null;
      }
      gestures = gestures.split(',').map(function(g) {
        return g.trim();
      });
      this.dommy._set(fastId, 'gestures', gestures);
      return gestures;
    };

    GestureHandler.prototype._checkForType = function() {
      var gestureName, set, shouldBreak;
      if (this.candidates.length === 0) {
        return;
      }
      shouldBreak = false;
      while (this.candidates.length !== 0) {
        set = this.candidates[0];
        gestureName = set.gestureName;
        switch (Gesture[gestureName].check(this)) {
          case -1:
            this.candidates.shift();
            continue;
          case 0:
            shouldBreak = true;
            break;
          case 1:
            this.el = set.target;
            this.elFastId = set.fastId;
            this.gestureName = gestureName;
            this.gesture = Gesture[gestureName];
            this.gesture.init(this);
            return;
        }
        if (shouldBreak) {
          break;
        }
      }
      if (this.candidates.length !== 0) {

      } else {

      }
    };

    GestureHandler.prototype.fire = function(e) {
      if (!this.elEventListenerInitialized) {
        this.elEventListener = dommy.getListener(this.elFastId, this.el, this.gestureName);
        this.elEventListenerInitialized = true;
      }
      return this.elEventListener(e);
    };

    GestureHandler.prototype.fireCustom = function(name, e) {
      if (this.elCustomEventListeners[name] === void 0) {
        this.elCustomEventListeners[name] = dommy.getListener(this.elFastId, this.el, name);
      }
      return this.elCustomEventListeners[name](e);
    };

    return GestureHandler;

  })();

  Gesture = (function() {

    function Gesture(name, stuff) {
      var bare;
      if (stuff == null) {
        stuff = {};
      }
      bare = {
        check: function(h) {
          return -1;
        },
        init: function() {},
        start: function(h, e) {},
        end: function(h, e) {},
        move: function(h, e) {},
        shouldFinish: function(h) {
          return true;
        },
        finish: function(h) {}
      };
      bare.name = name;
      bare = Object.append(bare, stuff);
      Gesture[name] = bare;
      bare;

    }

    return Gesture;

  })();

  new Gesture('tap', {
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

  new Gesture('hold', {
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

  new Gesture('instantmove', {
    check: function(h) {
      return 1;
    },
    move: function(h, e) {
      return h.fire({
        translateX: e.touches[0].screenX - h.firstEvent.touches[0].screenX,
        translateY: e.touches[0].screenY - h.firstEvent.touches[0].screenY
      });
    },
    finish: function(h) {
      return h.fireCustom('instantmove-end', {});
    }
  });

  new Gesture('transform');

  new Gesture('move');

  this.GestureHandler = GestureHandler;

}).call(this);
