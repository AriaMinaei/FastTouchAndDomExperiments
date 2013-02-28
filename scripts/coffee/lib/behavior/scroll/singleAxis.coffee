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

			@pullerMin = @min - 1000
			@pullerMax = @max + 1000

			# Current delta
			if options.delta
				@props.delta = parseInt options.delta

			@props.delta = 0 if not @props.delta

			# Note:
			# 
			# We have a @puller and a @props.delta.
			# 
			# @props.delta is the actual amount of scrolling
			# the current element has. It doesn't always increase/decrease
			# with touch movement, as the element might be getting pulled
			# out of its bounds.
			# 
			# But @puller always follows user's fingers. The its value will
			# be converted to @props.delta using a function that simulates
			# the sticky effect.

			# puller delta
			@puller = @props.delta

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

			@puller = @_limitPuller @puller + delta

			@props.delta = @_pullerToSticky @puller

		_pullerToSticky: (puller) ->

			if puller > @max
				return @max + @_stretch puller

			else if puller < @min
				return @min - @_stretch( - (puller - @min) )

			else
				return puller

		_stretch: (extra) ->

			extra / 5

		_syncPuller: ->



		# For when the finger is released. It'll calculate velocity, and
		# if it should still be moving, it'll call @scroller.needAnimation()
		release: () ->

			v = do @_getRecordedVelocity

			if v
				@_lastV = v
				@_lastT = Date.now()

				do @askForAnimation

				@_pullerInSync = no

		# Called by a scroller's animationFrame function
		animate: () ->

			v = @_lastV
			deltaT = Date.now() - @_lastT

			friction = 0.002
			if v > 0
				friction = -friction

			return if v is 0

			@puller +=  v * deltaT + (0.5 * friction * Math.pow(deltaT, 2))

			newV = deltaT * friction + v

			return if newV * v < 0 or Math.abs(newV) < 0.1

			@_setLastVelocity newV

			if @_numberInsidePullerBounds @puller
				do @askForAnimation

			@props.delta = @_pullerToSticky @puller

		_limitPuller: (puller) ->

			if puller > @pullerMax
				@pullerMax
			else if puller < @pullerMin
				@pullerMin
			else
				puller

		_numberInsidePullerBounds: (puller) ->

			return puller is @_limitPuller puller

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

		_getRecordedVelocity: () ->

			length = @_velocityRecords.length

			if length < 2
				v = 0
			else
				first = @_velocityRecords[0]
				last  = @_velocityRecords[length - 1]
				v = (last.d - first.d) / (last.t - first.t)

			do @_clearVelocityRecords

			v = 0 unless (Math.abs v) > @velocityThreshold
				
			v

		_clearVelocityRecords: () ->

			@_velocityRecords.length = 0

		_setLastVelocity: (v) ->
			@_lastV = v
			@_lastT = Date.now()

		# _stretchToTranslate: (from) ->

		# 	if from < 0 then m = -1 else m = 1
		# 	from = Math.abs from
		# 	m * from / ( Math.pow(from / 1000 + 1, 4) )