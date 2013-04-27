var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  var belt;

  belt = {
    /*
    		Empties an object of its properties.
    */

    empty: function(object) {
      var property;

      for (property in object) {
        if (object.hasOwnProperty(property)) {
          delete object[property];
        }
      }
      return object;
    },
    /*
    		Empties an object. Doesn't check for hasOwnProperty.
    */

    fastEmpty: function(object) {
      var property;

      for (property in object) {
        delete object[property];
      }
      return object;
    },
    /*
    		Appends properties of 'add' to 'to'
    */

    append: function(to, add) {
      var key;

      for (key in add) {
        if (add[key] !== void 0) {
          to[key] = add[key];
        }
      }
      return to;
    },
    deepAppend: function(to, add) {
      var key, val;

      for (key in add) {
        val = add[key];
        if (val === void 0) {
          continue;
        }
        if (belt.typeOf(val) !== 'object') {
          to[key] = val;
        } else {
          if (belt.typeOf(to[key]) !== 'object') {
            to[key] = {};
          }
          belt.deepAppend(to[key], val);
        }
      }
      return to;
    },
    /*
    		Returns type of an object, including:
    		undefined, null, string, number, array,
    		arguments, element, textnode, whitespace, and object
    */

    typeOf: function(item) {
      var _ref;

      if (item === null) {
        return 'null';
      }
      if (typeof item !== 'object') {
        return typeof item;
      }
      if (Array.isArray(item)) {
        return 'array';
      }
      if (item.nodeName) {
        if (item.nodeType === 1) {
          return 'element';
        }
        if (item.nodeType === 3) {
          return (_ref = /\S/.test(item.nodeValue)) != null ? _ref : {
            'textnode': 'whitespace'
          };
        }
      } else if (typeof item.length === 'number') {
        if (item.callee) {
          return 'arguments';
        }
      }
      return typeof item;
    },
    /*
    		Tries to turn anything into an array.
    */

    toArray: function(r) {
      return Array.prototype.slice.call(r);
    },
    /*
    		Clone of an array. Properties will be shallow copies.
    */

    simpleCloneArray: function(array) {
      return array.slice(0);
    },
    clone: function(item) {
      switch (belt.typeOf(item)) {
        case 'array':
          return belt.cloneArray(item);
        case 'object':
          return belt.cloneObject(item);
        default:
          return item;
      }
    },
    /*
    		Deep clone of an array. 
    		From MooTools
    */

    cloneArray: function(array) {
      var clone, i;

      i = array.length;
      clone = new Array(i);
      while (i--) {
        clone[i] = belt.clone(array[i]);
      }
      return clone;
    },
    /*
    		Deep clone of an object. 
    		From MooTools
    */

    cloneObject: function(object) {
      var clone, key;

      clone = {};
      for (key in object) {
        clone[key] = belt.clone(object[key]);
      }
      return clone;
    }
  };
  return belt;
});

/*
//@ sourceMappingURL=belt.map
*/
