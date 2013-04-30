require('../../prepare');

spec(['utility/math'], function(math) {
  test('square', function() {
    return math.square(2).should.equal(4);
  });
  test('distance', function() {
    math.distance(0, 0, 1, 1).should.equal(Math.sqrt(2));
    math.distance(-1, -1, 0, 0).should.equal(Math.sqrt(2));
    math.distance(0, 0, 5, 0).should.equal(5);
    return math.distance(5, 0, -5, 0).should.equal(10);
  });
  test('limit', function() {
    math.limit(5, 0, 10).should.equal(5);
    math.limit(-1, 0, 10).should.equal(0);
    math.limit(0, 0, 10).should.equal(0);
    return math.limit(11, 0, 10).should.equal(10);
  });
  return test('unit', function() {
    math.unit(10).should.equal(1);
    math.unit(0).should.equal(1);
    math.unit(-0.5).should.equal(-1);
    return math.unit(-100).should.equal(-1);
  });
});

/*
//@ sourceMappingURL=math.map
*/
