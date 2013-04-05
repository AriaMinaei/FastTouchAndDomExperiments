require '../../../prepare'

spec ['utility/pool/fixed'], (FixedPool) ->

	class MyPool extends FixedPool

		_create: ->

			{
				name: ''
				age: 0
			}

		_reset: (item) ->

			item.name = ''
			item.age = 0

			item


	pool = new MyPool 2

	a = pool.get()
	b = pool.get()
	c = pool.get()

	c.should.equal a
	c.should.not.equal b
	pool.get().should.equal b

	