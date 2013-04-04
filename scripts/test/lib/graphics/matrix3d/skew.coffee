require '../../../prepare'

spec ['graphics/matrix3d/skew', 'graphics/matrix3d/base'], (Skew, Base) ->

	correctMatrix = Base.matrix2Matrix3d [1, 0.17632698070846498, 0.36397023426620234, 1, 0, 0]

	s = new Skew 20 * Math.PI / 180, 10 * Math.PI / 180

	s.getMatrix().shouldEqual correctMatrix