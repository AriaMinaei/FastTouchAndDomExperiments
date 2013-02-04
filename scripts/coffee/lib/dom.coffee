window.$ = (id) ->
	document.getElementById id

window.$$ = (selector) ->
	document.querySelectorAll selector

unless window.requestAnimationFrame
	window.requestAnimationFrame = do ->
		return  window.webkitRequestAnimationFrame 	||
		window.mozRequestAnimationFrame				||
		window.oRequestAnimationFrame				||
		window.msRequestAnimationFrame 				||
		(callback, el) -> window.setTimeout(callback, 16)

window.DommyContainer = do ->
	# To store data on DOM, detached from it.
	# Remember, you can't have custom IDs if you wanna use this ;)
	# 
	# Also, this is a loose class. It doesn't do any checking. It just assumes
	# you feed it with the right arguments. That's to make sure it works fast.
	class DommyContainer
		# Just choose a namespace, or do with 'global'
		constructor: (@ns = 'global-') ->
			# Length of namespace, for reference
			@nsLen = @ns.length

			# Last uid
			@last = 0

			# Everything stored for each el
			@store = [{}]

			# All the events for each type
			@events = {}

		# Unique ID of el. Sets if not already set
		uid: (el) ->
			id = el.id
			if id.length is 0
				id = el.id = @ns + String(++@last)
				@store[@last] = {}
			id

		# Numeric Unique ID (Without the namespace) of el. Sets if not set
		fastId: (el) ->
			id = el.id
			if id.length is 0
				el.id = @ns + String(++@last)
				@store[@last] = {}
				@last
			else
				Number(id.substr(@nsLen))

		# Unique ID of el. Doesn't set if isnt set already
		nUid: (el) ->
			id = el.id
			return null if id.length is 0
			id

		# Numeric Unique ID of el. Doesn't set if isnt set already
		nFastId: (el) ->
			id = el.id
			return null if id.length is 0
			Number(id.substr(@nsLen))
		
		# Sets a key/value pair for Numeric Unique ID
		_set: (fastId, key, val) ->
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
		_getType: (fastId, el) ->
			type = @_get fastId, '_type'

			return type if type isnt undefined
				

			# We have to fetch it
			type = el.getAttribute 'data-type'

			unless type
				@_set fastId, '_type', null
				return null

			type = type.trim()

			@_set fastId, '_type', type
			type


		getType: (el) ->
			fastId = @nFastId(el)
			return null if not fastId

			@_getType(fastId, el)

		addEvent: (type, eventName, listener) ->
			if not @events[type]
				temp = {}
				temp[eventName] = [listener]
				@events[type] = temp
				return @

			if not @events[type][eventName]
				@events[type][eventName] = [listener]
				return @

			@events[type].push listener
			return @

		_getListeners: (type, eventName) ->
			forType = @events[type]
			return [] unless forType
			forName = @events[type][eventName]
			return [] unless forName
			forName


		# Quick n dirty event firing. Do it on one time events, like tap or click
		# For events that get fired regularly or many times in a row, its better to
		# get a listener using DommyContainer.getListener(), and then firing on it.
		# 
		# This is not permissive at all. You should have fastId and reference to element.
		# It's all because of performance.
		fireEvent: (fastId, el, eventName, e) ->
			type = @_getType(fastId)
			@getListener(fastId, el, eventName, e)
			@


		getListener: (fastId, el, eventName) ->
			type = @_getType(fastId, el)

			unless type then return () ->

			listeners = @_getListeners(type, eventName)

			if listeners.length is 0 then return () ->

			return (e) ->
				for listener in listeners
					listener(e, fastId, el, type, eventName)


# Global Dommy Container
window.dommy = new DommyContainer()