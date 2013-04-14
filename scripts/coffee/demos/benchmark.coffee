require ['domReady', 'benchmark'], (domReady, Benchmark) ->
	
	domReady ->

		# To quickly benchmark different possible approaches on stuff
		do ->
			suite = new Benchmark.Suite

			suite.add '1', ->

				

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