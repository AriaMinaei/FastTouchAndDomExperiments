if typeof define isnt 'function' then define = require('amdefine')(module)

define ->
	return (defineGesture) ->
		
		# 'hold' gesture
		defineGesture

			name: 'hold'
		
			hold_time: 250

			check: (h) ->

				return -1 if h.starts isnt 1 or h.hadRealMove

				return 0 if h.lastEventType isnt 'end' or
					h.lastEvents.end.timeStamp - h.firstEvent.timeStamp < @hold_time

				return 1

			end: (h, e) ->

				h.fire({})