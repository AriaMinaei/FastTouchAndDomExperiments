var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['./array'], function(array) {
  var Hash;

  return Hash = (function() {
    function Hash() {
      this._indexes = {};
      this._pairs = {};
      this.array = [];
      this._len = 0;
    }

    Hash.prototype.set = function(name, value) {
      var index;

      if (this._indexes[name] === void 0) {
        this._pairs[name] = value;
        this.array.push(value);
        index = this.array.length - 1;
        this._indexes[name] = index;
      } else {
        this._pairs[name] = value;
        this.array[this._indexes[name]] = value;
      }
      this._len++;
      return this;
    };

    Hash.prototype.get = function(name) {
      return this._pairs[name];
    };

    Hash.prototype.each = function(func) {
      var i;

      i = 0;
      while (true) {
        func(i, this.array[i]);
        i++;
        if (i === this._len) {
          break;
        }
      }
      return null;
    };

    Hash.prototype.remove = function(name) {
      var index, value, _ref;

      if (this._indexes[name] === void 0) {
        return this;
      }
      this._len--;
      this._pairs[name] = void 0;
      index = this._indexes[name];
      array.pluck(this.array, index);
      this._indexes[name] = void 0;
      _ref = this._indexes;
      for (name in _ref) {
        value = _ref[name];
        if (value === void 0) {
          continue;
        }
        if (value > index) {
          this._indexes[name] = value - 1;
        }
      }
      return this;
    };

    return Hash;

  })();
});

/*
//@ sourceMappingURL=hash.map
*/
