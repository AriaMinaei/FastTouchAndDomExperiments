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
	
# Append all props and methods of add to original
Object.append = (original, add) ->
	original[key] = add[key] for key of add
	original

# typeOf from MooTools
window.typeOf = (item) ->
	return 'null' if item == null
	
	return 'array' if Array.isArray(item)

	if item.nodeName
		if item.nodeType is 1 then return 'element'
		if item.nodeType is 3 then return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace'
	else if typeof item.length is 'number'
		if item.callee then return 'arguments'
		if 'item' in item then return 'collection'
	

	return typeof item

# cloneOf from MooTools
cloneOf = (item) ->
	switch typeOf(item)
		when 'array' then return item.clone()
		when 'object' then return Object.clone(item)
		else return item;

# From MooTools
Array::clone = ->
	i = @length
	clone = new Array(i)
	while i--
		clone[i] = cloneOf(@[i])
		
	clone

Array::simpleClone = ->
	@.slice(0)

# From MooTools
Object.clone = (object) ->
	clone = {}
	for key of object
		clone[key] = cloneOf(object[key])
	clone

# Like console.log, but it clones the objects and arrays to make sure
# if object changes, the log wouldn't change with it
console.snap = (rest...) ->
	console.log.apply(console, rest.clone())