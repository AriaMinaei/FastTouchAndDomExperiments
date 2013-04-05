require '../../prepare'

spec ['utility/belt'], (belt) ->

	do ->

		o = 
			a: 1
			b: 2
		

		belt.empty o

		o.should.not.have.property 'a'
		o.should.not.have.property 'b'

	do ->

		o = 
			a: 1
			b: 2
		

		belt.fastEmpty o

		o.should.not.have.property 'a'
		o.should.not.have.property 'b'

	do ->

		to = 

			a: 1
			b: 2
		
		add = 

			b: 3
			c: 3


		belt.append to, add

		to.should.have.property 'c'
		to.b.should.equal 3
		to.c.should.equal 3
		to.a.should.equal 1

	do ->

		belt.typeOf('s').should.equal 'string'
		belt.typeOf(0).should.equal 'number'
		belt.typeOf(false).should.equal 'boolean'
		belt.typeOf({}).should.equal 'object'
		belt.typeOf(arguments).should.equal 'arguments'
		belt.typeOf([]).should.equal 'array'

	do ->

		belt.toArray([1]).should.be.an.instanceOf Array
		belt.toArray([1])[0].should.equal 1

	do ->

		a = [0, 1, 2]

		b = belt.cloneArray a

		b[0].should.equal 0
		b[1].should.equal 1

		b[0] = 3

		a[0].should.equal 0

	do ->

		belt.clone([1])[0].should.equal 1
		belt.clone({a:1}).a.should.equal 1