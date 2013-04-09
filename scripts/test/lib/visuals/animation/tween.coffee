require '../../../prepare'

spec ['visuals/animation/tween'], (Tween) ->

	t = new Tween 10, 20, 100, (p) -> p

	t.startsAt 30

	t.on(40).should.equal 11