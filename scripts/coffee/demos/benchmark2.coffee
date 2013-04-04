require ['domReady', 'benchmark', 'graphics/lightmatrix', 'native'], (domReady, Benchmark, LightMatrix) ->
	
	tofmals = 

		a : []

		b : []

		current: 'a'

	tofmalCurrent = 1

	tofmalAnim = (request) ->

		tofmals[tofmals.current].push request

	doTofmal = ->

		requests = tofmals[tofmals.current]

		tofmals.current = if tofmals.current is 'b' then 'a' else 'b'

		for request in requests

			do request
		
		requests.length = 0

		webkitRequestAnimationFrame doTofmal

	do doTofmal

	class Animate 

		constructor: (@el)->

			@matrix = new LightMatrix

		applyToEl: (css) ->

			@el.style.webkitTransform = css
			
		transition: (X, Y, duration, delay)->
			
			translate = @matrix.movement()

			
			oldX = parseInt translate.x
			oldY = parseInt translate.y

			distance = 

				X: X - oldX
				Y: Y - oldY


			startTime = Date.now() + delay

			animate = =>

				passed = Date.now() - startTime 

				progress = passed / duration

				if startTime < Date.now() #delay wait

					@matrix.setMovementX distance.X * progress + oldX

					@matrix.setMovementY distance.Y * progress + oldY

					# @el.style.opacity = progress * Math.random()

					@matrix.setScaleAll progress

					@matrix.setRotationX progress * 6.283

					@matrix.setRotationY progress * 6.283

					@matrix.setRotationZ progress * 6.283

					@applyToEl @matrix.toCss()


				if progress < 1

					tofmalAnim animate
					a = 0
				
				else

					@matrix.setMovementX distance.X  + oldX

					@matrix.setMovementY distance.Y  + oldY

					@matrix.setRotationX 6.283

					@matrix.setRotationY 6.283

					@matrix.setRotationZ 6.283

					@applyToEl @matrix.toCss()
				
			do animate
	
	domReady ->

		_test = document.createElement 'div'

		_test.classList.add 'test'

		baba = document.querySelector '.baba'

		for i in [0..100]

			baba.appendChild _test.cloneNode()

		start = document.getElementById 'start'
		
		els = document.querySelectorAll '.test'

		animates = []

		for el, index in els

			red = parseInt Math.random() * 255
			green = parseInt Math.random() * 255
			blue = parseInt Math.random() * 255

			color = 'rgb(' + red + ',' + green + ',' + blue + ')'
			#alert color
			el.style.backgroundColor = color

			animates[index] = new Animate el

		startIt = ->

			for animate in animates
			
				animate.transition Math.random()*document.width, Math.random()*document.height, 2000, Math.random() * 1000

			null

		window.s = startIt

		document.addEventListener 'click', startIt
			
			
		# To quickly benchmark different possible approaches on stuff
		do ->
			suite = new Benchmark.Suite



			suite.add 'uncached', ->

				a = 2 * Math.PI

			suite.add 'cached', ->

				a = 6.283185307179586


			suite.on 'cycle', (e) ->

				console.log String e.target

			suite.on 'complete', ->

				console.log l, w

				console.log 'Fastest:',  @filter('fastest').pluck('name')[0]

			window.run = ->

				suite.run

					async: true

				return null