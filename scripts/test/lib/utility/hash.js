require('../../prepare');

spec(['utility/hash'], function(Hash) {
  var h, obj;

  h = new Hash;
  obj = {
    'name': 'me'
  };
  test('set, get', function() {
    h.set('name', 'aria');
    h.array[0].should.equal('aria');
    h.set('obj', obj);
    return h.get('obj').should.equal(h.array[1]);
  });
  test('each', function() {
    return h.each(function(i, val) {
      if (i === 0) {
        val.should.equal(h.get('name'));
      } else if (i === 1) {
        val.should.equal(h.get('obj'));
      }
      return i.should.not.be.above(1);
    });
  });
  return test('remove', function() {
    h.remove('name');
    assert.strictEqual(h.get('name'), void 0);
    h.array.length.should.equal(1);
    h._len.should.equal(1);
    assert.strictEqual(h._indexes['name'], void 0);
    h.get('obj').should.equal(obj);
    h.array[0].should.equal(obj);
    return assert.strictEqual(h.array[1], void 0);
  });
});

/*
//@ sourceMappingURL=hash.map
*/
