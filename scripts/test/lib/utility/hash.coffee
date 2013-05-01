require '../../prepare'

spec ['utility/hash'], (Hash) ->

	h = new Hash

	obj = {'name': 'me'}

	test 'set, get', ->

		h.set 'name', 'aria'

		h.array[0].should.equal 'aria'

		h.set 'obj', obj

		h.get('obj').should.equal h.array[1]

	test 'each', ->

		h.each (i, val) ->

			if i is 0

				val.should.equal h.get 'name'

			else if i is 1

				val.should.equal h.get 'obj'

			i.should.not.be.above 1

	test 'remove', ->

		h.remove 'name'

		assert.strictEqual h.get('name'), undefined

		h.array.length.should.equal 1
		h._len.should.equal 1

		assert.strictEqual h._indexes['name'], undefined

		h.get('obj').should.equal obj

		h.array[0].should.equal obj
		assert.strictEqual h.array[1], undefined