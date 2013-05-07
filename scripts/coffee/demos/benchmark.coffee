require ['dev/benchmark/simple-suite', 'visuals/lightmatrix/base'], (suite, base) ->

	window.original = 1.2246063538223773e-15

	matrix = base.fromArray [
		1.2246063538223773e-15, 15, 2, 10,
		1.2246063538223773e-15, 0, 20, 10,
		3, 15, 1.2246063538223773e-15, 3,
		1.2246063538223773e-15, 1, 0, 10
	]

	suite.add 'toCss', ->

		base.toCss matrix

	suite.add 'toCss2', ->

		base.toCss2 matrix

	# suite.add 'toPrecision', ->

	# 	original.toPrecision 6

	# suite.add 'toFixed', ->

	# 	original.toFixed 6

	# suite.add '_toCssNumber', ->

	# 	base._toCssNumber original