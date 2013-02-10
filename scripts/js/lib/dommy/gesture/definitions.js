(function() {
  var Definition, Gesture, define,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (!this.Dommy || !this.Dommy.Gesture) {
    throw Error("Gesture object isn't initialized");
  }

  Gesture = this.Dommy.Gesture;

  define = Gesture.define;

  Definition = Gesture.Definition;

  define('tap', (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.tap_time = 250;

    _Class.prototype.check = function() {
      if (this.handler.starts !== 1 || this.handler.hadRealMove) {
        return -1;
      }
      if (this.handler.lastEventType !== 'end') {
        return 0;
      }
      if (this.handler.lastEvents.end.timeStamp - this.handler.firstEvent.timeStamp > this.tap_time) {
        return -1;
      }
      return 1;
    };

    _Class.prototype.end = function(e) {
      return this.handler.fire({});
    };

    return _Class;

  })(Definition));

  define('hold', (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.hold_time = 250;

    _Class.prototype.check = function() {
      if (this.handler.starts !== 1 || this.handler.hadRealMove) {
        return -1;
      }
      if (this.handler.lastEventType !== 'end' || this.handler.lastEvents.end.timeStamp - this.handler.firstEvent.timeStamp < this.hold_time) {
        return 0;
      }
      return 1;
    };

    _Class.prototype.end = function(e) {
      return this.handler.fire({});
    };

    return _Class;

  })(Definition));

  define('instantmove', (function() {

    function _Class(handler, dommy) {
      this.handler = handler;
      this.dommy = dommy;
      this.reset();
    }

    _Class.prototype.reset = function() {};

    _Class.prototype.check = function() {
      return 1;
    };

    _Class.prototype.move = function(e) {
      return this.handler.fire({
        translateX: e.touches[0].screenX - this.handler.firstEvent.touches[0].screenX,
        translateY: e.touches[0].screenY - this.handler.firstEvent.touches[0].screenY
      });
    };

    _Class.prototype.finish = function() {
      return this.handler.fireCustom('instantmove-end', {});
    };

    _Class.prototype.start = function(e) {};

    _Class.prototype.end = function(e) {};

    _Class.prototype.shouldFinish = function() {
      return true;
    };

    _Class.prototype.init = function() {};

    return _Class;

  })());

  define('transform', (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    return _Class;

  })(Definition));

  define('move', (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    return _Class;

  })(Definition));

}).call(this);
