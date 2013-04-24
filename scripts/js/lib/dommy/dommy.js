var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['./styles'], function(Styles) {
  var Dommy, emptyFunction;

  emptyFunction = function() {};
  return Dommy = (function() {
    function Dommy(ns, dambo) {
      if (ns == null) {
        ns = 'global-';
      }
      if (typeof dambo === 'object') {
        this.dambo = dambo;
      } else if (typeof window.dambo === 'object') {
        this.dambo = window.dambo;
      } else {
        throw Error("Can't have a dommy without a dambo.");
      }
      this.namespace = String(ns);
      this._nsLen = this.namespace.length;
      this._lastId = 0;
      this._storage = [{}];
      this.styles = new Styles(this);
      this._lazies = {};
    }

    Dommy.prototype.id = function(el, set) {
      var _id;

      if (set == null) {
        set = true;
      }
      _id = String(el.id);
      if (_id.length === 0) {
        if (set) {
          el.id = this.namespace + String(++this._lastId);
          this._storage[this._lastId] = {
            _el: el
          };
          return this._lastId;
        } else {
          return false;
        }
      } else {
        return Number(_id.substr(this._nsLen));
      }
    };

    Dommy.prototype.el = function(id) {
      return this.get(id, '_el');
    };

    Dommy.prototype.set = function(id, key, val) {
      if (!this._storage[id]) {
        this._storage[id] = {};
      }
      this._storage[id][key] = val;
      return this;
    };

    Dommy.prototype.get = function(id, key) {
      if (this._storage[id]) {
        return this._storage[id][key];
      }
    };

    Dommy.prototype.remove = function(id, key) {
      if (this._storage[id]) {
        delete this._storage[id][key];
      }
      return this;
    };

    Dommy.prototype.clean = function(id) {
      if (this._storage[id]) {
        return this._storage[id] = {};
      }
    };

    Dommy.prototype.eliminate = function(id, el) {
      var sub, subId, subs, _i, _len;

      this.clean(el);
      subs = el.getElementsByTagName('*');
      for (_i = 0, _len = subs.length; _i < _len; _i++) {
        sub = subs[_i];
        subId = this.id(sub, false);
        if (subId) {
          this.clean(subId);
        }
      }
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
      this.clean(id);
      return this;
    };

    Dommy.prototype.typesOf = function(id, el) {
      var types;

      types = this.get(id, '_types');
      if (types !== void 0) {
        return types;
      }
      types = el.getAttribute('data-types');
      if (!types) {
        this.set(id, '_types', null);
        return null;
      }
      types = types.split(',').map(function(s) {
        return s.trim();
      });
      this.set(id, '_types', types);
      return types;
    };

    Dommy.prototype.getListener = function(id, el, eventName) {
      var listeners, types,
        _this = this;

      types = this.typesOf(id, el);
      if (!types) {
        return emptyFunction;
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
        return emptyFunction;
      }
      return function(e) {
        var listener, _i, _len, _results;

        _results = [];
        for (_i = 0, _len = listeners.length; _i < _len; _i++) {
          listener = listeners[_i];
          _results.push(listener(e, id, el, _this));
        }
        return _results;
      };
    };

    Dommy.prototype.fireEvent = function(id, el, eventName, e) {
      var type;

      type = this.typesOf(id);
      this.getListener(id, el, eventName, e);
      return this;
    };

    Dommy.prototype.getLazy = function(id, el, name) {
      var forId, lazy, ret,
        _this = this;

      if (!this._lazies[id]) {
        this._lazies[id] = forId = {};
      } else {
        forId = this._lazies[id];
      }
      if (forId[name] === void 0) {
        lazy = (function() {
          var l, type, _i, _len, _ref;

          _ref = _this.typesOf(id, el);
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
        forId[name] = ret = lazy(id, this);
        return ret;
      }
      return forId[name];
    };

    return Dommy;

  })();
});

/*
//@ sourceMappingURL=dommy.map
*/
