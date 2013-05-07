require('../../prepare');

spec(['utility/array'], function(array) {
  test('from', function() {
    array.from([1]).should.be.an.instanceOf(Array);
    return array.from([1])[0].should.equal(1);
  });
  test('clone', function() {
    var a, b;

    a = [0, 1, 2];
    b = array.clone(a);
    b[0].should.equal(0);
    b[1].should.equal(1);
    b[0] = 3;
    return a[0].should.equal(0);
  });
  return test('pluck', function() {
    var a, after;

    a = [0, 1, 2, 3];
    after = array.pluck(a, 1);
    after.length.should.equal(3);
    after[0].should.equal(0);
    after[1].should.equal(2);
    after[2].should.equal(3);
    return after.should.equal(a);
  });
});

/*
//@ sourceMappingURL=array.map
*/
