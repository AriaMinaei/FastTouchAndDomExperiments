
define(['gesture/definitions/standard', 'native'], function(setupStandardDefinitions) {
  var Definitions;
  Definitions = {
    list: {},
    define: function(name, stuff) {
      var bare;
      if (stuff == null) {
        stuff = {};
      }
      bare = {
        check: function(h) {
          return -1;
        },
        init: function() {},
        start: function(h, e) {},
        end: function(h, e) {},
        move: function(h, e) {},
        shouldFinish: function(h) {
          return true;
        },
        finish: function(h) {}
      };
      bare.name = name;
      bare = Object.append(bare, stuff);
      Definitions.list[name] = bare;
      return bare;
    },
    extend: function(original, name, stuff) {
      var o;
      if (stuff == null) {
        stuff = {};
      }
      stuff.name = name;
      o = Object.append(Object.clone(Definitions.list[original]), stuff);
      Definitions.list[name] = o;
      return o;
    }
  };
  setupStandardDefinitions(Definitions);
  return Definitions;
});
