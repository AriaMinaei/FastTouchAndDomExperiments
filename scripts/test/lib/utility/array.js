require('../../prepare');

spec(['utility/array'], function(array) {
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
