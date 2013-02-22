require ['domReady', 'gesture/handler', 'dommy/dambo', 'dommy/dommy', 'benchmark'], (dr, GestureHandler, Dambo, Dommy, Benchmark) ->
	window.dambo = new Dambo
	window.dommy = new Dommy

	dambo.forThe('scroll-wrapper')
		.addLazy 'scroll', (id, dommy) ->
			console.log('initializing scroller')
			{
				baloon: 'is mine'
			}

		.addEvent 'move', (e, id, el, dommy) ->
			dommy.getLazy(id, 'scroll').scroll(e.translateX, e.translateY)

		.addEvent 'move-end', (e, id, el, dommy) ->
			dommy.getLazy(id, 'scroll').commit()

	GestureHandler.create()

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