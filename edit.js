TEdit = kindof(TView)
TEdit.can.init = function() {
	dnaof(this)
	this.text = ''
	this.name = 'TEdit'
	this.multiLine = true
	this.caretChar = '║'
	this.pal = getColor.edit
	this.react(0, keycode.BACK_SPACE, this.editBack)
	this.react(100, keycode.BACK_SPACE, this.editBackWord)
}
TEdit.can.draw = function(state) {
	dnaof(this, state)
	var F = this.pal[0]
	if (state.focused) F = this.pal[2], this.caret = { x: this.text.length, y: 0 }
	else delete this.caret
	this.print(0, 0, this.text, F, this.pal[1])
	//this.print(this.text.length, 0,  '║', this.fg, this.bg)
}
TEdit.can.editBack = function() {
	var i = this.text.length
	this.text = this.text.substr(0, this.text.length - 1)
//	if (this.text.length != i) repaint()
	this.getDesktop().display.caretReset()
	return true
}
TEdit.can.editBackWord = function() {
	var s = this.text.split(' ')
	s.pop()
	this.text = s.join(' ')
	this.getDesktop().display.caretReset()
	return true
}
TEdit.can.onKey = function(k) {
	var R = dnaof(this, k)
	if (!R && k.char != undefined) {
		if (k.plain == true) {
			this.text += k.char
			this.getDesktop().display.caretReset()
			return true
		}
	}
	return R
}


TInput = kindof(TEdit)
TInput.init = function(text) {
	dnaof(this)
	this.multiLine = false
	this.text = text
}


TLabeledEdit = kindof(TEdit)
TLabeledEdit.can.init = function() {
	dnaof(this)
	this.label = ''
	this.spacer = '>'
	this.name = 'TLabeledEdit'
}

TLabeledEdit.can.draw = function(state) {
	this.clear()
	this.print(0, 0, this.label, this.pal[2], this.pal[1])
	this.print(this.label.length, 0, this.spacer, this.pal[2], this.bg)
	this.print(this.label.length + this.spacer.length, 0, this.text, this.pal[0], this.pal[1])
	if (state.focused) {
//		this.print(this.label.length + this.spacer.length + this.text.length, 0,  this.caretChar, 0x3f3, this.bg)
		this.caret = {x: this.label.length + this.spacer.length + this.text.length, y:0}
	} else delete this.caret
}

TTextView = kindof(TView)

TTextView.can.init = function() {
	dnaof(this)
	this.lines = []
	for (var i = 0; i < 40; i++) this.lines.push('')//'* * * * * * ' + i + ' * * * * * *')
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
}

TTextView.can.coloredPrint = function(x, y, s) {
	var L = colorizeString(s)
	for (var i = 0; i < s.length; i++) {
		var F = this.pal[L[i] + 4]
		this.set(x + i, y, s[i], F, this.pal[1])
	}
}
TTextView.can.draw = function() {
	dnaof(this)
	var e = this.d + this.h, y = 0
	for (var i = this.d; i < e; i++) {
		if (i >= this.lines.length) break
		var s = this.lines[i]
		if (s == undefined) console.log('d', this.d, 'i', i, 'e', e, 'navx', this.navx)
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

TScrollBar = kindof(TView)
TScrollBar.can.init = function() {
	this.pal = getColor.view
}
TScrollBar.can.draw = function(state) {
//	dnaof(this, state)
	this.clear('░', this.pal[0], this.pal[1])
	var track = this.track()
	var max = track.size + 1//track.page -- depends on pagedown/end behaviour
	var Y = Math.round(this.h * (track.pos / max))
	this.print(0, Y, '  ', this.pal[1], this.pal[0])
}

TModalTextView = kindof(TWindow)
TModalTextView.can.init = function(Desktop, fileName) {
	dnaof(this)
	this.title = fileName
	this.viewer = TTextView.create()
	this.add(this.viewer)
	this.scrollBar = TScrollBar.create()
	this.add(this.scrollBar)
	this.scrollBar.disabled = true
	this.react(0, keycode.ESCAPE, this.close)
	this.actor = this.viewer
	this.pal = getColor.syntax
	this.fileName = fileName
}

TModalTextView.can.loadFile = function() {
	this.viewer.lines = fs.readFileSync(this.fileName).toString().replace(/\r/g, '').split('\n')
}

TModalTextView.can.size = function(W, H) {
	dnaof(this, W, H)
	this.viewer.size(W - 3, H - 2)
	this.viewer.pos(1, 1)
	this.scrollBar.size(2, H - 2)
	this.scrollBar.pos(W - 2, 1)
//	this.viewer.lines = wrapLines(this.viewer.lines1, this.viewer.w*100)
	this.scrollBar.track = function() {
		return { pos: this.d, size: this.lines.length, page: this.h }
	}.bind(this.viewer)
}

function viewFileContinue(yes) {
	if (yes == false) return
	this.loadFile()
	this.size(this.getDesktop().w, this.getDesktop().h)//; else t.size(30, 12)
	this.getDesktop().showModal(this)
}

viewFile = function(Desktop, fileName) {
	var t = TModalTextView.create(Desktop, fileName)
	t.parent = Desktop
	var size = fs.statSync(fileName).size
	var maxSize = 300000
	var f = viewFileContinue.bind(t)
	if (size > maxSize) {
		messageBox(Desktop, 'Файл ' + fileName.split('/').pop() + ' великоват, ' 
			+ readableSize(size) + ', открыть всё равно?', f)
	} else f()
	return t
}

editFile = function(s) {
	glxwin.sh_async('codeblocks '+ s)
}

editFileAlt = function(s) {
	glxwin.sh_async('pluma '+ s)
}


