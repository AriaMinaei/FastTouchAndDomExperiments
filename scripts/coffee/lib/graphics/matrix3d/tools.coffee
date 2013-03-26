define ->

	MatrixTools =

		# This is faster than array.slice(0)
		# 11%  faster in chrome 25
		# 800% faster in iOS6
		# 11%  slower in FF Aurora 20
		clone16: (r) ->

			[r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]]

		# Returns the multiplication of two vectors
		# Got it from famo.us (Tell me if I shouldn't have, since there was no license statement)
		multiply: (a, b) ->

			[
				# 0
				a[0] * b[0] + a[1] * b[4] + a[2] * b[8],
				# 1
				a[0] * b[1] + a[1] * b[5] + a[2] * b[9],
				# 2
				a[0] * b[2] + a[1] * b[6] + a[2] * b[10]
				# 3
				0,
				# 4
				a[4] * b[0] + a[5] * b[4] + a[6] * b[8],
				# 5
				a[4] * b[1] + a[5] * b[5] + a[6] * b[9],
				# 6
				a[4] * b[2] + a[5] * b[6] + a[6] * b[10],
				# 7
				0,
				# 8
				a[8] * b[0] + a[9] * b[4] + a[10] * b[8],
				# 9
				a[8] * b[1] + a[9] * b[5] + a[10] * b[9],
				# 10
				a[8] * b[2] + a[9] * b[6] + a[10] * b[10],
				# 11
				0,
				# 12
				a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + b[12],
				# 13
				a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + b[13],
				# 14
				a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + b[14],
				# 15
				1
			]

		# An identity matrix
		identity: ->

			[
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			]