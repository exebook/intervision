TControl = kindof(TView)
TControl.can.init = function() {
	dnaof(this)
	this.name = 'TControl'
}

TButton = kindof(TControl)

TButton.can.init = function(keycode, title, onClick) {
	dnaof(this)
	if (typeof keycode != 'number') {
		log('Invalid Button: ', keycode, title, onClick)
		throw ('invalid button')
	}
	this.name = 'TButton'
	this.key = keycode
	this.title = title
	this.onClick = onClick
	this.pal = getColor.button
}

TButton.can.draw = function() {
	this.clear()
	if (this.title != undefined) {
		var title = ''
		if (typeof this.title == 'string') title = this.title
		if (typeof this.title == 'function') title = this.title()
		this.print((this.w >> 1) - (title.length + 2 >> 1), 0, ' ' + title + ' ', this.pal[0], this.pal[1])
	}
}

TButton.can.onMouse = function (hand) {
	if (hand.down && hand.button == 0 && this.onClick != undefined) return this.onClick()
}

TLabel = kindof(TControl)
TLabel.can.init = function(title) {
	dnaof(this)
	this.disabled = true
	this.name = 'TLabel'
	this.title = title
	this.pal = getColor.dialog
}

TLabel.can.draw = function() {
	this.clear()
	if (this.title != undefined) {
		var title = ''
		if (typeof this.title == 'string') title = this.title
		if (typeof this.title == 'function') title = this.title()
		this.print(0, 0, title, this.pal[0], this.pal[1])
	}
}

TInput = kindof(TEdit)
TInput.can.init = function(text) {
	dnaof(this)
	this.multiLine = false
	this.setText(text)
}
