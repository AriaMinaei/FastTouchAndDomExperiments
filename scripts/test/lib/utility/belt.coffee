require '../../prepare'

spec ['utility/belt'], (belt) ->

	test 'empty', ->

		o = 
			a: 1
			b: 2
		

		belt.empty o

		o.should.not.have.property 'a'
		o.should.not.have.property 'b'

	test 'fastEmpty', ->

		o = 
			a: 1
			b: 2
		

		belt.fastEmpty o

		o.should.not.have.property 'a'
		o.should.not.have.property 'b'

	test 'append 1', ->

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

	test 'typeOf', ->

		belt.typeOf('s').should.equal 'string'
		belt.typeOf(0).should.equal 'number'
		belt.typeOf(false).should.equal 'boolean'
		belt.typeOf({}).should.equal 'object'
		belt.typeOf(arguments).should.equal 'arguments'
		belt.typeOf([]).should.equal 'array'

	test 'toArray', ->

		belt.toArray([1]).should.be.an.instanceOf Array
		belt.toArray([1])[0].should.equal 1

	test 'cloneArray', ->

		a = [0, 1, 2]

		b = belt.cloneArray a

		b[0].should.equal 0
		b[1].should.equal 1

		b[0] = 3

		a[0].should.equal 0

	test 'clone', ->

		belt.clone([1])[0].should.equal 1
		belt.clone({a:1}).a.should.equal 1

	test 'deepAppend 1', ->

		v1 =

			a: 'a'

			b: 'b'

		v2 = 

			a: 'a2'

			c: 'c2'

		belt.deepAppend v1, v2

		v1.a.should.equal 'a2'
		v1.c.should.equal 'c2'

	test 'deepAppend 2', ->

		person1 = 

			hands: ['left', 'right']

			face:

				eyes: null

				lips: 'red'



		person2 = 

			hands: ['left', 'noright']

			face:

				eyes:

					left:

						sight: 'good'

		belt.deepAppend person1, person2

		person1.hands[1].should.equal 'noright'

		person1.face.should.have.property 'lips', 'red'

		person1.face.should.have.property 'eyes'

		person1.face.eyes.should.have.property 'left'

		person1.face.eyes.left.should.have.property 'sigssht'

		person1.face.eyes.left.sight.should.equal 'good'