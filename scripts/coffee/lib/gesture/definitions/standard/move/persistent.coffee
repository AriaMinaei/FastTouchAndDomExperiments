define ->
	return (defineGesture) ->

		# Move gesture. Doesn't finish until the event receiver calls
		# finish() on its received event.
		# 
		# Like:
		# addEvent 'persistent-move-end', e
		# 	e.finish()
		defineGesture

			name: 'move-persistent'

			extends: 'move'

			init: (h) ->

				@constructor.__super__.init.apply @, arguments
				# @__proto__.__super__.init.apply @, arguments

			shouldFinish: -> false

			start: (h, e, isFirst) ->

				if e.touches.length is 1 and not isFirst
					if h.isTouchInsideElement e.touches[0]
						@_initFromEvent h, e

					else
						h.restartFromEvent e

				else
					@constructor.__super__.start.apply @, arguments
					
			end: (h, e) ->

				if e.touches.length is 0

					h.fireCustom @name + ':release',

						finish: h.forceFinish
				
				@constructor.__super__.end.apply @, arguments