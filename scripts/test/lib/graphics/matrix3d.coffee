require '../../prepare'

spec ['graphics/matrix3d'], (Matrix3d) ->

	return

	correctMatrix = [0.9651279441628826, 0.5637500000000001, -0.6349999999999999, 0.0012499999999999998, 0.6928203230275508, 1.2, 0, 0, 0.528349364905389, 0.29372694945022204, 1.0998522628062373, -0.0021650635094610966, 10, 11, 12, 1]

	# 'translate3d(10px, 11px, 12px) skew(30deg, 30deg) scale3d(1.1, 1.2, 1.3) perspective(400) rotate3d(0, 1, 0, 30deg)'

	rad = Math.PI / 6

	matrix = new Matrix3d

	matrix.setTranslation 10, 11, 12

	matrix.setSkew rad, rad

	matrix.setRotation 0, rad, 0

	matrix.setPerspective 400

	matrix.setScale 1.1, 1.2, 1.3

	matrix.generateMatrix().shouldEqual correctMatrix, "The generated Matrix3d is incorrect."