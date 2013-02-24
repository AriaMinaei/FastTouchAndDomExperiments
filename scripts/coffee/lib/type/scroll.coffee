define ['native'], ->
	# A collection of Range-s, with some useful methods.
	class Ranges
		constructor: (toAdd) ->

			@ranges = []
			@currentRange = 0
			@lastNum = null

			if toAdd
				@add toAdd

		# Adds a single Range or an array of Range-s to the stack.
		# Doesn't do any type checking or ordering. If you absolutely can't
		# give it sorted ranges, then just after adding them, call sort()
		add: (toAdd) ->

			if toAdd instanceof Range
				toAdd.setRanges @
				@ranges.push toAdd
				return

			@ranges.push range for range in toAdd

		# Sorts the ranges to increase performance.
		sort: ->

			@ranges.sort (a, b) ->
				return 0 if a.from is b.from
				if a.from > b.from
					return 1
				else
					return -1
		
		# Get the correct range for this number
		get: (num) ->

			step = 1
			if @currentRange isnt 0 and num < @lastNum
				step = -1

			i = @currentRange
			while range = @ranges[i]
				if range.includes num
					@lastNum = num
					@currentRange = i
					return range
				i += step

	# Little helper class
	class Range
		constructor: (@from, @to) ->

		setRange: (@from, @to) ->

		setRanges: (@ranges) ->

		includes: (num) ->

			return true if @from <= num <= @to
			false

		_howMuchOutside: (num) ->

			return num - @from if num < @from
			return num - @to   if num > @to
			return 0


	class Scroll
		constructor: (@id, @dommy) ->

			# Our scroller element
			@el = @dommy.el @id

			# Default options
			@options = 
				axis: 'both'

			# Load more options from the data-attrs of @el
			# Example:
			# <div data-types="scroll" data-scroll-options='"axis":"x"'>
			@options = Object.append @options,
				JSON.parse '{' + @el.getAttribute('data-scroll-options') + '}'

			# To make sure we only scroll in the desired axis
			@_axisMultiplier =
				x: 1
				y: 1

			# for x/y -only axis configs
			if @options.axis is 'x' then @_axisMultiplier.y = 0
			else if @options.axis is 'y' then @_axisMultiplier.x = 0

			# Reference to dimensions
			@_rects = rects = @el.getBoundingClientRect()
			@_width = rects.width
			@_height = rects.height

			# Child element's references
			@_child = @el.children[0]
			@_childId = @dommy.fastId @_child
			@_transform = @dommy.styles.getTransform @_childId, @_child

			# Child element's dimensions
			childRects = @_child.getBoundingClientRect()
			@_childWidth = childRects.width
			@_childHeight = childRects.height

			# Where does the scroll get out of bounds (gets harder to pull)
			@_outOfBoundScrollBeginX = 0
			@_outOfBoundScrollEndX = - (@_childWidth - @_width)

			# Scroll coords for the last time commit() was called
			@_lastCommitedScrollX = 0

			# Current scroll
			@x = 0

			# console.log @scrollModifiersX

		# Called when fingers are on screen, moving around.
		scroll: (x, y) ->

			intendedScrollX = @_lastCommitedScrollX + x

			if intendedScrollX > @_outOfBoundScrollBeginX
				realX = @_outOfBoundScrollBeginX +
					@_curveOutOfBoundScroll intendedScrollX - @_outOfBoundScrollBeginX

			else if intendedScrollX < @_outOfBoundScrollEndX
				realX = @_outOfBoundScrollEndX -
					@_curveOutOfBoundScroll(-(intendedScrollX - @_outOfBoundScrollEndX))

			else
				realX = intendedScrollX


			@_setTranslate(realX, 0)

		_curveOutOfBoundScroll: (n) ->

			temp = Math.limit n, 0, 800
			curve = Math.sin Math.PI / 2 * temp / 800
			temp / (1 + ( 2 * curve ) )

		# Called when touch is released. It will do the slipping thing.
		release: () ->

			@_lastCommitedScrollX = @x

			@_transform.commit(@_child)

		# transform.translate the child element by x/y pixels to the left/bottom
		_translate: (x, y) ->

			@x = @_lastCommitedScrollX + x

			@_transform.temporarily().translate(x, 0)
			@_transform.apply(@_child)

		_setTranslate: (x, y) ->

			@x = x

			@_transform.temporarily().setTranslate(x, 0)
			@_transform.apply(@_child)