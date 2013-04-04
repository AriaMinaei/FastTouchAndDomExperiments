require '../../../prepare'

spec ['graphics/matrix3d/translation'], (Translation) ->

	correctMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 11, 12, 1]

	t = new Translation 10, 11, 12

	t.getMatrix().shouldEqual correctMatrix