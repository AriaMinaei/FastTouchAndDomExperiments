require '../../../prepare'

spec ['graphics/lightmatrix/scale', 'graphics/lightmatrix/base'], (Scale, Base) ->

	Base.toCss(Scale.matrix 1.1, 1.2, 1.3)

		.should.equal "matrix3d(1.1, 0, 0, 0, 0, 1.2, 0, 0, 0, 0, 1.3, 0, 0, 0, 0, 1)"