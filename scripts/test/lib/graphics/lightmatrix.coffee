require '../../prepare'

spec ['graphics/lightmatrix'], (LightMatrix) ->

	l = new LightMatrix

	return

	l.setRotationX 2

	l.rotateX 1

	# Original
	l.rotation().x.should.equal 3

	# Temp
	l.temporarily().rotateX 2

	# Temp
	l.rotation().x.should.equal 5

	# Rolling Back
	l.temporarily()

		# And checking
		.rotation().x.should.equal 3

	# 2 more
	l.rotateX(2)

		# and commit
		.commit()

	# its committed, so it should be the last value
	l.rotation().x.should.equal 3