require ['domReady', 'benchmark', 'graphics/lightmatrix', 'graphics/lightmatrix/base','graphics/matrix3d/base', 'native'], (domReady, Benchmark, LightMatrix, Base, OldBase) ->

	dummyDiv = document.createElement 'div'

	document.body.appendChild dummyDiv

	cssToMatrix = (css) ->

		dummyDiv.style.webkitTransform = css

		Base.fromString getComputedStyle(dummyDiv).webkitTransform
	
	domReady ->

		# To quickly benchmark different possible approaches on stuff
		do ->
			suite = new Benchmark.Suite

			w = Base.identity()

			i = [
				1,0,0,0,
				0,1,0,0,
				0,0,1,0,
				0,0,0,1
			]

			suite.add '1', ->

				Base.toCss w

			suite.add '2', ->

			suite.on 'cycle', (e) ->

				console.log String e.target

			suite.on 'complete', ->

				console.log Base.toCss(w) is 'matrix3d(' + i.join(', ') + ')'

				console.log 'Fastest:',  @filter('fastest').pluck('name')[0]

			window.run = ->

				suite.run

					async: true

				return null