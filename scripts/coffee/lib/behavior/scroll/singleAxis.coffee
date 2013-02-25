define ['native'], ->

	class SingleAxisScroller

		###
		 * @param  {Object} @props 	Reference to an object where
		 * this scroller can keep and update the current
		 * delta and stretch.
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

			@minDelta = 0
			if @size > @space
				@minDelta = - ( @size - @space )

			@maxDelta = 0

			@realMinDelta = @minDelta - 1000
			@realMaxDelta = @maxDelta + 1000

			# Current delta
			if options.delta
				@props.delta = parseInt options.delta

			if not @props.delta then @props.delta = 0

			# Real delta
			@realDelta = @props.delta

			# Current stretch
			if options.stretch
				@props.stretch = parseInt options.stretch

			if not @props.stretch then @props.stretch = 0

			# If velocity is lower than this number, it'll be considered zero.
			# In pixels/milliseconds
			@velocityThreshold = 1

			# To guess current velocity based on the last three moves
			@_velocityRecords = []

			# Last velocity on the last animation frame
			@_lastVelocity = 
				v: 0
				t: 0
			
			null

		scroll: (delta) ->

			@_recordForVelocity delta

			@realDelta = @_limitReal @realDelta + delta

			newProps = @_realToSticky @realDelta
			@props.delta = newProps.delta
			@props.stretch = newProps.stretch

		# For when the finger is released. It'll calculate velocity, and
		# if it should still be moving, it'll call @scroller.needAnimation()
		release: () ->

			v = do @_getRecordedVelocity

			# console.log v

			if v
				@_lastVelocity.v = v
				@_lastVelocity.t = Date.now()

				do @askForAnimation

		# Called by a scroller's animationFrame function
		animate: () ->

			v = @_lastVelocity.v
			deltaT = Date.now() - @_lastVelocity.t

			

			friction = 0.002
			if v > 0
				friction = -friction

			return if v is 0

			@realDelta +=  v * deltaT + (0.5 * friction * Math.pow(deltaT, 2))

			newV = deltaT * friction + v
			return if newV * v < 0 or Math.abs(newV) < 0.1
			@_setLastVelocity newV

			limitedRealDelta = @_limitReal @realDelta

			needMoreAnimation = yes

			if @realDelta isnt limitedRealDelta
				needMoreAnimation = no

			newProps = @_realToSticky @realDelta
			@props.delta = newProps.delta
			@props.stretch = newProps.stretch

			do @askForAnimation if needMoreAnimation

		_limitReal: (real) ->

			if real > @realMaxDelta
				@realMaxDelta
			else if real < @realMinDelta
				@realMinDelta
			else
				real

		_realToSticky: (real) ->
			sticky = 
				delta: 0
				stretch: 0

			if real > 0
				sticky.stretch = @_stretch real
			else if real < @minDelta
				sticky.stretch = @_stretch( real - @minDelta )
				sticky.delta = @minDelta
			else
				sticky.delta = real

			sticky

		_stretch: (real) ->
			real / 2

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
			@_lastVelocity.v = v
			@_lastVelocity.t = Date.now()