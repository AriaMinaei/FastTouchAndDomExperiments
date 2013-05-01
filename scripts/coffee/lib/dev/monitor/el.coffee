define ->

	class MonitorEl

		constructor: (@title, @value = 0) ->

			do @_prepare

		_prepare: ->

			@el = document.createElement 'div'
			@el.classList.add 'monitor-el'

			@_titleEl = document.createElement 'span'
			@_titleEl.classList.add 'monitor-el-title'

			@el.appendChild @_titleEl

			do @_updateTitle

			@_valueEl = document.createElement 'span'
			@_valueEl.classList.add 'monitor-el-value'

			@el.appendChild @_valueEl

			do @_updateValue

		_updateTitle: ->

			@_titleEl.innerHTML = @title

		_updateValue: ->

			@_valueEl.innerHTML = @value

		set: (@value) ->

			do @_updateValue