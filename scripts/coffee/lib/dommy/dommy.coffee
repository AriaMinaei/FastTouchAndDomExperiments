if typeof define isnt 'function' then define = require('amdefine')(module)

define ['dommy/styles'], (Styles) ->

	# To store data on DOM, detached from it.
	# Remember, you can't have custom IDs if you wanna use this ;)
	# 
	# Also, this is a loose class. It doesn't do any checking. It just assumes
	# you feed it with the right arguments. That's to make sure it works fast.
	class Dommy

		# Just choose a namespace, or do with 'global'
		constructor: (ns = 'global-', dambo) ->

			if typeof dambo is 'object'

				@dambo = dambo

			else if typeof window.dambo is 'object'

				@dambo = window.dambo

			else

				throw Error "Can't have a dommy without a dambo."

			# Save namespace as a string
			@namespace = String ns

			# Length of namespace, for reference
			@_nsLen = @namespace.length

			# Last uid
			@_lastId = 0

			# Everything stored for each el
			@_storage = [{}]

			# The styles helper
			@styles = new Styles @

			@_lazies = {}

		# FastId of el. Sets if not set
		id: (el, set = true) ->

			_id = String(el.id)

			if _id.length is 0

				if set

					el.id = @namespace + String(++@_lastId)
					
					@_storage[@_lastId] = 

						_el : el

					return @_lastId

				else

					return false
			else

				Number(_id.substr(@_nsLen))

		# Retrieves an element by its fast ID
		el: (id)->

			@get id, '_el'
		
		# Sets a key/value pair for Numeric Unique ID
		set: (id, key, val) ->

			unless @_storage[id]

				@_storage[id] = {}

			@_storage[id][key] = val

			@

		# Gets a key/value pair for Numeric Unique ID
		get: (id, key) ->

			@_storage[id][key] if @_storage[id]
			
		# Removes a key/value pair for Numeric Unique ID
		remove: (id, key) ->

			delete @_storage[id][key] if @_storage[id]

			@

		# Cleans storage for Numeric Unique ID
		clean: (id) ->

			@_storage[id] = {} if @_storage[id]

		# Removes element from DOM. Makes sure its storage and all
		# its children's storage get cleaned too
		eliminate: (id, el) ->

			@clean el

			subs = el.getElementsByTagName '*'

			for sub in subs

				subId = @id sub, false

				@clean subId if subId

			el.parentNode.removeChild el if el.parentNode

			@clean id

			@

		# Gets element type. Requires el, because it will try to fetch it from
		# DOM if its not set
		typesOf: (id, el) ->

			types = @get id, '_types'

			return types if types isnt undefined

			# We have to fetch it
			types = el.getAttribute 'data-types'

			unless types

				@set id, '_types', null

				return null

			types = types.split(',').map (s) -> s.trim()

			@set id, '_types', types

			types
		
		# Returns a function, accepting (e) as the event object,
		# when you run it, (e) will be sent to el as an event
		getListener: (id, el, eventName) ->

			types = @typesOf id, el

			unless types then return () ->

			listeners = do ->

				listeners = []

				for type in types

					for listener in @dambo.forThe(type).getListeners eventName

						listeners.push listener

				listeners

			if listeners.length is 0 then return () ->

			return (e) =>

				for listener in listeners

					listener(e, id, el, @)

		# Quick n dirty event firing. Do it on one time events, like tap or click.
		# For events that get fired regularly or many times in a row, its better to
		# get a listener using Dommy.getListener(), and then firing on it.
		# 
		# This is not permissive at all. You should have id and reference to element,
		# which is supposed to increase performance.
		fireEvent: (id, el, eventName, e) ->

			type = @typesOf id

			@getListener id, el, eventName, e

			@

		getLazy: (id, el, name) ->

			if not @_lazies[id]

				@_lazies[id] = forId = {}

			else

				forId = @_lazies[id]

			if forId[name] is undefined

				lazy = do =>

					for type in @typesOf id, el

						l = @dambo.forThe(type).getLazy name

						return l if l

				unless lazy
				
					forId[name] = null

					return null

				forId[name] = ret = lazy(id, @)

				return ret

			return forId[name]