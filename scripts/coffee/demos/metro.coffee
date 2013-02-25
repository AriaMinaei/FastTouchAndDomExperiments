require ['domReady', 'gesture/handler', 'dommy/dambo', 'dommy/dommy', 'type/scrolls', 'benchmark'], (dr, GestureHandler, Dambo, Dommy, Scrolls, Benchmark) ->
	window.dambo = new Dambo
	window.dommy = new Dommy
	GestureHandler.create()


	dambo.forThe('scrolls')
		.addLazy 'scrolls', (id, dommy) ->
			new Scrolls(id, dommy)

		.addEvent 'move-persistent', (e, id, el, dommy) ->
			dommy.getLazy(id, 'scrolls').scroll(e.translateX, e.translateY)

		.addEvent 'move-persistent:end', (e, id, el, dommy) ->
			# dommy.getLazy(id, 'scrolls').release(e.finish)
			dommy.getLazy(id, 'scrolls').release(e.finish)


	dr ->


		# To quickly benchmark different possible approaches on stuff
		# do ->
		# 	suite = new Benchmark.Suite

		# 	el = document.getElementById 'rogue-130'


		# 	suite.add 'both', ->
		# 		c = el.className
		# 		c = document.getElementById('rogue-130').className

		# 	suite.add 'ref', ->
		# 		c = el.className

		# 	suite.add 'id', ->
		# 		c = document.getElementById('rogue-130').className

		# 	suite.on 'cycle', (e) ->
		# 		console.log String(e.target)

		# 	suite.on 'complete', ->
		# 		console.log 'Fastest:', this

		# 	window.run = ->
		# 		suite.run
		# 			async: true

		# 		return null