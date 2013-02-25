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

			# Current delta
			if options.d
				@props.d = parseInt d

			# Current stretch
			if options.stretch
				@props.stretch = parseInt stretch

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

			newDelta = @props.d + delta

			if newDelta > 0
				@props.stretch += newDelta
				newDelta = 0
			else if newDelta < @minDelta
				@props.stretch += newDelta - @minDelta
				newDelta = @minDelta

			@props.d = newDelta

		
		# For when the finger is released. It'll calculate velocity, and
		# if it should still be moving, it'll call @scroller.needAnimation()
		release: () ->

			v = do @_getRecordedVelocity

			console.log v

			if v
				@_lastVelocity.v = v
				@_lastVelocity.t = Date.now()

				do @askForAnimation

		# Called by a scroller's animationFrame function
		animate: () ->

			v = @_lastVelocity.v
			deltaT = Date.now() - @_lastVelocity.t

			@_setLastVelocity v

			newDelta = @props.d +  v * deltaT

			needMoreAnimation = yes

			if newDelta > 0
				@props.stretch += newDelta
				newDelta = 0
				needMoreAnimation = no

			else if newDelta < @minDelta
				@props.stretch += newDelta - @minDelta
				newDelta = @minDelta
				needMoreAnimation = no

			@props.d = newDelta

			do @askForAnimation if needMoreAnimation


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