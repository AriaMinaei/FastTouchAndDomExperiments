if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	belt =

		###
		Empties an object of its properties.
		###
		empty: (object) ->

			for property of object

				delete object[property] if object.hasOwnProperty property

			object

		###
		Empties an object. Doesn't check for hasOwnProperty.
		###
		fastEmpty: (object) ->
			
			delete object[property] for property of object

			object

		###
		Appends properties of 'add' to 'to'
		###
		append: (to, add) ->

			to[key] = add[key] for key of add when add[key] isnt undefined

			to

		deepAppend: (to, add) ->

			for key of add

				val = add[key]

				continue if val is undefined

				if belt.typeOf(val) isnt 'object'

					to[key] = val

				else

					to[key] = {} if belt.typeOf(to[key]) isnt 'object'

					belt.deepAppend to[key], val

			to


		###
		Returns type of an object, including:
		undefined, null, string, number, array,
		arguments, element, textnode, whitespace, and object
		###
		typeOf: (item) ->

			return 'null' if item is null
			
			return typeof item if typeof item isnt 'object'

			return 'array' if Array.isArray item

			# From MooTools
			# - do we even need this?
			if item.nodeName

				if item.nodeType is 1 then return 'element'
				if item.nodeType is 3 then return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace'
			
			else if typeof item.length is 'number'

				if item.callee then return 'arguments'
			
			return typeof item

		###
		Tries to turn anything into an array.
		###
		toArray: (r) ->

			Array.prototype.slice.call(r)

		###
		Clone of an array. Properties will be shallow copies.
		###
		simpleCloneArray: (array) ->

			array.slice(0)

		# Deep clone of any variable.
		# From MooTools
		clone: (item) ->

			switch belt.typeOf(item)

				when 'array' then return belt.cloneArray(item)

				when 'object' then return belt.cloneObject(item)

				else return item

		###
		Deep clone of an array. 
		From MooTools
		###
		cloneArray: (array) ->

			i = array.length
			
			clone = new Array(i)

			while i--

				clone[i] = belt.clone(array[i])
				
			clone

		###
		Deep clone of an object. 
		From MooTools
		###
		cloneObject: (object) ->

			clone = {}

			for key of object

				clone[key] = belt.clone object[key]

			clone


	belt