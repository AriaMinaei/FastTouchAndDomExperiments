define ['graphics/fastMatrix'], (FastMatrix) ->
	# To store data on DOM, detached from it.
	# Remember, you can't have custom IDs if you wanna use this ;)
	# 
	# Also, this is a loose class. It doesn't do any checking. It just assumes
	# you feed it with the right arguments. That's to make sure it works fast.
	class DommyContainer
		# Just choose a namespace, or do with 'global'
		constructor: (@ns = 'global-') ->
			# Save namespace as a string
			@ns = String(@ns)

			# Length of namespace, for reference
			@nsLen = @ns.length

			# Last uid
			@last = 0

			# Everything stored for each el
			@store = [{}]

			# All the events for each type
			@events = {}

			# The styles helper
			@styles = new DommyContainer.Styles @

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

		# Gets element type
		getType: (el) ->
			fastId = @nFastId(el)
			return null if not fastId

			@_getType(fastId, el)

		# Add an event to the elements of 'type'
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

		# Get array of listeners for elements of 'type'
		# Use getListener() if you need a listener for an element
		_getListeners: (type, eventName) ->
			forType = @events[type]
			return [] unless forType
			forName = @events[type][eventName]
			return [] unless forName
			forName
		
		# Returns a function, accepting (e) as the event object,
		# when you run it, (e) will be sent to el as an event
		getListener: (fastId, el, eventName) ->
			type = @_getType(fastId, el)

			unless type then return () ->

			listeners = @_getListeners(type, eventName)

			if listeners.length is 0 then return () ->

			return (e) ->
				for listener in listeners
					listener(e, fastId, el, type, eventName)

		# Quick n dirty event firing. Do it on one time events, like tap or click.
		# For events that get fired regularly or many times in a row, its better to
		# get a listener using DommyContainer.getListener(), and then firing on it.
		# 
		# This is not permissive at all. You should have fastId and reference to element,
		# which is supposed to increase performance.
		fireEvent: (fastId, el, eventName, e) ->
			type = @_getType(fastId)
			@getListener(fastId, el, eventName, e)
			@

	class DommyContainer.Styles
		constructor: (@dommy) ->

		getTransform: (fastId, el) ->
			t = @dommy._get(fastId, 'style.transform')
			unless t
				t = new DommyContainer.Styles.Transform(@dommy, fastId, el)
				@dommy._set(fastId, 'style.transform', t)
			t


	class DommyContainer.Styles.Transform
		constructor: (@dommy, @fastId, el) ->
			if @original = @dommy._get(@fastId, 'style.transform.original')
				@current = @dommy._get(@fastId, 'style.transform.current')
				@temp 	 = @dommy._get(@fastId, 'style.transform.temp')
			else
				@original = new FastMatrix(getComputedStyle(el).webkitTransform)
				@dommy._set(@fastId, 'style.transform.original', @original)

				@current = @original.copy()
				@dommy._set(@fastId, 'style.transform.current', @current)

				@temp = @original.copy()
				@dommy._set(@fastId, 'style.transform.temp', @temp)

			# 0 for temp
			# 1 for current
			# 2 for original
			@active = 1

		temporarily: ->
			# Load current matrix into our temp matrix
			@temp.fromMatrix @current

			# Remember that temp is active
			@active = 0

			# Let the user manipulate it
			@temp

		originally: ->
			@active = 2
			@original

		currently: ->
			@active = 1
			@current

		apply: (el) ->
			switch @active
				when 0 then el.style.webkitTransform = @temp.toString()
				when 1 then el.style.webkitTransform = @current.toString()
				when 2 then el.style.webkitTransform = @original.toString()
			@

		commit: (el) ->
			@apply(el)

			switch @active
				when 0
					@current.fromMatrix @temp
				when 2
					@current.fromMatrix @original

			@active = 1
			@

		revertToCurrent: (el) ->
			@currently()
			@commit(el)

		revertToOriginal: (el) ->
			@originally()
			@commit(el)

	DommyContainer