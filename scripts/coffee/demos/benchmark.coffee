require ['domReady', 'benchmark', 'graphics/matrix3d/base', 'native'], (domReady, Benchmark, Base) ->


	dummyDiv = document.createElement 'div'

	document.body.appendChild dummyDiv

	cssToMatrix = (css) ->

		dummyDiv.style.webkitTransform = css

		Base.fromString getComputedStyle(dummyDiv).webkitTransform
	
	domReady ->

		# To quickly benchmark different possible approaches on stuff
		do ->
			suite = new Benchmark.Suite

			aClone = Base.clone16

			oClone = (o) ->

				{
					m11: o.m11
					m12: o.m12
					m13: o.m13
					m14: o.m14
					m21: o.m21
					m22: o.m22
					m23: o.m23
					m24: o.m24
					m31: o.m31
					m32: o.m32
					m33: o.m33
					m34: o.m34
					m41: o.m41
					m42: o.m42
					m43: o.m43
					m44: o.m44
				}

			a =  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

			o = {
					m11: 0
					m12: 1
					m13: 2
					m14: 3
					m21: 4
					m22: 5
					m23: 6
					m24: 7
					m31: 8
					m32: 9
					m33: 10
					m34: 11
					m41: 12
					m42: 13
					m43: 14
					m44: 15
				}


			suite.add 'o', ->

				oClone o

			suite.add 'a', ->

				aClone a

			suite.on 'cycle', (e) ->

				console.log String e.target

			suite.on 'complete', ->

				console.log 'Fastest:',  @filter('fastest').pluck('name')[0]

			window.run = ->

				suite.run

					async: true

				return null