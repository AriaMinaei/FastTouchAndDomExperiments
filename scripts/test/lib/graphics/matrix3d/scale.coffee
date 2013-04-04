require '../../../prepare'

spec ['graphics/matrix3d/scale'], (Scale) ->

	correctMatrix = [0.1, 0, 0, 0, 0, 0.2, 0, 0, 0, 0, 0.3, 0, 0, 0, 0, 1]

	s = new Scale 0.1, 0.2, 0.3

	s.getMatrix().shouldEqual correctMatrix