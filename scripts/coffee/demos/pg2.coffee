require ['domReady', 'benchmark', 'graphics/matrix3d', 'graphics/matrix3d/base', 'graphics/matrix3d/rotation', 'native'], (domReady, Benchmark, Matrix3d, Base, Rotation) ->


	dummyDiv = document.createElement 'div'
	document.body.appendChild dummyDiv

	cssToMatrix = (css) ->

		dummyDiv.style.webkitTransform = css

		Base.fromString getComputedStyle(dummyDiv).webkitTransform
	
	domReady ->

		# To quickly benchmark different possible approaches on stuff
		do ->
			suite = new Benchmark.Suite

			createObject = -> {x: 1, y: 2, z: 3}
			createArray = ->  [1, 2, 3]

			suite.add 'o', ->

				b = createObject()

			suite.add 'a', ->

				b = createArray()

			suite.on 'cycle', (e) ->

				console.log String(e.target)

			suite.on 'complete', ->

				console.log 'Fastest:',  @filter('fastest').pluck('name')[0]

			window.run = ->

				suite.run

					async: true

				return null