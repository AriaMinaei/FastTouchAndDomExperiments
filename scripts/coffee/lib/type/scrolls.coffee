define ['behavior/scroll/singleAxis', 'native', 'dom'], (SingleAxisScroller) ->

	class Scrolls

		constructor: (@id, @dommy) ->

			# Our scroller element
			@parentEl = @dommy.el @id

			# Default options
			@options = 
				axis: 'both'

			# Load more options from the data-attrs of @parentEl
			# Example:
			# <div data-types="scroll" data-scroll-options='"axis":"x"'>
			@options = Object.append @options,
				JSON.parse '{' + @parentEl.getAttribute('data-scroll-options') + '}'

			# To make sure we only scroll in the desired axis
			@_enabledAxis =
				x: 1
				y: 1

			# for x/y -only axis configs
			if @options.axis is 'x' then @_enabledAxis.y = 0
			else if @options.axis is 'y' then @_enabledAxis.x = 0

			# Reference to dimensions
			parentRects = @parentEl.getBoundingClientRect()

			# Child element's references
			@_childEl = @parentEl.children[0]
			@_childElId = @dommy.fastId @_childEl
			@_transform = @dommy.styles.getTransform @_childElId, @_childEl

			# Child element's dimensions
			childRects = @_childEl.getBoundingClientRect()

			# Single
			boundNeedAnimation = @_scrollerAskedForAnimation.bind @

			@propsX = 
				d: 0
				stretch: 0

			@_scrollerX = new SingleAxisScroller @propsX, boundNeedAnimation, 
				size: childRects.width
				space: parentRects.width

			@_lastScrollX = 0

			@propsY = 
				d: 0
				stretch: 0

			@_scrollerY = new SingleAxisScroller @propsY, boundNeedAnimation, 
				size: childRects.height
				space: parentRects.height

			@_lastScrollY = 0

			# Animation frame reference
			@_animFrame = 0

			# This function gets called by window.requestAnimationFrame()
			@_boundAnimFunction = @_animFunction.bind @
			

		# Called when fingers are on screen, moving around.
		scroll: (x, y) ->


			@_cancelAnimation()

			if @_enabledAxis.x
				@_scrollerX.scroll x - @_lastScrollX
				@_lastScrollX = x


			if @_enabledAxis.y
				@_scrollerY.scroll y - @_lastScrollY
				@_lastScrollY = y

			# Translate the child element
			do @_transformElement

		# Called when touch is released. It will do the slipping thing.
		release: () ->

			if @_enabledAxis.x
				@_scrollerX.release()
				@_lastScrollX = 0

			if @_enabledAxis.y
				@_scrollerY.release()
				@_lastScrollY = 0

		_scrollerAskedForAnimation: () ->

			unless @_animFrame
				@_animFrame = requestAnimationFrame @_boundAnimFunction

		_cancelAnimation: () ->

			if @_animFrame
				cancelAnimationFrame(@_animFrame)
				@_animFrame = 0

		_animFunction: () ->

			@_animFrame = 0

			if @_enabledAxis.x
				@_scrollerX.animate()

			if @_enabledAxis.y
				@_scrollerY.animate()

			# Translate the child element
			do @_transformElement

		_transformElement: () ->

			x = 0
			if @_enabledAxis.x
				x = @propsX.d

			y = 0
			if @_enabledAxis.y
				y = @propsY.d

			@_setTranslate x, y

		# transform.setTranslate the child element to x/y
		_setTranslate: (x, y) ->

			@_transform.currently().setTranslate(x, y)
			@_transform.commit(@_childEl)