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

				h.vars.shouldInitAgain = false

				@constructor.__super__.init.apply @, arguments
				# @__proto__.__super__.init.apply @, arguments

			shouldFinish: -> false

			start: (h, e) ->

				if e.touches.length is 1 and h.vars.shouldInitAgain
					# console.log 'initing again'
					@_initOnEvent h, e

			end: (h, e) ->

				if e.touches.length is 0
					h.vars.shouldInitAgain = true

					h.fireCustom @name + ':end',

						finish: h.forceFinish
				
				@constructor.__super__.end.apply @, arguments


	class A
		ft: ->
			super