
define(['gesture/definitions', 'native'], function(GestureDefinitions) {
  var GestureDefinitionsList, Handler, copyTouchEvent, copyTouchList;
  GestureDefinitionsList = GestureDefinitions.list;
  copyTouchList = function(list) {
    var copied, touch, _i, _len;
    copied = Array(0);
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      touch = list[_i];
      copied.push({
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
  Handler = (function() {

    function Handler(root, dommy) {
      this.root = root != null ? root : window.document;
      this.dommy = dommy != null ? dommy : window.dommy;
      this._reset();
      this.options = {
        real_move_distance: 16
      };
    }

    Handler.prototype._reset = function() {
      var _this = this;
      this._boundListeners = {
        start: this._touchstartListener.bind(this),
        end: this._touchendListener.bind(this),
        move: this._touchmoveListener.bind(this)
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
      this.vars = {};
      return this.forceFinish = function() {
        return _this.finish();
      };
    };

    Handler.prototype.listen = function() {
      this.root.addEventListener('touchstart', this._boundListeners.start);
      this.root.addEventListener('touchend', this._boundListeners.end);
      return this.root.addEventListener('touchmove', this._boundListeners.move);
    };

    Handler.prototype.quit = function() {
      this.root.removeEventListener('touchstart', this._boundListeners.start);
      this.root.removeEventListener('touchend', this._boundListeners.end);
      return this.root.removeEventListener('touchmove', this._boundListeners.move);
    };

    Handler.prototype._touchstartListener = function(e) {
      var first;
      e.stop();
      this.lastEvents.start = copyTouchEvent(e);
      this.lastEventType = 'start';
      this.starts++;
      first = false;
      if (!this.firstEvent) {
        first = true;
        this.firstEvent = copyTouchEvent(e);
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
        return this._shouldFinish();
      }
    };

    Handler.prototype._touchmoveListener = function(e) {
      var first, touch;
      e.stop();
      this.lastEvents.move = copyTouchEvent(e);
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

    Handler.prototype._getElGestures = function(fastId, el) {
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

    Handler.prototype._checkForType = function() {
      var g, gestureName, set, shouldBreak;
      if (this.candidates.length === 0) {
        return;
      }
      shouldBreak = false;
      while (this.candidates.length !== 0) {
        set = this.candidates[0];
        gestureName = set.gestureName;
        g = GestureDefinitionsList[gestureName];
        switch (g.check(this)) {
          case -1:
            this.candidates.shift();
            console.log('wasnt ' + gestureName);
            continue;
          case 0:
            shouldBreak = true;
            break;
          case 1:
            this.el = set.target;
            this.elFastId = set.fastId;
            this.gestureName = gestureName;
            this.gesture = g;
            this.gesture.init(this);
            console.groupEnd();
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

    Handler.prototype.fire = function(e) {
      if (!this.elEventListenerInitialized) {
        this.elEventListener = dommy.getListener(this.elFastId, this.el, this.gestureName);
        this.elEventListenerInitialized = true;
      }
      return this.elEventListener(e);
    };

    Handler.prototype.fireCustom = function(name, e) {
      if (this.elCustomEventListeners[name] === void 0) {
        this.elCustomEventListeners[name] = dommy.getListener(this.elFastId, this.el, name);
      }
      return this.elCustomEventListeners[name](e);
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
  return Handler;
});
