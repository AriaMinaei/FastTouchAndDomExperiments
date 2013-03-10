define ->
	return (defineGesture) ->
		
		# Defining a new gesture called 'tap'
		defineGesture

			name: 'tap'

			tap_time: 250

			check: (h) ->

				# Not this event, if had more than one finger on screen, or moved the finger more than
				# a few pixels
				return -1 if h.starts isnt 1 or h.hadRealMove

				# If last event wasn't touchend, cant know yet.
				return 0 if h.lastEventType isnt 'end'

				# If touch was held longer than 300ms, then its not a tap
				return -1 if h.lastEvents.end.timeStamp - h.firstEvent.timeStamp > @tap_time

				# Alright, its a tap!
				return 1

			end: (h, e) ->

				# Fire a tap event
				h.fire({})