var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  var NowPlaying;

  return NowPlaying = (function() {
    function NowPlaying(id, dommy) {
      this.id = id;
      this.dommy = dommy;
      this.el = this.dommy.el(this.id);
      console.log(this.el);
    }

    return NowPlaying;

  })();
});

/*
//@ sourceMappingURL=nowplaying.map
*/
