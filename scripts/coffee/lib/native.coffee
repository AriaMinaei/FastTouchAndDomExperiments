# From mootools
`	Function.prototype.overloadSetter = function(usePlural){
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
	}`
	
# Append all props and methods of add to iriginal
Object.append = (original, add) ->
	original[key] = add[key] for key of add
	original


# for (var i = 1, l = arguments.length; i < l; i++){
# 			var extended = arguments[i] || {};
# 			for (var key in extended) original[key] = extended[key];
# 		}
# 		return original;