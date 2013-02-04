(function() {
  var Gesture, GestureHandler, _getElGestures;

  _getElGestures = function(el) {
    var gestures;
    if (el.getAttribute) {
      gestures = el.getAttribute('data-gestures');
    }
    if (!gestures) {
      return null;
    }
    return gestures.split(',').map(function(g) {
      return g.trim();
    });
  };

  GestureHandler = (function() {

    function GestureHandler(root, dommy) {
      this.root = root;
      this.dommy = dommy != null ? dommy : window.dommy;
      this.reset();
      this.options = {
        real_move_distance: 10
      };
    }

    GestureHandler.prototype.reset = function() {
      this._touchmoveThrottle = {
        active: false,
        frame: requestAnimationFrame(function() {})
      };
      this._boundListeners = {
        start: this.touchstartListener.bind(this),
        end: this.touchendListener.bind(this),
        move: this.touchmoveListener.bind(this),
        handleMove: this.handleTouchmove.bind(this)
      };
      this._lastEvents = {
        start: null,
        move: null,
        end: null
      };
      this._firstEvent = null;
      this._lastEventType = null;
      this._starts = 0;
      this._hadRealMove = false;
      this._candidates = [];
      this.gesture = null;
      this.gestureName = '';
      this.el = null;
      this.elFastId = 0;
      this.elEventListener = function() {};
      this.elEventListenerInitialized = false;
      this._finishOnLastTouchEnd = true;
      return this.stuff = {};
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

    GestureHandler.prototype.touchstartListener = function(e) {
      e.stop();
      this._lastEvents.start = e;
      this._lastEventType = 'start';
      this._starts++;
      if (!this._firstEvent) {
        this._firstEvent = e;
        this.findTargets();
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

    GestureHandler.prototype.touchendListener = function(e) {
      e.stop();
      this._lastEventType = 'end';
      this._lastEvents.end = e;
      if (this.gesture) {
        this.gesture.end(this, e);
      } else {
        this._checkForType();
        if (this.gesture) {
          this.gesture.end(this, e);
        }
      }
      if (e.touches.length === 0 && this._finishOnLastTouchEnd) {
        return this.finish();
      }
    };

    GestureHandler.prototype.touchmoveListener = function(e) {
      e.stop();
      this._lastEvents.move = e;
      this._lastEventType = 'move';
      console.log('move', e.touches[0].screenX);
      if (!this._touchmoveThrottle.active) {
        this._touchmoveThrottle.frame = window.requestAnimationFrame(this._boundListeners.handleMove);
        return this._touchmoveThrottle.active = true;
      }
    };

    GestureHandler.prototype.handleTouchmove = function() {
      var first, touch, touches, _i, _len;
      this._touchmoveThrottle.active = false;
      if (!this._hadRealMove) {
        touches = this._lastEvents.move.touches;
        first = this._firstEvent.touches[0];
        console.log('checking for real move', 'last touches', touches, 'first', first);
        for (_i = 0, _len = touches.length; _i < _len; _i++) {
          touch = touches[_i];
          if (Math.abs(touch.screenX - first.screenX) >= this.options.real_move_distance || Math.abs(touch.screenY - first.screenY) >= this.options.real_move_distance) {
            this._hadRealMove = true;
            console.log('-- had real mvoe!');
            break;
          }
        }
      }
      if (this.gesture) {
        return this.gesture.move(this, this._lastEvents.move);
      } else {
        this._checkForType();
        if (this.gesture) {
          return this.gesture.move(this, this._lastEvents.move);
        }
      }
    };

    GestureHandler.prototype.finish = function() {
      if (this.gestureName) {
        console.log('finished with: ' + this.gestureName);
      }
      return this.reset();
    };

    GestureHandler.prototype.findTargets = function() {
      var gestureName, gestures, target, tempGests, _i, _len, _results;
      target = this._firstEvent.target;
      tempGests = {};
      _results = [];
      while (target != null) {
        gestures = _getElGestures(target);
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
            if (!Gesture[gestureName]) {
              console.error('Invalid gesture name \'' + gestureName + '\'');
            }
            this._candidates.push({
              gestureName: gestureName,
              target: target
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

    GestureHandler.prototype._checkForType = function() {
      var gestureName, set, shouldBreak;
      shouldBreak = false;
      while (this._candidates.length !== 0) {
        set = this._candidates[0];
        gestureName = set.gestureName;
        console.log('checking ' + this._candidates[0].gestureName);
        switch (Gesture[gestureName].check(this)) {
          case -1:
            this._candidates.shift();
            console.log('wasnt ' + gestureName);
            continue;
          case 0:
            shouldBreak = true;
            break;
          case 1:
            this.el = set.target;
            this.elFastId = this.dommy.fastId(this.el);
            this.gestureName = gestureName;
            this.gesture = Gesture[gestureName];
            this.gesture.init(this);
            return;
        }
        if (shouldBreak) {
          break;
        }
      }
      if (this._candidates.length !== 0) {
        return console.log('havent determined yet');
      }
    };

    GestureHandler.prototype.fire = function(e) {
      console.log('firing');
      if (!this.elEventListenerInitialized) {
        this.elEventListener = dommy.getListener(this.elFastId, this.el, this.gestureName);
        this.elEventListenerInitialized = true;
      }
      return this.elEventListener(e);
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
        init: function() {
          return console.log('Gesture "' + name + '" initialized');
        },
        start: function(h, e) {
          return console.log('Caught touchstart for "' + name + '"');
        },
        end: function(h, e) {
          return console.log('Caught touchend for "' + name + '"');
        },
        move: function(h, e) {
          return console.log('Caught touchmove for "' + name + '"');
        }
      };
      bare.name = name;
      bare = Object.append(bare, stuff);
      Gesture[name] = bare;
      bare;

    }

    return Gesture;

  })();

  new Gesture('tap', {
    tap_time: 300,
    check: function(h) {
      if (h._starts !== 1 || h._hadRealMove) {
        return -1;
      }
      if (h._lastEventType !== 'end') {
        return 0;
      }
      if (h._lastEvents.end.timeStamp - h._firstEvent.timeStamp > this.tap_time) {
        return -1;
      }
      return 1;
    },
    end: function(h, e) {
      return h.fire({});
    }
  });

  new Gesture('hold', {
    hold_time: 600,
    check: function(h) {
      if (h._starts !== 1 || h._hadRealMove) {
        return -1;
      }
      if (h._lastEventType !== 'end' || h._lastEvents.end.timeStamp - h._firstEvent.timeStamp < this.hold_time) {
        return 0;
      }
      return 1;
    },
    end: function(h, e) {
      return h.fire({});
    }
  });

  new Gesture('instantmove');

  new Gesture('transform');

  new Gesture('move');

  this.GestureHandler = GestureHandler;

}).call(this);
