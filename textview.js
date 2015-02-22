// это было написано за несколько минут, скорее временная заглушка чем просмотрщик
// можно сделать просмотрщик на основе правки, переведя её в состояние только для чтения

TTextView = kindof(TView)

TTextView.can.init = function() {
	dnaof(this)
	this.lines = []
	for (var i = 0; i < 40; i++) this.lines.push('')
	//'* * * * * * ' + i + ' * * * * * *')
	this.name = 'TTextView'
	this.d = 0
	this.navx = 0
	this.react(0, keycode.UP, this.moveCursor, {arg:'up'})
	this.react(0, keycode.DOWN, this.moveCursor, {arg:'down'})
	this.react(0, keycode.HOME, this.moveCursor, {arg:'home'})
	this.react(0, keycode.END, this.moveCursor, {arg:'end'})
	this.react(0, keycode.PAGE_UP, this.moveCursor, {arg:'pageup'})
	this.react(0, keycode.PAGE_DOWN, this.moveCursor, {arg:'pagedown'})
	this.react(0, keycode.LEFT, this.moveCursor, {arg:'left'})
	this.react(0, keycode.RIGHT, this.moveCursor, {arg:'right'})
	this.pal = getColor.syntax
	this.tabSize = 3
	this.lexer = JSLexer
	this.pal = [0xfff, 0xf00, 0x0f0, 0x00f]//colors
}

TTextView.can.coloredPrint = function(x, y, s) {
	var L = this.lexer.colorizeString(s)
	for (var i = 0; i < s.length; i++) {
		var F = this.pal[L[i] + 5]
		this.set(x + i, y, s[i], F, this.pal[1])
	}
}
TTextView.can.draw = function() {
	dnaof(this)
	var e = this.d + this.h, y = 0
	for (var i = this.d; i < e; i++) {
		if (i >= this.lines.length) break
		var s = this.lines[i]
		this.coloredPrint(-this.navx, y, s)
		y++
	}
}

TTextView.can.moveCursor = function(arg) { with (this) {
	if (arg == 'up') {
		this.d--
		if (this.d < 0) this.d = 0
	} else if (arg == 'down') {
		this.d++
		if (this.d > this.lines.length - this.h)  this.scrollToBottom()
	} else if (arg == 'home') {
		d = 0
		x = 0
	} else if (arg == 'end') {
		d = lines.length - h + 1
		if (d < 0) d = 0
	} else if (arg == 'pageup') {
		d -= h - 1
		if (d < 0) d = 0
	} else if (arg == 'pagedown') {
		d += h - 1
		if (d > lines.length - h + 1) d = lines.length - h + 1
		if (d < 0) d = 0
	} else if (arg == 'left') {
		navx -= 5
		if (navx < 0) navx = 0
	} else if (arg == 'right') {
		navx += 5
	}
	return true
}}

TTextView.can.scrollToBottom = function() {
	this.d = this.lines.length - this.h
	if (this.d < 0) this.d = 0
}

TTextView.can.track = function() {
	return { position: this.d, size: this.lines.length, page: this.h }
}

