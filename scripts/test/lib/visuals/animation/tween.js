require('../../../prepare');

spec(['visuals/animation/tween'], function(Tween) {
  var t;

  t = new Tween(10, 20, 100, function(p) {
    return p;
  });
  t.startsAt(30);
  return t.on(40).should.equal(11);
});

/*
//@ sourceMappingURL=tween.map
*/
