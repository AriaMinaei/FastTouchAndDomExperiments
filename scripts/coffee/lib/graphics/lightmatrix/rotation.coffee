if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	Rotation = 

		components: (x, y, z) ->

			cosx = Math.cos x
			sinx = Math.sin x

			cosy = Math.cos y
			siny = Math.sin y

			cosz = Math.cos z
			sinz = Math.sin z

			{
				# 0
				m11: cosy * cosz
				# 1
				m12: cosx * sinz + sinx * siny * cosz
				# 2
				m13: sinx * sinz - cosx * siny * cosz

				# 4
				m21: -cosy * sinz
				# 5
				m22: cosx * cosz - sinx * siny * sinz
				# 6
				m23: sinx * cosz + cosx * siny * sinz


				# 8
				m31: siny
				# 9
				m32: -sinx * cosy
				# 10
				m33: cosx * cosy
			}

		matrix: (x, y, z) ->

			components = Rotation.components x, y, z

			{
				m11: components.m11
				m12: components.m12
				m13: components.m13
				m14: 0

				m21: components.m21
				m22: components.m22
				m23: components.m23
				m24: 0

				m31: components.m31
				m32: components.m32
				m33: components.m33
				m34: 0

				m41: 0
				m42: 0
				m43: 0
				m44: 1
			}

		applyTo: (b, x, y, z) ->

			# console.log arguments

			a = Rotation.matrix x, y, z

			{
				m11: a.m11 * b.m11  +  a.m12 * b.m21  +  a.m13 * b.m31
				m12: a.m11 * b.m12  +  a.m12 * b.m22  +  a.m13 * b.m32
				m13: a.m11 * b.m13  +  a.m12 * b.m23  +  a.m13 * b.m33
				m14: a.m11 * b.m14  +  a.m12 * b.m24  +  a.m13 * b.m34

				m21: a.m21 * b.m11  +  a.m22 * b.m21  +  a.m23 * b.m31
				m22: a.m21 * b.m12  +  a.m22 * b.m22  +  a.m23 * b.m32
				m23: a.m21 * b.m13  +  a.m22 * b.m23  +  a.m23 * b.m33
				m24: a.m21 * b.m14  +  a.m22 * b.m24  +  a.m23 * b.m34

				m31: a.m31 * b.m11  +  a.m32 * b.m21  +  a.m33 * b.m31
				m32: a.m31 * b.m12  +  a.m32 * b.m22  +  a.m33 * b.m32
				m33: a.m31 * b.m13  +  a.m32 * b.m23  +  a.m33 * b.m33
				m34: a.m31 * b.m14  +  a.m32 * b.m24  +  a.m33 * b.m34
				
				m41: b.m41
				m42: b.m42
				m43: b.m43
				m44: b.m44
			}

			# {
			# 	m11: a.m11 * b.m11  +  a.m12 * b.m21  +  a.m13 * b.m31  +  a.m14 * b.m41
			# 	m12: a.m11 * b.m12  +  a.m12 * b.m22  +  a.m13 * b.m32  +  a.m14 * b.m42
			# 	m13: a.m11 * b.m13  +  a.m12 * b.m23  +  a.m13 * b.m33  +  a.m14 * b.m43
			# 	m14: a.m11 * b.m14  +  a.m12 * b.m24  +  a.m13 * b.m34  +  a.m14 * b.m44

			# 	m21: a.m21 * b.m11  +  a.m22 * b.m21  +  a.m23 * b.m31  +  a.m24 * b.m41
			# 	m22: a.m21 * b.m12  +  a.m22 * b.m22  +  a.m23 * b.m32  +  a.m24 * b.m42
			# 	m23: a.m21 * b.m13  +  a.m22 * b.m23  +  a.m23 * b.m33  +  a.m24 * b.m43
			# 	m24: a.m21 * b.m14  +  a.m22 * b.m24  +  a.m23 * b.m34  +  a.m24 * b.m44

			# 	m31: a.m31 * b.m11  +  a.m32 * b.m21  +  a.m33 * b.m31  +  a.m34 * b.m41
			# 	m32: a.m31 * b.m12  +  a.m32 * b.m22  +  a.m33 * b.m32  +  a.m34 * b.m42
			# 	m33: a.m31 * b.m13  +  a.m32 * b.m23  +  a.m33 * b.m33  +  a.m34 * b.m43
			# 	m34: a.m31 * b.m14  +  a.m32 * b.m24  +  a.m33 * b.m34  +  a.m34 * b.m44
				
			# 	m41: a.m41 * b.m11  +  a.m42 * b.m21  +  a.m43 * b.m31  +  a.m44 * b.m41
			# 	m42: a.m41 * b.m12  +  a.m42 * b.m22  +  a.m43 * b.m32  +  a.m44 * b.m42
			# 	m43: a.m41 * b.m13  +  a.m42 * b.m23  +  a.m43 * b.m33  +  a.m44 * b.m43
			# 	m44: a.m41 * b.m14  +  a.m42 * b.m24  +  a.m43 * b.m34  +  a.m44 * b.m44
			# }