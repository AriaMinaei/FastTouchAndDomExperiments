require ['domReady', 'graphics/fastMatrix', 'native'], (domReady, FastMatrix) ->

	body = null

	cellEl = document.createElement 'div'
	cellEl.classList.add 'cell'

	titleEl = document.createElement 'div'
	titleEl.classList.add 'title'

	columnEl = document.createElement 'div'
	columnEl.classList.add 'column'

	getColumn = (title, before, after) ->

		column = columnEl.cloneNode()

		t = titleEl.cloneNode()
		t.innerHTML = title

		column.appendChild t

		for value, index in before

			c = cellEl.cloneNode()
			c.innerHTML = index
			c.setAttribute 'title', after[index]

			if value isnt after[index]

				c.classList.add 'different'

			column.appendChild c
		
		column

	groupEl = document.createElement 'div'
	groupEl.classList.add 'group'

	groupTitleEl = document.createElement 'h2'
	groupTitleEl.classList.add 'title'

	createGroup = (title, arrays...) ->

		group = groupEl.cloneNode()

		t = groupTitleEl.cloneNode()
		t.innerHTML = title

		group.appendChild t

		for pair in arrays

			title = pair[0]

			array = pair[1]

			if not before

				group.appendChild getColumn title, array, array

				before = Array.clone array

			else

				group.appendChild getColumn title, before, array

				before = Array.clone array

		group

	group =  ->

		body.appendChild createGroup.apply this, arguments

	domReady ->

		body = document.querySelector 'body'

		# body.appendChild getComparative [0, 0], [0, 1], 'test'

		# div = document.createElement 'div'
		
		transforms =

			rotate3d 	: 'rotate3d(0.1, 0.2, 0.3, 32deg)'

			scale3d 	: 'scale3d(0.9, 0.8, 0.7)'

			translate3d	: 'translate3d(10px, 11px, 12px)'

			skew 		: 'skew(7deg, 8deg)'

			perspective	: 'perspective(400)'

		dummy = document.createElement 'div'
		body.appendChild dummy

		getMatrix = (components...) ->

			s = components.join ' '

			dummy.style.webkitTransform = s

			style = getComputedStyle(dummy).webkitTransform

			(new FastMatrix style).r

		autoGroup = (components...) ->

			params = ['', ['identity', FastMatrix.identity()]]

			soFar = []

			for comp in components

				soFar.push transforms[comp]

				matrix = getMatrix.apply(this, soFar)

				params.push ['+' + comp, matrix]

			group.apply this, params

		
		# group 'some', ['identity', FastMatrix.identity()], ['translate3d', getMatrix translate3d]
		# group '', ['identity', FastMatrix.identity()], ['rotate3d', getMatrix rotate3d]
		# group '', ['identity', FastMatrix.identity()], ['scale3d', getMatrix scale3d]
		# group '', ['identity', FastMatrix.identity()], ['skew', getMatrix skew]
		# group '', ['identity', FastMatrix.identity()], ['perspective', getMatrix perspective]


		# group '', ['identity', FastMatrix.identity()], ['perspective', getMatrix perspective]
		# autoGroup 'perspective', 'translate3d', 'skew', 'rotate3d', 'scale3d'

		# autoGroup 'translate3d', 'skew', 'rotate3d', 'scale3d', 'perspective'

		body.appendChild document.createElement 'hr'
		autoGroup 'rotate3d'
		autoGroup 'perspective'	, 'rotate3d' # Yup
		autoGroup 'scale3d'		, 'rotate3d'
		autoGroup 'skew'		, 'rotate3d'
		# autoGroup 'rotate3d'	, 'rotate3d'
		autoGroup 'translate3d'	, 'rotate3d'

		body.appendChild document.createElement 'hr'
		autoGroup 'translate3d'
		autoGroup 'perspective'	, 'translate3d' # Yup
		autoGroup 'scale3d'		, 'translate3d'
		autoGroup 'skew'		, 'translate3d'
		autoGroup 'rotate3d'	, 'translate3d'
		# autoGroup 'translate3d'	, 'translate3d'

		
