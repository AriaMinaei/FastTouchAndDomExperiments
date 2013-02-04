window.UIEvent::stop = () ->
	this.stopPropagation()
	this.preventDefault()