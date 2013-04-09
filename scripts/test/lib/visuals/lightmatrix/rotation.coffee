require '../../../prepare'

spec ['visuals/lightmatrix/rotation', 'visuals/lightmatrix/scale', 'visuals/lightmatrix/base'], (Rotation, Scale, Base) ->

	Base.toCss(Rotation.matrix 1, 0, 0)
		
		.should.equal "matrix3d(1, 0, 0, 0, 0, 0.5403023058681398, 0.8414709848078965, 0, 0, -0.8414709848078965, 0.5403023058681398, 0, 0, 0, 0, 1)"

	Base.toCss(Rotation.matrix 0, 1, 0)
		
		.should.equal "matrix3d(0.5403023058681398, 0, -0.8414709848078965, 0, 0, 1, 0, 0, 0.8414709848078965, 0, 0.5403023058681398, 0, 0, 0, 0, 1)"

	Base.toCss(Rotation.matrix 0, 0, 1)
		
		.should.equal Base.toCss Base.fromCss "matrix(0.5403023058681398, 0.8414709848078965, -0.8414709848078965, 0.5403023058681398, 0, 0)"

	Base.toCss(Rotation.matrix 1, 2, 0)

		.should.equal "matrix3d(-0.4161468365471424, 0.7651474012342926, -0.49129549643388193, 0, 0, 0.5403023058681398, 0.8414709848078965, 0, 0.9092974268256817, 0.35017548837401463, -0.2248450953661529, 0, 0, 0, 0, 1)"

	Base.toCss(Rotation.matrix 1, 2, 3)

		.should.equal "matrix3d(0.411982245665683, -0.6812427202564033, 0.6051272472413688, 0, 0.05872664492762098, -0.642872836134547, -0.7637183366502791, 0, 0.9092974268256817, 0.35017548837401463, -0.2248450953661529, 0, 0, 0, 0, 1)"

	Base.toCss(Rotation.applyTo(Base.identity(), 1, 2, 3))

		.should.equal "matrix3d(0.411982245665683, -0.6812427202564033, 0.6051272472413688, 0, 0.05872664492762098, -0.642872836134547, -0.7637183366502791, 0, 0.9092974268256817, 0.35017548837401463, -0.2248450953661529, 0, 0, 0, 0, 1)"

	# This part is supposed to work if all numbers are fixed to 16
	# Base.toCss(Rotation.applyTo(Scale.matrix(1.1, 1.2, 1.3), 1, 2, 3)).should.equal "matrix3d(0.45318047023225133, -0.817491264307684, 0.7866654214137794, 0, 0.06459930942038308, -0.7714474033614562, -0.9928338376453627, 0, 1.0002271695082499, 0.42021058604881756, -0.2922986239759988, 0, 0, 0, 0, 1)"

	scale = Scale.matrix(1.1, 1.2, 1.3)
	rot = Rotation.matrix(1, 2, 3)
	final = Base.multiply scale, rot

	finalArray = Base.toArray final


	correctArray = Base.css2Array "matrix3d(0.45318047023225133, -0.817491264307684, 0.7866654214137794, 0, 0.06459930942038308, -0.7714474033614562, -0.9928338376453627, 0, 1.0002271695082499, 0.42021058604881756, -0.2922986239759988, 0, 0, 0, 0, 1)"

	for val, i in finalArray

		Number(val).toPrecision(14).should.equal Number(correctArray[i]).toPrecision(14)