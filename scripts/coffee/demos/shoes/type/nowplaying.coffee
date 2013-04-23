if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	class NowPlaying

		constructor: (@id, @dommy) ->

			@el = @dommy.el @id

			console.log @el