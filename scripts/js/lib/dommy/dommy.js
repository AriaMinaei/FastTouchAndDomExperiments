var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['dommy/styles'], function(DommyStyles) {
  var Dommy;

  return Dommy = (function() {
    function Dommy(ns, dambo) {
      this.ns = ns != null ? ns : 'global-';
      if (typeof dambo === 'object') {
        this.dambo = dambo;
      } else if (typeof window.dambo === 'object') {
        this.dambo = window.dambo;
      } else {
        throw Error("Can't have a dommy without a dambo.");
      }
      this.ns = String(this.ns);
      this.nsLen = this.ns.length;
      this.last = 0;
      this.store = [{}];
      this.styles = new DommyStyles(this);
      this.lazies = {};
    }

    Dommy.prototype.uid = function(el) {
      var id;

      id = String(el.id);
      if (id.length === 0) {
        id = el.id = this.ns + String(++this.last);
        this.store[this.last] = {
          _el: el
        };
      }
      return id;
    };

    Dommy.prototype.fastId = function(el) {
      var id;

      id = String(el.id);
      if (id.length === 0) {
        el.id = this.ns + String(++this.last);
        this.store[this.last] = {
          _el: el
        };
        return this.last;
      } else {
        return Number(id.substr(this.nsLen));
      }
    };

    Dommy.prototype.nUid = function(el) {
      var id;

      id = String(el.id);
      if (id.length === 0) {
        return null;
      }
      return id;
    };

    Dommy.prototype.nFastId = function(el) {
      var id;

      id = String(el.id);
      if (id.length === 0) {
        return null;
      }
      return Number(id.substr(this.nsLen));
    };

    Dommy.prototype.el = function(fastId) {
      return this._get(fastId, '_el');
    };

    Dommy.prototype._set = function(fastId, key, val) {
      if (!this.store[fastId]) {
        this.store[fastId] = {};
      }
      this.store[fastId][key] = val;
      return this;
    };

    Dommy.prototype.set = function(el, key, val) {
      return this._set(this.fastId(el), key, val);
    };

    Dommy.prototype._get = function(fastId, key) {
      if (this.store[fastId]) {
        return this.store[fastId][key];
      }
    };

    Dommy.prototype.get = function(el, key) {
      return this._get(this.fastId(el), key);
    };

    Dommy.prototype._remove = function(fastId, key) {
      if (this.store[fastId]) {
        delete this.store[fastId][key];
      }
      return this;
    };

    Dommy.prototype.remove = function(el, key) {
      return this._remove(this.fastId(el), key);
    };

    Dommy.prototype._clean = function(fastId) {
      if (this.store[fastId]) {
        return this.store[fastId] = {};
      }
    };

    Dommy.prototype.clean = function(el) {
      return this.store[this.fastId(el)] = {};
    };

    Dommy.prototype.eliminate = function(el) {
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

    Dommy.prototype._getTypes = function(fastId, el) {
      var types;

      types = this._get(fastId, '_types');
      if (types !== void 0) {
        return types;
      }
      types = el.getAttribute('data-types');
      if (!types) {
        this._set(fastId, '_types', null);
        return null;
      }
      types = types.split(',').map(function(s) {
        return s.trim();
      });
      this._set(fastId, '_types', types);
      return types;
    };

    Dommy.prototype.getTypes = function(el) {
      var fastId;

      fastId = this.nFastId(el);
      if (!fastId) {
        return null;
      }
      return this._getTypes(fastId, el);
    };

    Dommy.prototype.getListener = function(fastId, el, eventName) {
      var listeners, types,
        _this = this;

      types = this._getTypes(fastId, el);
      if (!types) {
        return function() {};
      }
      listeners = (function() {
        var listener, type, _i, _j, _len, _len1, _ref;

        listeners = [];
        for (_i = 0, _len = types.length; _i < _len; _i++) {
          type = types[_i];
          _ref = this.dambo.forThe(type).getListeners(eventName);
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            listener = _ref[_j];
            listeners.push(listener);
          }
        }
        return listeners;
      })();
      if (listeners.length === 0) {
        return function() {};
      }
      return function(e) {
        var listener, _i, _len, _results;

        _results = [];
        for (_i = 0, _len = listeners.length; _i < _len; _i++) {
          listener = listeners[_i];
          _results.push(listener(e, fastId, el, _this));
        }
        return _results;
      };
    };

    Dommy.prototype.fireEvent = function(fastId, el, eventName, e) {
      var type;

      type = this._getTypes(fastId);
      this.getListener(fastId, el, eventName, e);
      return this;
    };

    Dommy.prototype.getLazy = function(fastId, name) {
      var el, forId, lazy, ret,
        _this = this;

      if (!this.lazies[fastId]) {
        this.lazies[fastId] = forId = {};
      } else {
        forId = this.lazies[fastId];
      }
      if (forId[name] === void 0) {
        el = this.el(fastId);
        lazy = (function() {
          var l, type, _i, _len, _ref;

          _ref = _this._getTypes(fastId, el);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            type = _ref[_i];
            l = _this.dambo.forThe(type).getLazy(name);
            if (l) {
              return l;
            }
          }
        })();
        if (!lazy) {
          forId[name] = null;
          return null;
        }
        forId[name] = ret = lazy(fastId, this);
        return ret;
      }
      return forId[name];
    };

    return Dommy;

  })();
});
