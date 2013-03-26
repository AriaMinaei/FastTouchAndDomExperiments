
define(function() {
  var Test;
  return Test = {
    eq: function(a, b) {
      if (JSON.stringify(a) === JSON.stringify(b)) {
        return console.log('PASSED', a);
      } else {
        return console.error('FAILED', a, b);
      }
    }
  };
});
