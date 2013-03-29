require ['domReady', 'benchmark', 'graphics/lightmatrix', 'native'], (domReady, Benchmark, LightMatrix) ->


	dummyDiv = document.createElement 'div'

	document.body.appendChild dummyDiv

	cssToMatrix = (css) ->

		dummyDiv.style.webkitTransform = css

		Base.fromString getComputedStyle(dummyDiv).webkitTransform
	
	domReady ->

		# To quickly benchmark different possible approaches on stuff
		do ->
			suite = new Benchmark.Suite

			

			l = new LightMatrix
			w = new WebKitCSSMatrix


			suite.add 'l', ->

				l.rotate 1, 2, 3
				l.toCss()

			suite.add 'w', ->

				w = w.rotate 1, 2, 3
				w.toString()

			suite.on 'cycle', (e) ->

				console.log String e.target

			suite.on 'complete', ->

				console.log l, w

				console.log 'Fastest:',  @filter('fastest').pluck('name')[0]

			window.run = ->

				suite.run

					async: true

				return null