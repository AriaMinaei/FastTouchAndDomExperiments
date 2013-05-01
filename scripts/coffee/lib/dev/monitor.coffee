define ['./monitor/el'], (El) ->

	class Monitor

		constructor: ->

			@container = document.createElement 'div'
			@container.classList.add 'monitor'

			@_deployed = no

			@_data = {}

		deploy: (into = document.querySelector 'body') ->

			unless @_deployed

				into.appendChild @container

				@_deployed = yes

			@

		set: (name, value) ->

			unless @_data[name]

				@_createEl name

			@_data[name].value = value
			@_data[name].el.set value

			@

		_createEl: (name) ->

			if @_data[name]

				throw Error "Duplicate element for '#{name}'"

			@_data[name] = 

				value: 0

				name: name

				el: new El name

			@container.appendChild @_data[name].el.el

			@

		@get: ->

			if not @instance

				@instance = new Monitor

			@instance