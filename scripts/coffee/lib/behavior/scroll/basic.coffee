define ['behavior/scroll/singleAxis', 'native'], (SingleAxisScroller)->

	class BasicScroller

		constructor: (axis, @fn) ->

			@axisScrollers = []
			@axisProps = []
			for single in axis
				props =
					d: 0
					stretch: 0

				@axisProps.push props

				@axisScrollers.push new SingleAxisScroller single, props, @

			null

		scroll: (deltas...) ->

			for delta in deltas
				@axisScrollers.scroll delta

			null

		release: () ->

			for scroller in @axisScrollers
				do scroller.release

			null