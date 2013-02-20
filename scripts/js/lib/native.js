var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define([], function() {
  	Function.prototype.overloadSetter = function(usePlural){
			var self = this;
			return function(a, b){
				if (a == null) return this;
				if (usePlural || typeof a != 'string'){
					for (var k in a) self.call(this, k, a[k]);
				} else {
					self.call(this, a, b);
				}
				return this;
			};
		};

		Function.prototype.overloadGetter = function(usePlural){
			var self = this;
			return function(a){
				var args, result;
				if (typeof a != 'string') args = a;
				else if (arguments.length > 1) args = arguments;
				else if (usePlural) args = [a];
				if (args){
					result = {};
					for (var i = 0; i < args.length; i++) result[args[i]] = self.call(this, args[i]);
				} else {
					result = self.call(this, a);
				}
				return result;
			};
		};
  Object.append = function(original, add) {
    var key;
    for (key in add) {
      original[key] = add[key];
    }
    return original;
  };
  window.typeOf = function(item) {
    var _ref;
    if (item === null) {
      return 'null';
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
      if (__indexOf.call(item, 'item') >= 0) {
        return 'collection';
      }
    }
    return typeof item;
  };
  (function() {
    var cloneOf;
    cloneOf = function(item) {
      switch (typeOf(item)) {
        case 'array':
          return item.clone();
        case 'object':
          return Object.clone(item);
        default:
          return item;
      }
    };
    Array.prototype.clone = function() {
      var clone, i;
      i = this.length;
      clone = new Array(i);
      while (i--) {
        clone[i] = cloneOf(this[i]);
      }
      return clone;
    };
    Array.prototype.simpleClone = function() {
      return this.slice(0);
    };
    return Object.clone = function(object) {
      var clone, key;
      clone = {};
      for (key in object) {
        clone[key] = cloneOf(object[key]);
      }
      return clone;
    };
  })();
  Math.square = function(n) {
    return n * n;
  };
  Math.distance = function(x1, y1, x2, y2) {
    return Math.sqrt(Math.square(x2 - x1) + Math.square(y2 - y1));
  };
  UIEvent.prototype.stop = function() {
    this.stopPropagation();
    return this.preventDefault();
  };
});
