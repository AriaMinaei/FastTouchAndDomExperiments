define ['graphics/transitions', 'native'], (Transitions) ->

	cache = 
		stretch: 
			0: 0
		unstretch: 
			0: 0

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

			# Free space to wiggle in.
			@space = parseInt options.space

			# How big is the scrolling element (the child one).
			@size = parseInt options.size

			@min = 0
			if @size > @space
				@min = - ( @size - @space )

			@max = 0

			# Current delta.
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

			# puller delta.
			@_puller = @props.delta

			# If we converted puller to delta, would it give the same
			# result as the current delta?
			@_pullerInSync = yes

			# To guess current velocity based on the last three moves.
			@_velocityRecords = []

			# Last velocity on the last animation frame.
			@_lastV = 0
			@_lastT = 0

			# An easing function used when scroller is stretching out
			# of bounds.
			@_stretchEasingFunction = Transitions.quint.easeOut

			@_maxStretch = 1200

			if cache.stretch[@_maxStretch] is undefined
				cache.stretch[@_maxStretch] = {}

			@_stretchCache = cache.stretch[@_maxStretch]

			if cache.unstretch[@_maxStretch] is undefined
				cache.unstretch[@_maxStretch] = {}

			@_unstretchCache = cache.unstretch[@_maxStretch]

			@_stretchedMax = 0
			
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

		_stretch: (puller) ->

			# Limit the puller to maximum stretch
			puller = Math.min puller, @_maxStretch

			cached = @_stretchCache[puller]

			if cached is undefined

				do @_cacheStretches

				return @_stretchCache[puller] || 0

			else

				return cached

		_unstretch: (stretched) ->

			stretched = Math.min Math.round(stretched), @_stretchedMax

			cached = @_unstretchCache[stretched]

			if cached is undefined

				do @_cacheStretches

				return @_unstretchCache[stretched] || 0

			else

				return cached

		_cacheStretches:  ->

			# The stretched delta
			stretched = 0

			# See the loop
			current = 0

			loop

				break if current > @_maxStretch

				stretched += 1.0 - @_stretchEasingFunction(current / @_maxStretch)

				@_stretchCache[current] = stretched

				@_unstretchCache[Math.round stretched] = current

				current++

			@_stretchedMax = stretched

		_syncPuller: ->

			@_puller = @_stickyToPuller @props.delta
			@_pullerInSync = yes

		# For when the finger is released. It'll calculate velocity, and
		# if it should still be moving, it'll call @scroller.needAnimation()
		release: () ->

			@_setLastVelocity @_getRecordedVelocity()

			@_pullerInSync = no

			do @animate

		# Called by a scroller's animationFrame function
		animate: () ->

			# Last x.
			x0 = @props.delta

			# Last velocity.
			v0 = @_lastV

			# Elapsed time.
			deltaT = Date.now() - @_lastT

			# Do a step with the current deltaT.
			{x, v} = @_animStep x0, v0, deltaT

			# If the movement has been more than 10pixels...
			if x - x0 > 10

				# ... we should calculate the movement in smaller steps to
				# get more accurate results.
				smallerDeltaT = deltaT / 4

				x = x0

				v = v0

				for i in [1..4]

					{x, v} = @_animStep x, v, smallerDeltaT

			# Update the velocity.
			@_setLastVelocity v

			# Update the delta.
			@props.delta = x

			# Only not ask for animation if:
			# 
			# we're inside the bounds, AND
			# 	velocity is close to zero, OR
			# 	there has been change in velocity direction.
			# 	
			unless @min < x < @max and v * v0 < 0.001

				do @askForAnimation

			null

		_animStep: (x0, v0, deltaT) ->

			ret = 
				x: 0
				v: 0
			
			if x0 < @min

				ret.x = x0

			else if x0 > @max

				

			else

				deltas = @_deltasForInside v0, deltaT

				ret.x = x0 + deltas.deltaX

				ret.v = v0 + deltas.deltaV

			ret


		_deltasForInside: (v0, deltaT) ->

			direction = parseFloat(Math.unit v0)

			friction = -direction * 0.031 * Math.min(Math.abs(v0), 0.1)
			# friction = -direction * 0.003

			deltaV = friction * deltaT

			ret = 
				deltaX: 0.5 * deltaV * deltaT + v0 * deltaT
				deltaV: deltaV

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

					v = (last.d - first.d) / (last.t - first.t) / 1.1

			do @_clearVelocityRecords

			v = 0 unless (Math.abs v) > @velocityThreshold
				
			return v

		_clearVelocityRecords: ->

			@_velocityRecords.length = 0

		_setLastVelocity: (v) ->
			@_lastV = v
			@_lastT = Date.now()