if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	Scale = 

		components: (x, y, z) ->

			{
				m11: x
				m22: y
				m33: z
			}

		matrix: (x, y, z) ->

			{
				m11: x
				m12: 0
				m13: 0
				m14: 0

				m21: 0
				m22: y
				m23: 0
				m24: 0

				m31: 0
				m32: 0
				m33: z
				m34: 0

				m41: 0
				m42: 0
				m43: 0
				m44: 1
			}

		applyTo: (b, x, y, z) ->

			a = Scale.components x, y, z
			
			b.m11 *= a.m11
			b.m12 *= a.m11
			b.m13 *= a.m11
			b.m14 *= a.m11

			b.m21 *= a.m22
			b.m22 *= a.m22
			b.m23 *= a.m22
			b.m24 *= a.m22

			b.m31 *= a.m33
			b.m32 *= a.m33
			b.m33 *= a.m33
			b.m34 *= a.m33
			
			b