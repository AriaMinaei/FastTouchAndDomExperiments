require '../../../prepare'

spec ['graphics/matrix3d/perspective'], (Perspective) ->

	p = new Perspective 400

	correctMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -0.0025, 0, 0, 0, 1] 

	p.getMatrix().shouldEqual correctMatrix