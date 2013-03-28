require ['domReady', 'graphics/matrix3d', 'graphics/matrix3d/base', 'native'], (domReady, Matrix3d, Base) ->


	Rotation = Matrix3d.Rotation

	dummyDiv = document.createElement 'div'
	document.body.appendChild dummyDiv

	cssToMatrix = (css) ->

		dummyDiv.style.webkitTransform = css

		Base.fromString getComputedStyle(dummyDiv).webkitTransform
	
	domReady ->

		rad = 30 * Math.PI / 180

		# matrix = new Matrix3d
		# matrix.setRotation(1, 2, 3)

		# console.log matrix.generateMatrix()

		# console.log cssToMatrix('rotate3d(1, 0, 0, ' + 1 + 'rad) rotate3d(0, 1, 0, ' + 2 + 'rad) rotate3d(0, 0, 1, ' + 3 + 'rad)')

		# matrix = new Matrix3d

		# matrix.setPerspective 400

		# console.log matrix.generateMatrix()
	
		