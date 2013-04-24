var define,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['../utility/pool/fixed'], function(FixedPool) {
  var TouchPool, TouchTools, copyTouchList, _ref;

  TouchTools = {};
  TouchPool = (function(_super) {
    __extends(TouchPool, _super);

    function TouchPool() {
      _ref = TouchPool.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TouchPool.prototype._create = function() {
      return {
        pageX: 0,
        pageY: 0,
        screenX: 0,
        screenY: 0,
        identifier: 0
      };
    };

    TouchPool.prototype._reset = function(item) {
      return item;
    };

    return TouchPool;

  })(FixedPool);
  TouchTools.TouchEventPool = (function(_super) {
    __extends(TouchEventPool, _super);

    function TouchEventPool(size, listSize) {
      if (size == null) {
        size = 4;
      }
      if (listSize == null) {
        listSize = 3;
      }
      this._touchPool = new TouchPool(listSize * size);
      TouchEventPool.__super__.constructor.call(this, size);
    }

    TouchEventPool.prototype._create = function() {
      return {
        target: null,
        timeStamp: 0,
        touches: [],
        changedTouches: []
      };
    };

    TouchEventPool.prototype._reset = function(item) {
      item.touches.length = 0;
      item.changedTouches.length = 0;
      return item;
    };

    TouchEventPool.prototype.copy = function(e) {
      var copied;

      copied = this.get();
      copied.target = e.target;
      copied.timeStamp = e.timeStamp;
      copied.touches = copyTouchList(e.touches);
      copied.changedTouches = copyTouchList(e.changedTouches);
      return copied;
    };

    TouchEventPool.prototype.copyTouchListInto = function(list, into) {
      var one, touch, _i, _len;

      for (_i = 0, _len = list.length; _i < _len; _i++) {
        touch = list[_i];
        one = this._touchPool.get();
        one.pageX = touch.pageX;
        one.pageY = touch.pageY;
        one.screenX = touch.screenX;
        one.screenY = touch.screenY;
        one.identifier = touch.identifier;
        into.push(one);
      }
      return into;
    };

    return TouchEventPool;

  })(FixedPool);
  copyTouchList = function(list) {
    var copied, touch, _i, _len;

    copied = [];
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
  TouchTools.copyTouchEvent = function(e) {
    var copied;

    copied = {
      target: e.target,
      timeStamp: e.timeStamp,
      touches: copyTouchList(e.touches),
      changedTouches: copyTouchList(e.changedTouches)
    };
    return copied;
  };
  return TouchTools;
});

/*
//@ sourceMappingURL=tools.map
*/
