var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['./definitions', './tools', 'utility/belt'], function(GestureDefinitions, TouchTools, belt) {
  var GestureDefinitionsList, Handler, emptyFunction;

  emptyFunction = function() {};
  Handler = (function() {
    function Handler(root, dommy) {
      var _this = this;

      this.root = root != null ? root : window.document;
      this.dommy = dommy != null ? dommy : window.dommy;
      this._boundListeners = {
        start: this._touchstartListener.bind(this),
        end: this._touchendListener.bind(this),
        move: this._touchmoveListener.bind(this),
        cancel: this._touchcancelListener.bind(this)
      };
      this.lastEvents = {};
      this._candidates = [];
      this._elCustomEventListeners = {};
      this.vars = {};
      this.options = {
        real_move_distance: 16
      };
      this._touchEventPool = new TouchTools.TouchEventPool(4, 3);
      this.forceFinish = function() {
        return _this.finish();
      };
      this._reset();
    }

    Handler.prototype._reset = function() {
      this.lastEvents.start = null;
      this.lastEvents.move = null;
      this.lastEvents.end = null;
      this.lastEvents.cancel = null;
      this.firstEvent = null;
      this.lastEventType = null;
      this.starts = 0;
      this.hadRealMove = false;
      this._candidates.length = 0;
      this.gesture = null;
      this.gestureName = '';
      this.el = null;
      this.elFastId = 0;
      this._elEventListener = emptyFunction;
      this._elEventListenerInitialized = false;
      belt.empty(this._elCustomEventListeners);
      belt.empty(this.vars);
      return null;
    };

    Handler.prototype._copyTouchEvent = function(e) {
      return this._touchEventPool.copy(e);
    };

    Handler.prototype.listen = function() {
      this.root.addEventListener('touchstart', this._boundListeners.start);
      this.root.addEventListener('touchend', this._boundListeners.end);
      this.root.addEventListener('touchmove', this._boundListeners.move);
      return this.root.addEventListener('touchcancel', this._boundListeners.cancel);
    };

    Handler.prototype.quit = function() {
      this.root.removeEventListener('touchstart', this._boundListeners.start);
      this.root.removeEventListener('touchend', this._boundListeners.end);
      this.root.removeEventListener('touchmove', this._boundListeners.move);
      return this.root.removeEventListener('touchcancel', this._boundListeners.cancel);
    };

    Handler.prototype._touchstartListener = function(e) {
      var first;

      e.stopPropagation();
      e.preventDefault();
      this.lastEvents.start = this._copyTouchEvent(e);
      this.lastEventType = 'start';
      this.starts++;
      first = false;
      if (!this.firstEvent) {
        first = true;
        this.firstEvent = this._copyTouchEvent(e);
        this._findCandidates();
      }
      if (this.gesture) {
        return this.gesture.start(this, e, first);
      } else {
        this._checkForType();
        if (this.gesture) {
          return this.gesture.start(this, e, first);
        }
      }
    };

    Handler.prototype._touchendListener = function(e) {
      e.stopPropagation();
      e.preventDefault();
      this.lastEventType = 'end';
      this.lastEvents.end = this._copyTouchEvent(e);
      if (this.gesture) {
        this.gesture.end(this, e);
      } else {
        this._checkForType();
        if (this.gesture) {
          this.gesture.end(this, e);
        }
      }
      if (e.touches.length === 0) {
        return this._shouldFinish();
      }
    };

    Handler.prototype._touchcancelListener = function(e) {
      e.stopPropagation();
      e.preventDefault();
      this.lastEventType = 'cancel';
      this.lastEvents.cancel = this._copyTouchEvent(e);
      if (this.gesture) {
        this.gesture.cancel(this, e);
      }
      if (e.touches.length === 0) {
        return this._shouldFinish();
      }
    };

    Handler.prototype._touchmoveListener = function(e) {
      var first, touch;

      e.stopPropagation();
      e.preventDefault();
      this.lastEvents.move = this._copyTouchEvent(e);
      this.lastEventType = 'move';
      if (!this.hadRealMove) {
        touch = this.lastEvents.move.touches[0];
        first = this.firstEvent.touches[0];
        if (Math.abs(touch.screenX - first.screenX) >= this.options.real_move_distance || Math.abs(touch.screenY - first.screenY) >= this.options.real_move_distance) {
          this.hadRealMove = true;
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

    Handler.prototype._shouldFinish = function() {
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

    Handler.prototype.finish = function() {
      if (this.gesture) {
        this.gesture.finish(this);
      }
      return this._reset();
    };

    Handler.prototype._findCandidates = function() {
      var gestureName, gestures, id, target, tempGests, _i, _len, _results;

      target = this.firstEvent.target;
      tempGests = {};
      _results = [];
      while (target != null) {
        id = this.dommy.id(target);
        gestures = this._getElGestures(id, target);
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
            this._candidates.push({
              gestureName: gestureName,
              target: target,
              id: id
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

    Handler.prototype._getElGestures = function(id, el) {
      var gestures;

      gestures = this.dommy.get(id, 'gestures');
      if (gestures !== void 0) {
        return gestures;
      }
      if (el.getAttribute) {
        gestures = el.getAttribute('data-gestures');
      }
      if (!gestures) {
        this.dommy.set(id, 'gestures', null);
        return null;
      }
      gestures = gestures.split(',').map(function(g) {
        return g.trim();
      });
      this.dommy.set(id, 'gestures', gestures);
      return gestures;
    };

    Handler.prototype._checkForType = function() {
      var g, gestureName, set, shouldBreak;

      if (this._candidates.length === 0) {
        return;
      }
      shouldBreak = false;
      while (this._candidates.length !== 0) {
        set = this._candidates[0];
        gestureName = set.gestureName;
        g = GestureDefinitionsList[gestureName];
        switch (g.check(this)) {
          case -1:
            this._candidates.shift();
            continue;
          case 0:
            shouldBreak = true;
            break;
          case 1:
            this.el = set.target;
            this.elFastId = set.id;
            this.gestureName = gestureName;
            this.gesture = g;
            this.gesture.init(this);
            return;
        }
        if (shouldBreak) {
          break;
        }
      }
    };

    Handler.prototype.fire = function(e) {
      if (!this._elEventListenerInitialized) {
        this._elEventListener = dommy.getListener(this.elFastId, this.el, this.gestureName);
        this._elEventListenerInitialized = true;
      }
      return this._elEventListener(e);
    };

    Handler.prototype.fireCustom = function(name, e) {
      if (this._elCustomEventListeners[name] === void 0) {
        this._elCustomEventListeners[name] = dommy.getListener(this.elFastId, this.el, name);
      }
      return this._elCustomEventListeners[name](e);
    };

    Handler.prototype.isTouchInsideElement = function(touch) {
      var target;

      target = touch.target;
      while (target != null) {
        if (target === this.el) {
          return true;
        }
        if (target === this.root) {
          break;
        }
        target = target.parentNode;
      }
      return false;
    };

    Handler.prototype.restartFromEvent = function(e) {
      this.finish();
      return this._touchstartListener(e);
    };

    return Handler;

  })();
  Handler.create = function(root, dommy) {
    var h;

    if (root == null) {
      root = window.document;
    }
    if (dommy == null) {
      dommy = window.dommy;
    }
    h = new Handler(root, dommy);
    h.listen();
    return h;
  };
  GestureDefinitionsList = GestureDefinitions.list;
  return Handler;
});

/*
//@ sourceMappingURL=handler.map
*/
