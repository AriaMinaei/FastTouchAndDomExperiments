if typeof define isnt 'function' then define = require('amdefine')(module)

define ['./_common'], (common) -> object =

	isBareObject: common.isBareObject.bind common

	###
	if 'what' is an object, but an instance of some class,
	like: what = new Question
	object.isInstance what # yes
	###
	isInstance: (what) ->

		not @isBareObject what

	###
	Alias to common.typeOf
	###
	typeOf: common.typeOf.bind common

	###
	Alias to common.clone
	###
	clone: common.clone.bind common

	###
	Empties an object of its properties.
	###
	empty: (o) ->

		for prop of o

			delete o[prop] if o.hasOwnProperty prop

		o

	###
	Empties an o. Doesn't check for hasOwnProperty, so it's a tiny
	bit faster. Use it for plain objects.
	###
	fastEmpty: (o) ->
		
		delete o[property] for property of o

		o

	###
	if 'from' holds a set of default values,
	the values in 'to' will be overriden onto them, as long as
	they're not undefined.
	###
	overrideOnto: (what, onto) ->

		return onto if not @isBareObject(what) or not @isBareObject(onto)

		for key, oldVal of onto

			newVal = what[key]

			continue if newVal is undefined

			if typeof newVal isnt 'object' or @isInstance newVal

				onto[key] = @clone newVal

			# newVal is a plain object
			else

				if typeof oldVal isnt 'object' or @isInstance oldVal

					onto[key] = @clone newVal

				else

					@overrideOnto newVal, oldVal
		onto

	###
	Takes a clone of 'from' and runs #overrideOnto on it
	###
	override: (what, onto) ->

		@overrideOnto what, @clone(onto)

	append: (what, onto) ->

		@appendOnto what, @clone onto

	appendOnto: (what, onto) ->

		return onto if not @isBareObject(what) or not @isBareObject(onto)

		for key, newVal of what 

			continue unless newVal isnt undefined and what.hasOwnProperty key

			if typeof newVal isnt 'object' or @isInstance newVal

				onto[key] = newVal

			else

				# newVal is a bare object

				oldVal = onto[key]

				if typeof oldVal isnt 'object' or @isInstance oldVal

					onto[key] = @clone newVal

				else

					@appendOnto newVal, oldVal