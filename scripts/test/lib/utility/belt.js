require('../../prepare');

spec(['utility/belt'], function(belt) {
  (function() {
    var o;

    o = {
      a: 1,
      b: 2
    };
    belt.empty(o);
    o.should.not.have.property('a');
    return o.should.not.have.property('b');
  })();
  (function() {
    var o;

    o = {
      a: 1,
      b: 2
    };
    belt.fastEmpty(o);
    o.should.not.have.property('a');
    return o.should.not.have.property('b');
  })();
  (function() {
    var add, to;

    to = {
      a: 1,
      b: 2
    };
    add = {
      b: 3,
      c: 3
    };
    belt.append(to, add);
    to.should.have.property('c');
    to.b.should.equal(3);
    to.c.should.equal(3);
    return to.a.should.equal(1);
  })();
  (function() {
    belt.typeOf('s').should.equal('string');
    belt.typeOf(0).should.equal('number');
    belt.typeOf(false).should.equal('boolean');
    belt.typeOf({}).should.equal('object');
    belt.typeOf(arguments).should.equal('arguments');
    return belt.typeOf([]).should.equal('array');
  })();
  (function() {
    belt.toArray([1]).should.be.an.instanceOf(Array);
    return belt.toArray([1])[0].should.equal(1);
  })();
  (function() {
    var a, b;

    a = [0, 1, 2];
    b = belt.cloneArray(a);
    b[0].should.equal(0);
    b[1].should.equal(1);
    b[0] = 3;
    return a[0].should.equal(0);
  })();
  return (function() {
    belt.clone([1])[0].should.equal(1);
    return belt.clone({
      a: 1
    }).a.should.equal(1);
  })();
});

/*
//@ sourceMappingURL=belt.map
*/
