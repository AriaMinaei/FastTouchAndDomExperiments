var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

require('../../../prepare');

spec(['utility/pool/fixed'], function(FixedPool) {
  return test('FixedPool', function() {
    var MyPool, a, b, c, pool, _ref;

    MyPool = (function(_super) {
      __extends(MyPool, _super);

      function MyPool() {
        _ref = MyPool.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      MyPool.prototype._create = function() {
        return {
          name: '',
          age: 0
        };
      };

      MyPool.prototype._reset = function(item) {
        item.name = '';
        item.age = 0;
        return item;
      };

      return MyPool;

    })(FixedPool);
    pool = new MyPool(2);
    a = pool.get();
    b = pool.get();
    c = pool.get();
    c.should.equal(a);
    c.should.not.equal(b);
    return pool.get().should.equal(b);
  });
});

/*
//@ sourceMappingURL=fixed.map
*/
