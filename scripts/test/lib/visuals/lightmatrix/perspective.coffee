require '../../../prepare'

spec ['visuals/lightmatrix/perspective', 'visuals/lightmatrix/base'], (Perspective, Base) ->

	test 'perspective', ->

		Base.toCss(Perspective.matrix 100)
		
			.should.equal "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -0.01, 0, 0, 0, 1)"