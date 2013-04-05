require '../../prepare'

spec ['utility/math'], (math) ->

	math.square(2).should.equal 4

	math.distance(0, 0, 1, 1).should.equal Math.sqrt(2)

	math.limit(5, 0, 10).should.equal 5
	math.limit(-1, 0, 10).should.equal 0
	math.limit(0, 0, 10).should.equal 0
	math.limit(11, 0, 10).should.equal 10

	math.unit(10).should.equal 1
	math.unit(0).should.equal 1
	math.unit(-0.5).should.equal -1