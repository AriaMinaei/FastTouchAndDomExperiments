if typeof define isnt 'function' then define = require('amdefine')(module)

define ->

	Perspective = 

		components: (d) ->

			if d is 0

				p = 0

			else

				p = - 1 / d

			{
				m34: p
			}

		matrix: (d) ->

			if d is 0

				p = 0

			else

				p = - 1 / d

			{
				m11: 1
				m12: 0
				m13: 0
				m14: 0

				m21: 0
				m22: 1
				m23: 0
				m24: 0

				m31: 0
				m32: 0
				m33: 1
				m34: p

				m41: 0
				m42: 0
				m43: 0
				m44: 1
			}

		applyTo: (b, d) ->

			if d is 0

				p = 0

			else

				p = - 1 / d

			{
				m11: b.m11
				m12: b.m12
				m13: b.m13
				m14: b.m14

				m21: b.m21
				m22: b.m22
				m23: b.m23
				m24: b.m24

				m31: b.m31  +  p * b.m41
				m32: b.m32  +  p * b.m42
				m33: b.m33  +  p * b.m43
				m34: b.m34  +  p * b.m44
				
				m41: b.m41
				m42: b.m42
				m43: b.m43
				m44: b.m44
			}