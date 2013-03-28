require ['domReady', 'benchmark', 'graphics/matrix3d', 'graphics/matrix3d/base', 'graphics/matrix3d/rotation', 'native'], (domReady, Benchmark, Matrix3d, Rotation, Base) ->


	Rotation = Matrix3d.Rotation

	dummyDiv = document.createElement 'div'
	document.body.appendChild dummyDiv

	cssToMatrix = (css) ->

		dummyDiv.style.webkitTransform = css

		Base.fromString getComputedStyle(dummyDiv).webkitTransform
	
	domReady ->

		# rad = 30 * Math.PI / 180

		# matrix = new Matrix3d
		# matrix.setRotation(1, 2, 3)

		# console.log matrix.generateMatrix()

		# console.log cssToMatrix('rotate3d(1, 0, 0, ' + 1 + 'rad) rotate3d(0, 1, 0, ' + 2 + 'rad) rotate3d(0, 0, 1, ' + 3 + 'rad)')

		# matrix = new Matrix3d

		# matrix.setPerspective 400

		# console.log matrix.generateMatrix()
	
		# To quickly benchmark different possible approaches on stuff
		do ->
			suite = new Benchmark.Suite

			a = [1, 2, 3, 4, 5, 6, 7, 8, 8, 7, 6, 5, 4, 3, 2, 1]

			d = 200

			rotation = new Rotation 1, 2, 3

			b = rotation.generateMatrix()

			suite.add 'cached', ->

				Base.multiply a, b

			suite.add 'uncached', ->

				Base.multiply a, rotation.generateMatrix()

			suite.on 'cycle', (e) ->
				console.log String(e.target)

			suite.on 'complete', ->
				console.log 'Fastest:',  @filter('fastest').pluck('name')[0]

			window.run = ->
				suite.run
					async: true

				return null