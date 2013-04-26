define ->

	class Transform

		constructor: (@el)->

			@currentTransform = 

				tX: 0
				tY: 0
				tZ: 0


		toState: (x, y)->

			@currentTransform.tX = parseFloat x
			@currentTransform.tY = parseFloat y
			@currentTransform.tZ = 0

			do @_applyToElement


		_applyToElement: ->

			@el.style.webkitTransform = "translate3d(#{@currentTransform.tX.toFixed(5)}px, #{@currentTransform.tY.toFixed(5)}px, #{@currentTransform.tZ.toFixed(5)}px)"

