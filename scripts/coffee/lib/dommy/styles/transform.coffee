if typeof define isnt 'function' then define = require('amdefine')(module)

define ['graphics/fastMatrix'], (FastMatrix) ->

	class DommyStylesTransform

		constructor: (@dommy, @fastId, el) ->

			if @original = @dommy._get(@fastId, 'style.transform.original')

				@current = @dommy._get(@fastId, 'style.transform.current')
				@temp 	 = @dommy._get(@fastId, 'style.transform.temp')

			else

				@original = new FastMatrix(getComputedStyle(el).webkitTransform)
				@dommy._set(@fastId, 'style.transform.original', @original)

				@current = @original.copy()
				@dommy._set(@fastId, 'style.transform.current', @current)

				@temp = @original.copy()
				@dommy._set(@fastId, 'style.transform.temp', @temp)

			# 0 for temp
			# 1 for current
			# 2 for original
			@active = 1

		temporarily: ->

			# Load current matrix into our temp matrix
			@temp.fromMatrix @current

			# Remember that temp is active
			@active = 0

			# Let the user manipulate it
			@temp

		originally: ->

			@active = 2
			@original

		currently: ->

			@active = 1
			@current

		apply: (el) ->

			switch @active

				when 0 then el.style.webkitTransform = @temp.toString()

				when 1 then el.style.webkitTransform = @current.toString()

				when 2 then el.style.webkitTransform = @original.toString()
			@

		commit: (el) ->

			@apply(el)

			switch @active

				when 0
					@current.fromMatrix @temp
					
				when 2
					@current.fromMatrix @original

			@active = 1
			@

		revertToCurrent: (el) ->

			@currently()
			@commit(el)

		revertToOriginal: (el) ->

			@originally()
			@commit(el)