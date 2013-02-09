throw Error "Gesture object isn't initialized" if not @Dommy or not @Dommy.Gesture

# Some aliasing
Gesture = @Dommy.Gesture
define = Gesture.define
Definition = Gesture.Definition

# Defining a new gesture called 'tap'
define 'tap', class extends Definition
	tap_time: 250

	check: () ->
		# Not this event, if had more than one finger on screen, or moved the finger more than
		# a few pixels
		return -1 if @handler.starts isnt 1 or @handler.hadRealMove

		# If last event wasn't touchend, cant know yet.
		return 0 if @handler.lastEventType isnt 'end'

		# If touch was held longer than 300ms, then its not a tap
		return -1 if @handler.lastEvents.end.timeStamp - @handler.firstEvent.timeStamp > @tap_time

		# Alright, its a tap!
		return 1

	end: (e) ->
		# Fire a tap event
		@handler.fire({})

# 'hold' gesture
define 'hold', class extends Definition
	hold_time: 250
	check: () ->
		return -1 if @handler.starts isnt 1 or @handler.hadRealMove

		return 0 if @handler.lastEventType isnt 'end' or
			@handler.lastEvents.end.timeStamp - @handler.firstEvent.timeStamp < @hold_time

		return 1

	end: (e) ->
		@handler.fire({})

# Move gesture, always captures
define 'instantmove', class extends Definition
	check: () ->
		return 1
	move: (e) ->
		@handler.fire 
			translateX: e.touches[0].screenX - @handler.firstEvent.touches[0].screenX
			translateY: e.touches[0].screenY - @handler.firstEvent.touches[0].screenY
	finish: () ->
		@handler.fireCustom 'instantmove-end', {}


# Transform gesture
define 'tranform', class extends Definition