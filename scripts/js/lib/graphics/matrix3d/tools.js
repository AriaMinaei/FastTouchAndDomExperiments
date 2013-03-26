
define(function() {
  var MatrixTools;
  return MatrixTools = {
    clone16: function(r) {
      return [r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]];
    },
    multiply: function(a, b) {
      return [a[0] * b[0] + a[1] * b[4] + a[2] * b[8], a[0] * b[1] + a[1] * b[5] + a[2] * b[9], a[0] * b[2] + a[1] * b[6] + a[2] * b[10], 0, a[4] * b[0] + a[5] * b[4] + a[6] * b[8], a[4] * b[1] + a[5] * b[5] + a[6] * b[9], a[4] * b[2] + a[5] * b[6] + a[6] * b[10], 0, a[8] * b[0] + a[9] * b[4] + a[10] * b[8], a[8] * b[1] + a[9] * b[5] + a[10] * b[9], a[8] * b[2] + a[9] * b[6] + a[10] * b[10], 0, a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + b[12], a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + b[13], a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + b[14], 1];
    },
    identity: function() {
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }
  };
});
