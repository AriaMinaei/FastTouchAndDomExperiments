require('../../prepare');

spec(['utility/belt'], function(belt) {
  test('empty', function() {
    var o;

    o = {
      a: 1,
      b: 2
    };
    belt.empty(o);
    o.should.not.have.property('a');
    return o.should.not.have.property('b');
  });
  test('fastEmpty', function() {
    var o;

    o = {
      a: 1,
      b: 2
    };
    belt.fastEmpty(o);
    o.should.not.have.property('a');
    return o.should.not.have.property('b');
  });
  test('append 1', function() {
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
  });
  test('typeOf', function() {
    belt.typeOf('s').should.equal('string');
    belt.typeOf(0).should.equal('number');
    belt.typeOf(false).should.equal('boolean');
    belt.typeOf({}).should.equal('object');
    belt.typeOf(arguments).should.equal('arguments');
    return belt.typeOf([]).should.equal('array');
  });
  test('toArray', function() {
    belt.toArray([1]).should.be.an.instanceOf(Array);
    return belt.toArray([1])[0].should.equal(1);
  });
  test('cloneArray', function() {
    var a, b;

    a = [0, 1, 2];
    b = belt.cloneArray(a);
    b[0].should.equal(0);
    b[1].should.equal(1);
    b[0] = 3;
    return a[0].should.equal(0);
  });
  test('clone', function() {
    belt.clone([1])[0].should.equal(1);
    return belt.clone({
      a: 1
    }).a.should.equal(1);
  });
  test('deepAppend 1', function() {
    var v1, v2;

    v1 = {
      a: 'a',
      b: 'b'
    };
    v2 = {
      a: 'a2',
      c: 'c2'
    };
    belt.deepAppend(v1, v2);
    v1.a.should.equal('a2');
    return v1.c.should.equal('c2');
  });
  return test('deepAppend 2', function() {
    var person1, person2;

    person1 = {
      hands: ['left', 'right'],
      face: {
        eyes: null,
        lips: 'red'
      }
    };
    person2 = {
      hands: ['left', 'noright'],
      face: {
        eyes: {
          left: {
            sight: 'good'
          }
        }
      }
    };
    belt.deepAppend(person1, person2);
    person1.hands[1].should.equal('noright');
    person1.face.should.have.property('lips', 'red');
    person1.face.should.have.property('eyes');
    person1.face.eyes.should.have.property('left');
    person1.face.eyes.left.should.have.property('sigssht');
    return person1.face.eyes.left.sight.should.equal('good');
  });
});

/*
//@ sourceMappingURL=belt.map
*/
