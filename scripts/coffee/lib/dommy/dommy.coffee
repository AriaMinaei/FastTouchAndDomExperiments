define ['dommy/styles'], (DommyStyles) ->

	# To store data on DOM, detached from it.
	# Remember, you can't have custom IDs if you wanna use this ;)
	# 
	# Also, this is a loose class. It doesn't do any checking. It just assumes
	# you feed it with the right arguments. That's to make sure it works fast.
	class Dommy

		# Just choose a namespace, or do with 'global'
		constructor: (@ns = 'global-', dambo) ->

			if typeof dambo is 'object'
				@dambo = dambo
			else if typeof window.dambo is 'object'
				@dambo = window.dambo
			else
				throw Error "Can't have a dommy without a dambo."

			# Save namespace as a string
			@ns = String(@ns)

			# Length of namespace, for reference
			@nsLen = @ns.length

			# Last uid
			@last = 0

			# Everything stored for each el
			@store = [{}]

			# The styles helper
			@styles = new DommyStyles @

			@lazies = {}

		# Unique ID of el. Sets if not already set
		uid: (el) ->

			id = String(el.id)

			if id.length is 0

				id = el.id = @ns + String(++@last)
				@store[@last] = 
					_el : el

			id

		# Numeric Unique ID (Without the namespace) of el. Sets if not set
		fastId: (el) ->

			id = String(el.id)

			if id.length is 0

				el.id = @ns + String(++@last)
				@store[@last] = 
					_el : el
				@last

			else

				Number(id.substr(@nsLen))

		# Unique ID of el. Doesn't set if isnt set already
		nUid: (el) ->

			id = String(el.id)
			return null if id.length is 0
			id

		# Numeric Unique ID of el. Doesn't set if isnt set already
		nFastId: (el) ->

			id = String(el.id)
			return null if id.length is 0
			Number(id.substr(@nsLen))

		# Retrieves an element by its fast ID
		el: (fastId) ->

			@_get fastId, '_el'
		
		# Sets a key/value pair for Numeric Unique ID
		_set: (fastId, key, val) ->

			unless @store[fastId]

				@store[fastId] = {}

			@store[fastId][key] = val
			@

		# Sets a key/value pair for element
		set: (el, key, val) ->

			@_set(@fastId(el), key, val)

		# Gets a key/value pair for Numeric Unique ID
		_get: (fastId, key) ->

			@store[fastId][key] if @store[fastId]

		# Sets a key/value pair for element
		get: (el, key) ->

			@_get(@fastId(el), key)
			
		# Removes a key/value pair for Numeric Unique ID
		_remove: (fastId, key) ->

			delete @store[fastId][key] if @store[fastId]
			@

		# Removes a key/value pair for el
		remove: (el, key) ->

			@_remove(@fastId(el), key)

		# Cleans storage for Numeric Unique ID
		_clean: (fastId) ->

			@store[fastId] = {} if @store[fastId]

		# Cleans storage for element
		clean: (el) ->

			@store[@fastId(el)] = {}

		# Removes element from DOM. Makes sure its storage and all
		# its children's storage get cleaned too
		eliminate: (el) ->

			@clean(el)

			subs = el.getElementsByTagName('*')

			for sub in subs

				subQuickId = @nFastId(sub)
				@_clean(subQuickId) if subQuickId

			el.parentNode.removeChild(el) if el.parentNode
			@

		# Gets element type. Requires el, because it will try to fetch it from
		# DOM if its not set
		_getTypes: (fastId, el) ->

			types = @_get fastId, '_types'

			return types if types isnt undefined
				

			# We have to fetch it
			types = el.getAttribute 'data-types'

			unless types

				@_set fastId, '_types', null
				return null

			types = types.split(',').map (s) -> s.trim()

			@_set fastId, '_types', types
			types

		# Gets element type
		getTypes: (el) ->

			fastId = @nFastId(el)
			return null if not fastId

			@_getTypes(fastId, el)
		
		# Returns a function, accepting (e) as the event object,
		# when you run it, (e) will be sent to el as an event
		getListener: (fastId, el, eventName) ->

			types = @_getTypes(fastId, el)

			unless types then return () ->

			listeners = do ->

				listeners = []

				for type in types

					for listener in @dambo.forThe(type).getListeners(eventName)

						listeners.push listener

				listeners

			if listeners.length is 0 then return () ->

			return (e) =>

				for listener in listeners

					listener(e, fastId, el, @)

		# Quick n dirty event firing. Do it on one time events, like tap or click.
		# For events that get fired regularly or many times in a row, its better to
		# get a listener using Dommy.getListener(), and then firing on it.
		# 
		# This is not permissive at all. You should have fastId and reference to element,
		# which is supposed to increase performance.
		fireEvent: (fastId, el, eventName, e) ->

			type = @_getTypes(fastId)
			@getListener(fastId, el, eventName, e)
			@

		getLazy: (fastId, name) ->

			if not @lazies[fastId]

				@lazies[fastId] = forId = {}

			else

				forId = @lazies[fastId]

			if forId[name] is undefined

				el = @el(fastId)
				lazy = do =>

					for type in @_getTypes fastId, el

						l = @dambo.forThe(type).getLazy(name)

						return l if l

				unless lazy
				
					forId[name] = null
					return null

				forId[name] = ret = lazy(fastId, @)
				return ret

			return forId[name]