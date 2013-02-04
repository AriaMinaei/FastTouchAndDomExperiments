(function() {

  window.$ = function(id) {
    return document.getElementById(id);
  };

  window.$$ = function(selector) {
    return document.querySelectorAll(selector);
  };

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
      return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, el) {
        return window.setTimeout(callback, 16);
      };
    })();
  }

  window.DommyContainer = (function() {
    var DommyContainer;
    return DommyContainer = (function() {

      function DommyContainer(ns) {
        this.ns = ns != null ? ns : 'global-';
        this.nsLen = this.ns.length;
        this.last = 0;
        this.store = [{}];
        this.events = {};
      }

      DommyContainer.prototype.uid = function(el) {
        var id;
        id = el.id;
        if (id.length === 0) {
          id = el.id = this.ns + String(++this.last);
          this.store[this.last] = {};
        }
        return id;
      };

      DommyContainer.prototype.fastId = function(el) {
        var id;
        id = el.id;
        if (id.length === 0) {
          el.id = this.ns + String(++this.last);
          this.store[this.last] = {};
          return this.last;
        } else {
          return Number(id.substr(this.nsLen));
        }
      };

      DommyContainer.prototype.nUid = function(el) {
        var id;
        id = el.id;
        if (id.length === 0) {
          return null;
        }
        return id;
      };

      DommyContainer.prototype.nFastId = function(el) {
        var id;
        id = el.id;
        if (id.length === 0) {
          return null;
        }
        return Number(id.substr(this.nsLen));
      };

      DommyContainer.prototype._set = function(fastId, key, val) {
        this.store[fastId][key] = val;
        return this;
      };

      DommyContainer.prototype.set = function(el, key, val) {
        return this._set(this.fastId(el), key, val);
      };

      DommyContainer.prototype._get = function(fastId, key) {
        if (this.store[fastId]) {
          return this.store[fastId][key];
        }
      };

      DommyContainer.prototype.get = function(el, key) {
        return this._get(this.fastId(el), key);
      };

      DommyContainer.prototype._remove = function(fastId, key) {
        if (this.store[fastId]) {
          delete this.store[fastId][key];
        }
        return this;
      };

      DommyContainer.prototype.remove = function(el, key) {
        return this._remove(this.fastId(el), key);
      };

      DommyContainer.prototype._clean = function(fastId) {
        if (this.store[fastId]) {
          return this.store[fastId] = {};
        }
      };

      DommyContainer.prototype.clean = function(el) {
        return this.store[this.fastId(el)] = {};
      };

      DommyContainer.prototype.eliminate = function(el) {
        var sub, subQuickId, subs, _i, _len;
        this.clean(el);
        subs = el.getElementsByTagName('*');
        for (_i = 0, _len = subs.length; _i < _len; _i++) {
          sub = subs[_i];
          subQuickId = this.nFastId(sub);
          if (subQuickId) {
            this._clean(subQuickId);
          }
        }
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
        return this;
      };

      DommyContainer.prototype._getType = function(fastId, el) {
        var type;
        type = this._get(fastId, '_type');
        if (type !== void 0) {
          return type;
        }
        type = el.getAttribute('data-type');
        if (!type) {
          this._set(fastId, '_type', null);
          return null;
        }
        type = type.trim();
        this._set(fastId, '_type', type);
        return type;
      };

      DommyContainer.prototype.getType = function(el) {
        var fastId;
        fastId = this.nFastId(el);
        if (!fastId) {
          return null;
        }
        return this._getType(fastId, el);
      };

      DommyContainer.prototype.addEvent = function(type, eventName, listener) {
        var temp;
        if (!this.events[type]) {
          temp = {};
          temp[eventName] = [listener];
          this.events[type] = temp;
          return this;
        }
        if (!this.events[type][eventName]) {
          this.events[type][eventName] = [listener];
          return this;
        }
        this.events[type].push(listener);
        return this;
      };

      DommyContainer.prototype._getListeners = function(type, eventName) {
        var forName, forType;
        forType = this.events[type];
        if (!forType) {
          return [];
        }
        forName = this.events[type][eventName];
        if (!forName) {
          return [];
        }
        return forName;
      };

      DommyContainer.prototype.fireEvent = function(fastId, el, eventName, e) {
        var type;
        type = this._getType(fastId);
        this.getListener(fastId, el, eventName, e);
        return this;
      };

      DommyContainer.prototype.getListener = function(fastId, el, eventName) {
        var listeners, type;
        type = this._getType(fastId, el);
        if (!type) {
          return function() {};
        }
        listeners = this._getListeners(type, eventName);
        if (listeners.length === 0) {
          return function() {};
        }
        return function(e) {
          var listener, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = listeners.length; _i < _len; _i++) {
            listener = listeners[_i];
            _results.push(listener(e, fastId, el, type, eventName));
          }
          return _results;
        };
      };

      return DommyContainer;

    })();
  })();

  window.dommy = new DommyContainer();

}).call(this);
