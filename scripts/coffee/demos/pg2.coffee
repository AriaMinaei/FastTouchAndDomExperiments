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

		transform1 = 'perspective(400) rotate3d(0.5, 1, 0.3, 32deg) scale3d(1.1, 0.5, 1.05) skew(10deg, 12deg) translate3d(10px, 11px, 12px)'
		matrix1 = cssToMatrix transform1
		w1 = Base.toWebkit matrix1

		console.log 'matrix1', matrix1

		transform2 = 'perspective(450) rotate3d(0.4, 3, 0.5, 32deg) scale3d(1.2, 1.5, 0.05) skew(12deg, 11deg) translate3d(11px, 13px, 14px)'
		matrix2 = cssToMatrix transform2
		w2 = Base.toWebkit matrix2

		console.log 'matrix2', matrix2

		wm = w1.multiply w2

		console.log 'multiplied', Base.fromWebkit wm