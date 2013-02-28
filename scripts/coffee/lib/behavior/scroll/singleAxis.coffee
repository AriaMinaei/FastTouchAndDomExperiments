define ['native'], ->

	class SingleAxisScroller

		###
		 * @param  {Object} @props 	Reference to an object where
		 * this scroller can keep and update the current
		 * delta.
		 *                                 
		 * @param  {Function} @askForAnimation This function gets called when
		 * this scroller needs to request an animation.
		 * 
		 * @param  {Object} options = {} Options - Look at the source
		###
		constructor: (@props, @askForAnimation, options = {}) ->

			# Free space to wiggle in
			@space = parseInt options.space

			# How big is the scrolling element (the child one)
			@size = parseInt options.size

			@min = 0
			if @size > @space
				@min = - ( @size - @space )

			@max = 0

			# Current delta
			if options.delta
				@props.delta = parseInt options.delta

			@props.delta = 0 if not @props.delta

			# Note:
			# 
			# We have a @_puller and a @props.delta.
			# 
			# @props.delta is the actual amount of scrolling
			# the current element has. It doesn't always increase/decrease
			# with touch movement, as the element might be getting pulled
			# out of its bounds.
			# 
			# But @_puller always follows user's fingers. The its value will
			# be converted to @props.delta using a function that simulates
			# the sticky effect.

			# puller delta
			@_puller = @props.delta

			# If we converted puller to delta, would it give the same
			# result as the current delta?
			@_pullerInSync = yes

			# If velocity is lower than this number, it'll be considered zero.
			# In pixels/milliseconds
			@velocityThreshold = 0.1

			# To guess current velocity based on the last three moves
			@_velocityRecords = []

			# Last velocity on the last animation frame
			@_lastV = 0
			@_lastT = 0
			
			return null

		drag: (delta) ->

			do @_syncPuller if not @_pullerInSync

			@_recordForVelocity delta

			@_puller = @_puller + delta

			@props.delta = @_pullerToSticky @_puller

		_pullerToSticky: (puller) ->

			if puller > @max
				return @max + @_stretch( puller - @max )

			else if puller < @min
				return @min - @_stretch( - (puller - @min) )

			else
				return puller

		_stickyToPuller: (sticky) ->

			if sticky > @max
				return @max + @_unstretch( sticky - @max )

			else if sticky < @min
				return @min - @_unstretch( - ( sticky - @min ) )

			else
				return sticky

		_stretch: (extra) ->

			extra / 5

		_unstretch: (stretched) ->

			stretched * 5

		_syncPuller: ->

			@_puller = @_stickyToPuller @props.delta
			@_pullerInSync = yes

		# For when the finger is released. It'll calculate velocity, and
		# if it should still be moving, it'll call @scroller.needAnimation()
		release: () ->

			v = @_getRecordedVelocity()

			if v
				@_lastV = v
				@_lastT = Date.now()

				do @askForAnimation

				@_pullerInSync = no

		# Called by a scroller's animationFrame function
		animate: () ->

			v = @_lastV
			deltaT = Date.now() - @_lastT

			friction = 0.001
			if v > 0
				friction = -friction

			return if v is 0

			currentDelta = @props.delta + v * deltaT + (0.5 * friction * Math.pow(deltaT, 2))

			if currentDelta < @min - 100
				currentDelta = @min - 100
			else if currentDelta > @max + 100
				currentDelta = @max + 100

			newV = deltaT * friction + v

			return if newV * v < 0

			@_setLastVelocity newV

			do @askForAnimation

			@props.delta = currentDelta

		_recordForVelocity: (delta) ->

			if @_velocityRecords.length is 0
				@_velocityRecords.push
					d: delta
					t: Date.now()
				return
			else
				@_velocityRecords.push
					d: delta + @_velocityRecords[@_velocityRecords.length - 1].d
					t: Date.now()

				if @_velocityRecords.length > 3
					do @_velocityRecords.shift

		_getRecordedVelocity: ->

			length = @_velocityRecords.length

			v = 0
			if length > 1
				first = @_velocityRecords[0]
				last  = @_velocityRecords[length - 1]

				# only calculate v if the there  has been at least one
				# touchmove in the last 50 milliseconds.
				if Date.now() - last.t < 50
					v = (last.d - first.d) / (last.t - first.t)

			do @_clearVelocityRecords

			v = 0 unless (Math.abs v) > @velocityThreshold
				
			return v

		_clearVelocityRecords: ->

			@_velocityRecords.length = 0

		_setLastVelocity: (v) ->
			@_lastV = v
			@_lastT = Date.now()