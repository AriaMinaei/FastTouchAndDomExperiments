require '../../prepare'

spec ['utility/array'], (array) ->

	test 'from', ->

		array.from([1]).should.be.an.instanceOf Array
		array.from([1])[0].should.equal 1

	test 'clone', ->

		a = [0, 1, 2]

		b = array.clone a

		b[0].should.equal 0
		b[1].should.equal 1

		b[0] = 3

		a[0].should.equal 0

	test 'pluck', ->

		a = [0, 1, 2, 3]

		after = array.pluck a, 1

		after.length.should.equal 3

		after[0].should.equal 0
		after[1].should.equal 2
		after[2].should.equal 3
		after.should.equal a