define ['native', 'dom'], ->
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

	class OneDirectionalScroller

		# pixels/milliseconds
		velocityThreshold: 2

		constructor: (@scroller, @containerWidth, @childWidth) ->

			# Where does the scroll get out of bounds (gets harder to pull)
			@freeScrollFrom = - (@childWidth - @containerWidth)
			@freeScrollTo = 0

			# Note:
			# When the user moves their fingers around to scroll, the scroller
			# doesn't always follow the fingers. Forexample, if the scroll goes
			# out of the parent's boundries, it slows down.
			# 
			# We hold references to the movement of the user's fingers in variables
			# prefixed with 'lastIntended', and the actual movements will be held in
			# variables prefixed with 'last'
			@lastCommited = 0
			@lastIntended = 0
			@lastCommitedIntended = 0

			# Current scroll
			@current = 0

			@_velocityRecords = []
			@_lastVelocity =
				t: 0
				v: 0

			# 0 -> scrolling
			# 1 -> slipping
			@mode = 0

		scroll: (howMuch) ->

			@mode = 0

			@_recordForVelocity howMuch
			
			intended = @lastIntended = @lastCommitedIntended + howMuch

			# If we're scrolling out of bounds to the right:
			if intended > @freeScrollTo
				current = @freeScrollTo +
					@_makeSticky intended - @freeScrollTo

			# ... or to the left:
			else if intended < @freeScrollFrom
				current = @freeScrollFrom -
					@_makeSticky(-(intended - @freeScrollFrom))

			# We're inside the boundries
			else
				# Follow user's finger
				current = intended

			@current = current
			current

		_recordForVelocity: (howMuch) ->

			if @_velocityRecords.length > 2
				@_velocityRecords.shift()

			@_velocityRecords.push
				x: howMuch
				t: Date.now()

		_recordedVelocity: () ->

			if @_velocityRecords.length < 2
				return 0
			else
				first = @_velocityRecords[0]
				last = @_velocityRecords[@_velocityRecords.length - 1]
				v = (last.x - first.x) / (last.t - first.t)
				return 0 if (Math.abs v) < @velocityThreshold
				return v

		release: () ->

			v = @_recordedVelocity()
			if v
				@_lastVelocity.v = v
				@_lastVelocity.t = Date.now()

				@scroller.needAnimation()

			@lastCommited = @current
			@lastCommitedIntended = @lastIntended

		animate: () ->
			@scroller.needAnimation()

			x = 1

			@current += x

			x

		# Curving the movement when going out of bounds
		_makeSticky: (n) ->

			# There is absolutely no logical reason why these values and
			# formulas are used! I just played around with some different
			# combinations, and this one felt better!
			temp = Math.limit n, 0, 1500
			curve = Math.square(1 + temp / 1500) - 1
			temp / (1 + ( 2 * curve ) )

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
			@axis =
				x: 1
				y: 1

			# for x/y -only axis configs
			if @options.axis is 'x' then @axis.y = 0
			else if @options.axis is 'y' then @axis.x = 0

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

			@scrollerX = new OneDirectionalScroller @, @_width , @_childWidth
			@scrollerY = new OneDirectionalScroller @, @_height, @_childHeight

			@_animFrame = 0
			@_boundAnimFunction = @_animFunction.bind @

		# Called when fingers are on screen, moving around.
		scroll: (x, y) ->

			@cancelAnimation()

			if not @axis.x
				x = 0
			else x = @scrollerX.scroll(x)

			if not @axis.y
				y = 0
			else y = @scrollerY.scroll(y)

			# Translate the child element
			@_setTranslate x, y

		# Called when touch is released. It will do the slipping thing.
		release: () ->

			if @axis.x
				@scrollerX.release()

			if @axis.y
				@scrollerY.release()

			@_transform.commit(@_child)

		needAnimation: () ->

			unless @_animFrame
				@_animFrame = requestAnimationFrame @_boundAnimFunction

		cancelAnimation: () ->

			if @_animFrame
				cancelAnimationFrame(@_animFrame)
				@_animFrame = 0

		_animFunction: () ->

			@_animFrame = 0

			x = 0
			if @axis.x
				x = @scrollerX.animate()

			y = 0
			if @axis.y
				y = @scrollerY.animate()

			@_translate x, y
			@_transform.commit(@_child)

		# transform.translate the child element by x/y pixels to the left/bottom
		_translate: (x, y) ->

			@_transform.temporarily().translate(x, y)
			@_transform.apply(@_child)

		# transform.setTranslate the child element to x/y
		_setTranslate: (x, y) ->

			@_transform.temporarily().setTranslate(x, y)
			@_transform.apply(@_child)