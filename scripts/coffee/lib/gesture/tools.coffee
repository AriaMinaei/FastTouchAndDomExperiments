if typeof define isnt 'function' then define = require('amdefine')(module)

define ['utility/pool/fixed'], (FixedPool) ->

	TouchTools = {}

	class TouchPool extends FixedPool

		_create: ->

			{
				pageX: 0
				pageY: 0
				screenX: 0
				screenY: 0
				identifier: 0
			}

		# We don't reset, since they reset by themselves
		_reset: (item) -> item

	class TouchTools.TouchEventPool extends FixedPool

		constructor: (size = 4, listSize = 3) ->

			@_touchPool = new TouchPool listSize * size

			super size

		_create: ->

			{
				target: null
				timeStamp: 0
				touches: []
				changedTouches: []
			}

		_reset: (item) ->

			item.touches.length = 0

			item.changedTouches.length = 0

			item

		copy: (e) ->

			copied = @get()

			copied.target = e.target
			copied.timeStamp = e.timeStamp

			copied.touches = copyTouchList e.touches

			copied.changedTouches = copyTouchList e.changedTouches

			copied

		copyTouchListInto: (list, into) ->

			for touch in list

				one = @_touchPool.get()

				one.pageX = touch.pageX
				one.pageY = touch.pageY
				one.screenX = touch.screenX
				one.screenY = touch.screenY
				one.identifier = touch.identifier				

				into.push one

			into


	# Returns a maintained copy of TouchList
	# Some wbekit versions update a TouchEvent object
	# if subsequent events are dispatched. This is a simple workaround.
	copyTouchList = (list) ->

		copied = []

		for touch in list

			copied.push

				pageX: touch.pageX
				pageY: touch.pageY
				screenX: touch.screenX
				screenY: touch.screenY
				identifier: touch.identifier

		copied

	# Copies a TouchEvent
	TouchTools.copyTouchEvent = (e) ->

		copied = 

			target: e.target
			timeStamp: e.timeStamp
			touches: copyTouchList e.touches
			changedTouches: copyTouchList e.changedTouches

		copied

	TouchTools