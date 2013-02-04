(function() {
  var root;

  root = this;

  document.addEventListener("DOMContentLoaded", function() {
    var g;
    g = new GestureHandler(document);
    dommy.addEvent('babs', 'tap', function(e, id, el) {
      return console.log('received tap event for', el);
    });
    dommy.addEvent('babs', 'hold', function(e, id, el) {
      return console.log('received hold event for', el);
    });
    g.listen();
    return root.g = g;
  });

}).call(this);
