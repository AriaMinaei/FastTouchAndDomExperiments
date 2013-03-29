if typeof define isnt 'function' then define = require('amdefine')(module)

define [
	'./matrix3d/base', './matrix3d/skew',
	'./matrix3d/scale', './matrix3d/perspective',
	'./matrix3d/rotation', './matrix3d/translation'
	], (Base, Skew, Scale, Perspective, Rotation, Translation) ->

		class LightMatrix

			constructor: () ->

				