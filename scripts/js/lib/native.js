(function() {
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

}).call(this);
