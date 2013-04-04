require ['domReady', 'benchmark', 'graphics/lightmatrix', 'native'], (domReady, Benchmark, LightMatrix) ->
	`var Transform = function (el){

	this.el = el;

	this.rotation  = [0, 0, 0, 0];

	this.translate    = [0, 0, 0];

	this.pers = 100000;

	this.sca = 1;

	Transform.prototype.getTranslate = function() {
		return this.translate;
	};

	Transform.prototype.getEl = function() {

		return this.el;
	};	

	Transform.prototype.scale = function(input) {

		this.sca = input;

		return this;
	};

	Transform.prototype.perspective = function(input) {

		this.pers = input;

		return this;
	};

	Transform.prototype.rotationX = function(input) {

		this.rotation[0] = input;

		return this;
	};

	Transform.prototype.rotationY = function(input) {

		this.rotation[1] = input;

		return this;
	};

	Transform.prototype.rotationZ = function(input) {

		this.rotation[2] = input;

		return this;
	};

	Transform.prototype.rotationXZ = function(input) {

		this.rotation[3] = input;

		return this;
	};

	Transform.prototype.translateX = function(input) {

		this.translate[0] = input;

		return this;
	};

	Transform.prototype.translateY = function(input) {

		this.translate[1] = input;

		return this;
	};

	Transform.prototype.translateZ = function(input) {

		this.translate[2] = input;

		return this;
	};

	Transform.prototype.applyToElement = function() {
		
		this.el.style.webkitTransform = 
		
			'perspective(' + this.pers + ') '+
			'translateX(' + this.translate[0] + 'px) '+
			'translateY(' + this.translate[1] + 'px) '+
			'translateZ(' + this.translate[2] + 'px) '+
			'rotate3d(1,0,0,' + this.rotation[0] + 'deg) '+
			'rotate3d(0,1,0,' + this.rotation[1] + 'deg) '+
			'rotate3d(0,0,1,' + this.rotation[2] + 'deg) '+
			'rotate3d(1,0,1,' + this.rotation[3] + 'deg) '+
			'scale(' + this.sca + ')';

	};
}`
	class Animate 

		constructor: (@el)->

			@transform = new Transform @el
			# @matrix = new LightMatrix
			
		transition: (X, Y, duration, delay)->
			
			translate = @transform.getTranslate()

			
			oldX = parseInt translate[0]
			oldY = parseInt translate[1]

			distance = 

				X: X - oldX
				Y:  Y - oldY


			startTime = Date.now() + delay

			animate = =>

				passed = Date.now() - startTime 

				progress = passed / duration

				if startTime < Date.now() #delay wait

					@transform.translateX distance.X * progress + oldX

					@transform.translateY distance.Y * progress + oldY

					# @el.style.opacity = progress * Math.random()

					@transform.scale progress

					@transform.rotationX progress * 360

					@transform.rotationY progress * 360

					@transform.rotationZ progress * 360

					do @transform.applyToElement


				if progress < 1

					webkitRequestAnimationFrame animate
				
				else

					@transform.translateX distance.X  + oldX

					@transform.translateY distance.Y  + oldY

					@transform.rotationX 360

					@transform.rotationY 360

					@transform.rotationZ 360

					do @transform.applyToElement
				
			do animate
	
	domReady ->

		_test = document.createElement 'div'

		_test.classList.add 'test'

		baba = document.querySelector '.baba'

		for i in [0..200]

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


			suite.add 'l', ->


			suite.add 'l', ->


			suite.on 'cycle', (e) ->

				console.log String e.target

			suite.on 'complete', ->

				console.log l, w

				console.log 'Fastest:',  @filter('fastest').pluck('name')[0]

			window.run = ->

				suite.run

					async: true

				return null