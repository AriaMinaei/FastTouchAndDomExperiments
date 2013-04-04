if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	Test = 

		eq: (a, b) ->

			if JSON.stringify(a) is JSON.stringify(b)

				console.log 'PASSED', a

			else

				console.error 'FAILED', a, b