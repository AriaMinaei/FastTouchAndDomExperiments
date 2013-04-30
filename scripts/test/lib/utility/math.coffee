require '../../prepare'

spec ['utility/math'], (math) ->

	test 'square', ->

		math.square(2).should.equal 4

	test 'distance', ->

		math.distance(0, 0, 1, 1).should.equal Math.sqrt(2)
		math.distance(-1, -1, 0, 0).should.equal Math.sqrt(2)
		math.distance(0, 0, 5, 0).should.equal 5
		math.distance(5, 0, -5, 0).should.equal 10

	test 'limit', ->

		math.limit(5, 0, 10).should.equal 5
		math.limit(-1, 0, 10).should.equal 0
		math.limit(0, 0, 10).should.equal 0
		math.limit(11, 0, 10).should.equal 10

	test 'unit', ->

		math.unit(10).should.equal 1
		math.unit(0).should.equal 1
		math.unit(-0.5).should.equal -1
		math.unit(-100).should.equal -1