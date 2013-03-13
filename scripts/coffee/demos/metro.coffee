require ['domReady', 'gesture/handler', 'dommy/dambo', 'dommy/dommy', 'type/scrolls', 'benchmark', 'graphics/transitions'], (dr, GestureHandler, Dambo, Dommy, Scrolls, Benchmark, Transitions) ->
	window.dambo = new Dambo
	window.dommy = new Dommy
	GestureHandler.create()


	dambo.forThe('scrolls')
		.addLazy 'scrolls', (id, dommy) ->

			new Scrolls(id, dommy)

		.addEvent 'move-persistent', (e, id, el, dommy) ->

			dommy.getLazy(id, 'scrolls').drag(e.translateX, e.translateY)

		.addEvent 'move-persistent:release', (e, id, el, dommy) ->

			# dommy.getLazy(id, 'scrolls').release(e.finish)
			dommy.getLazy(id, 'scrolls').release(e.finish)

		.addEvent 'move-persistent:finish', (e, id, el, dommy) ->

			# dommy.getLazy(id, 'scrolls').release(e.finish)
			# dommy.getLazy(id, 'scrolls').release(e.finish)
			dommy.getLazy(id, 'scrolls').finish()


	dr ->


		# To quickly benchmark different possible approaches on stuff
		# do ->
		# 	suite = new Benchmark.Suite


		# 	suite.add 'stretch', ->

		# 	suite.on 'cycle', (e) ->
		# 		console.log String(e.target)

		# 	suite.on 'complete', ->
		# 		console.log 'Fastest:', this

		# 	window.run = ->
		# 		suite.run
		# 			async: true

		# 		return null