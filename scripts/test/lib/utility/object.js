require('../../prepare');

spec(['utility/object'], function(object) {
  test('isBareObject', function() {
    object.isBareObject('a').should.equal(false);
    return object.isBareObject({
      'a': 'a'
    }).should.equal(true);
  });
  test('typeOf', function() {
    object.typeOf('s').should.equal('string');
    object.typeOf(0).should.equal('number');
    object.typeOf(false).should.equal('boolean');
    object.typeOf({}).should.equal('object');
    object.typeOf(arguments).should.equal('arguments');
    return object.typeOf([]).should.equal('array');
  });
  test('empty', function() {
    var o;

    o = {
      a: 1,
      b: 2
    };
    object.empty(o);
    o.should.not.have.property('a');
    return o.should.not.have.property('b');
  });
  test('fastEmpty', function() {
    var o;

    o = {
      a: 1,
      b: 2
    };
    object.fastEmpty(o);
    o.should.not.have.property('a');
    return o.should.not.have.property('b');
  });
  test('clone', function() {
    var o;

    object.clone([1])[0].should.equal(1);
    object.clone({
      a: 1
    }).a.should.equal(1);
    o = {
      a: 1
    };
    return object.clone(o).should.not.equal(o);
  });
  test('clone [include prototype]', function() {
    var C, a, b;

    C = (function() {
      function C(a) {
        this.a = a;
      }

      C.prototype.sayA = function() {
        return this.a + 'a';
      };

      return C;

    })();
    a = new C('a');
    a.sayA().should.equal('aa');
    b = object.clone(a, true);
    b.should.not.equal(a);
    b.constructor.should.equal(C);
    b.a.should.equal('a');
    b.a = 'a2';
    return b.sayA().should.equal('a2a');
  });
  test('clone [without prototype]', function() {
    var C, a, b;

    C = (function() {
      function C(a) {
        this.a = a;
      }

      C.prototype.sayA = function() {
        return this.a + 'a';
      };

      return C;

    })();
    a = new C('a');
    a.sayA().should.equal('aa');
    b = object.clone(a, false);
    return b.should.equal(a);
  });
  test('overrideOnto [basic]', function() {
    var onto, what;

    onto = {
      a: 'a',
      b: {
        c: 'c',
        d: {
          e: 'e'
        }
      }
    };
    what = {
      a: 'a2',
      b: {
        c: 'c2',
        d: {
          f: 'f2'
        }
      }
    };
    object.overrideOnto(what, onto);
    onto.a.should.equal('a2');
    onto.b.should.have.property('c');
    onto.b.c.should.equal('c2');
    onto.b.d.should.not.have.property('f');
    return onto.b.d.e.should.equal('e');
  });
  test('override', function() {
    var onto, onto2, what;

    onto = {
      a: 'a',
      b: {
        c: 'c',
        d: {
          e: 'e'
        }
      }
    };
    what = {
      a: 'a2',
      b: {
        c: 'c2',
        d: {
          f: 'f2'
        }
      }
    };
    onto2 = object.override(what, onto);
    onto2.a.should.equal('a2');
    onto2.b.should.have.property('c');
    onto2.b.c.should.equal('c2');
    onto2.b.d.should.not.have.property('f');
    onto2.b.d.e.should.equal('e');
    return onto.should.not.equal(onto2);
  });
  return (function() {
    var onto, what;

    what = {
      a: 'a2',
      c: function() {},
      z: 'z',
      y: {
        a: 'a'
      }
    };
    onto = {
      a: 'a',
      b: 'b'
    };
    test('appendOnto [basic]', function() {
      object.appendOnto(what, onto);
      onto.a.should.equal('a2');
      onto.b.should.equal('b');
      return onto.z.should.equal('z');
    });
    test("appendOnto [shallow copies instances]", function() {
      onto.c.should.be["instanceof"](Function);
      return onto.c.should.equal(what.c);
    });
    return test("appendOnto [clones objects]", function() {
      onto.should.have.property('y');
      onto.y.a.should.equal('a');
      return onto.y.should.not.equal(what.y);
    });
  })();
});

/*
//@ sourceMappingURL=object.map
*/
