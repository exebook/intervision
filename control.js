// можно разрастающиеся виды выносить в отдельные файлы

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
	this.shortcuts.enable('multi', false)
	if (text) this.setText(text)
}

TDoneBar = kindof(TView)
TDoneBar.can.init = function() {
	dnaof(this)
	this.position = 0, this.max = 100
	//'█▒▓░▍▌'
}

TDoneBar.can.draw = function(state) {
	dnaof(this, state)
	var X = (this.max / this.w)
	if (X == 0) return
	X = Math.round(this.position / X)
	this.rect(X, 0, this.w, 1, '░', 0xaaa, 0x888, 0x0)
	this.rect(0, 0, X, 1, ' ', this.pal[1], this.pal[0]) //█
}


TScrollBar = kindof(TView)
TScrollBar.can.init = function(color) {
	this.pal = color
}
TScrollBar.can.draw = function(state) {
	this.clear(' ', this.pal[0], this.pal[1] | 0x1000)
//	this.print(0, 0, '  ', this.pal[0], this.pal[1] | 0x1000)
//	this.print(0, this.h - 1, '  ', this.pal[0], this.pal[1] | 0x1000)
	if (this.track) {
		var track = this.track()
		var max = track.size + 1 // track.page -- depends on pagedown/end behaviour
		var Y = Math.floor(this.h * (track.position / max))
		this.print(0, Y, '::', this.pal[0], this.pal[1] | 0x3000)
	}
}


