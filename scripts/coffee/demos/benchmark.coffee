require ['dev/benchmark/simple-suite', 'utility/hash', 'utility/array'], (suite, Hash, array) ->

	# getA = ->

	# 	[
	# 		{'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, 
	# 		{'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, 
	# 		{'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, 
	# 		{'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, 
	# 		{'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, 
	# 		{'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, 
	# 		{'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, 
	# 		{'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, 
	# 		{'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, 
	# 		{'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, 
	# 		{'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, 
	# 		{'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, 
	# 		{'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, 
	# 		{'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, {'name': 'me', 'value': 'you'}, 
	# 	]

	# suite.add 'splice', ->

	# 	a = getA()

	# 	a.splice 20, 1

	# 	null

	# suite.add 'pluck', ->

	# 	a = getA()

	# 	array.pluck a, 20

	# 	null

	num = 32
	empty = ->

	array = []
	obj = {}
	h = new Hash
	for i in [0...num]

		array.push empty 
		obj[i] = empty
		h.set i, empty

	suite.add 'array', ->

		do func for func in array

		null

	suite.add 'hash.array', ->

		do func for func in h.array

		null

	suite.add 'hash.each', ->

		h.each (i, val) ->

			do val

		null

	suite.add 'obj', ->

		do obj[i] for i of obj

		null