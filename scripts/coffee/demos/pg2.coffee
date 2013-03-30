require ['domReady', 'native'], (domReady) ->

	class Transformer

		constructor: ->

			@tX = @tY = @tZ = @rX = @rY = @rZ = 0

			@p = 100000

		translate: (@tX, @tY, @tZ) ->

		rotate: (@rX, @rY, @rZ) ->

		perspective: (@p) ->

		applyTo: (el) ->

			tr = "translate3d(#{@tX}px, #{@tY}px, #{@tZ}px) " +

				"perspective(#{@p}) " +

				"rotate3d(1, 0, 0, #{@rX}rad) " +

				"rotate3d(0, 1, 0, #{@rY}rad) " +

				"rotate3d(0, 0, 1, #{@rZ}rad) "

			console.log tr

			el.style.webkitTransform = tr

	dad = document.querySelector '.dad'

	_dot = document.createElement 'div'

	_dot.classList.add 'dot'

	getDot = ->

		_dot.cloneNode()
	
	domReady ->

		num = 16

		r = 316

		c = 
			x: 1500
			y: 500
			z: 0

		for i in [0...num]

			for j in [0...num]

				teta = i / num * Math.PI * 2

				phi  = j / num * Math.PI * 2

				x = (r * Math.cos(teta) * Math.cos(phi)).toFixed(2)
				z = (r * Math.sin(teta) * Math.cos(phi)).toFixed(2)
				y = (r * Math.sin(phi)).toFixed(2)

				# x = (r * Math.cos teta).toFixed(2)
				# z = (r * Math.sin teta).toFixed(2)

				# y = (x * Math.sin phi).toFixed(2)
				# x = (x * Math.cos phi).toFixed(2)

				dot = getDot()

				t = new Transformer

				t.translate(x + c.x, y + c.y, z + c.z)
				
				t.rotate(0,  Math.atan( x / z ), Math.atan(x / y))

				t.applyTo dot

				dad.appendChild dot

