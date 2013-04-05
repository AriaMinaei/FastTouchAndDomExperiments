var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  var FixedPool;

  return FixedPool = (function() {
    function FixedPool(size) {
      this.size = size | 0;
      if (this.size <= 0) {
        throw new Error("FixedPool's size must be an integer greater than zero.");
      }
      this._current = 0;
      this._pool = [];
      this._filled = false;
    }

    FixedPool.prototype._create = function() {
      return {};
    };

    FixedPool.prototype._reset = function(item) {
      var key;

      for (key in item) {
        delete item[key];
      }
      return item;
    };

    FixedPool.prototype.get = function() {
      var item;

      if (this._filled) {
        item = this._pool[this._current];
        this._reset(item);
        this._current++;
        if (this._current === this.size) {
          this._current = 0;
        }
      } else {
        item = this._create();
        this._pool.push(item);
        this._current++;
        if (this._current === this.size) {
          this._current = 0;
          this._filled = true;
        }
      }
      return item;
    };

    return FixedPool;

  })();
});

/*
//@ sourceMappingURL=fixed.map
*/
