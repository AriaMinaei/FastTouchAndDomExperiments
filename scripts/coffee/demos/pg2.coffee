require ['domReady', 'graphics/matrix3d', 'graphics/fastMatrix', 'utils/test', 'native'], (domReady, Matrix3d, FastMatrix, Test) ->

	eq = Test.eq

	Rotation = Matrix3d.Rotation

	dummyDiv = document.createElement 'div'
	document.body.appendChild dummyDiv

	cssToMatrix = (css) ->

		dummyDiv.style.webkitTransform = css

		Matrix3d.fromString getComputedStyle(dummyDiv).webkitTransform
	
	domReady ->

		rad = 30 * Math.PI / 180

		# console.group 'X'
		# eq Rotation.rotateX(rad), cssToMatrix('rotate3d(1, 0, 0, 30deg)')
		# console.groupEnd()

		# console.group 'Y'
		# eq Rotation.rotateY(rad), cssToMatrix('rotate3d(0, 1, 0, 30deg)')
		# console.groupEnd()

		# console.group 'Z'
		# eq Rotation.rotateZ(rad), cssToMatrix('rotate3d(0, 0, 1, 30deg)')
		# console.groupEnd()

		# fromX = Matrix3d.toWebkit Rotation.rotateX rad
		# fromY = Matrix3d.toWebkit Rotation.rotateY rad

		# eq Matrix3d.fromWebkit(fromX), Rotation.rotateX(rad)

		# console.log 'us  ', Matrix3d.fromWebkit fromX.multiply fromY
		# console.log 'them', Matrix3d.multiply Rotation.rotateX(rad), Rotation.rotateY(rad)

		matrix = new Matrix3d
		matrix.setRotation(1, 1, 1)

		console.log matrix.generateMatrix()

		console.log cssToMatrix('rotate3d(1, 0, 0, ' + 1 + 'rad) rotate3d(0, 1, 0, ' + 1 + 'rad) rotate3d(0, 0, 1, ' + 1 + 'rad)')