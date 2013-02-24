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

	class Range.ScrollInside extends Range
		scroll: (starting, howMuch) ->
			# console.log 'inside'
			unless @includes starting
				# console.log 'starting ' + starting + ' is out of our range.'
				return @ranges.get(starting).scroll(starting, howMuch, @ranges)

			outside = @_howMuchOutside starting + howMuch

			return howMuch if not outside
			# console.log "we're " + outside + " pixels out of range"
			return howMuch

			# return @ranges.get(starting + howMuch - outside).scroll(starting + howMuch - outside, outside, @ranges)
		
	class Range.ScrollOutside extends Range
		# direction is either 1 (rightward motion will be slowed down),
		# or -1 (leftward motion gets slowed down).
		constructor: (@from, @to, @slowDirection = 1) ->
			super

		_multiplier: 0.1

		_determineMovement: (howMuch) ->

			if howMuch * @slowDirection >= 0
				return howMuch * @_multiplier
			else
				return howMuch

		scroll: (starting, howMuch) ->
			# console.log 'outside ' + howMuch + ', ' + @_determineMovement howMuch
			return @_determineMovement howMuch

			unless @includes starting
				return @ranges.get(starting).scroll(starting, howMuch, @ranges)

			movement = @_determineMovement howMuch

			outside = @_howMuchOutside starting + movement

			return movement if not outside

			startsNext = starting + movement - outside

			return @ranges.get(startsNext).scroll(startsNext, starting + howMuch - startsNext, @ranges)


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

			childRects = @_child.getBoundingClientRect()
			@_childWidth = childRects.width
			@_childHeight = childRects.height

			@_determinescrollModifiers()

			@x = 0
			@y = 0
			@_lastTranslateX = 0
			@_lastTranslateY = 0
			@_lastScrollX = 0
			@_lastScrollY = 0

			# console.log @scrollModifiersX

		_determinescrollModifiers: ->

			@scrollModifiersX = new Ranges()


			inRangeX = @_childWidth  - @_width

			if inRangeX < 0 then inRangeX = 0

			@scrollModifiersX.add new Range.ScrollOutside -inRangeX - 5000, -inRangeX - 1, -1

			@scrollModifiersX.add new Range.ScrollInside -inRangeX, 0

			@scrollModifiersX.add new Range.ScrollOutside 0, 5000, 1

		# Called when fingers are on screen, moving around.
		scroll: (x, y) ->		

			diffX = x - @_lastScrollX
			@_lastScrollX = x

			diffX *= @_axisMultiplier.x

			realX = 0
			if diffX
				# console.log 'Scrolling X from ' + @x + ' by ' + diffX
				realX = @scrollModifiersX.get(@x).scroll(@x, diffX)
				# console.log 'returned', diffX, realX
				# realX = diffX
				@x += realX


			@_translate(realX, 0)

		# Called when touch is released. It will do the slipping thing.
		release: () ->

			@_lastTranslateX = 0
			@_lastTranslateY = 0

			@_lastScrollX = 0
			@_lastScrollY = 0

			@_transform.commit(@_child)

		# transform.translate the child element X/Y pixels to the left
		_translate: (x, y) ->

			@_lastTranslateX += x
			@_lastTranslateY += y

			@_transform.temporarily().translate(@_lastTranslateX, @_lastTranslateY)
			@_transform.apply(@_child)