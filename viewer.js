

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
	return { pos: this.d, size: this.lines.length, page: this.h }
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
		var Y = Math.floor(this.h * (track.pos / max))
		this.print(0, Y, '::', this.pal[0], this.pal[1] | 0x3000)
	}
}

TModalTextView = kindof(TWindow)
TModalTextView.can.init = function(Desktop, fileName, viewClass, colors) {
	dnaof(this)
	this.title = fileName
	this.scrollBar = TScrollBar.create(colors)
	this.add(this.scrollBar)
	this.viewer = viewClass.create(fileName)
	this.viewer.pal = colors
	this.add(this.viewer)
	this.scrollBar.disabled = true
	this.scrollBar.track = this.viewer.track.bind(this.viewer)
	this.scrollBar.pal = [this.viewer.pal[0], this.viewer.pal[1]]
	this.react(0, keycode.ESCAPE, this.closePrompt)
	this.actor = this.viewer
	var syntax = colors
	this.pal = [syntax[0], syntax[1], syntax[2], syntax[3]]//colors
	this.fileName = fileName
}

TModalTextView.can.close = function() {
	if (this.viewer.isModified != undefined) this.viewer.savePosState()
	dnaof(this)
}

TModalTextView.can.closePrompt = function() {
	if (this.viewer.isModified == undefined) return this.close() // not an edit
	var me = this
	if (this.viewer.isModified()) {
		var win = TExitSaveCancel.create()
		win.link = this
		this.getDesktop().showModal(win)
	} else this.close()
	return true
}

TModalTextView.can.loadFile = function() {
	this.viewer.lines = fs.readFileSync(this.fileName).toString().replace(/\r/g, '').split('\n')
}

TModalTextView.can.size = function(W, H) {
	dnaof(this, W, H)
	this.viewer.size(W - 4, H - 2)
	this.viewer.pos(1, 1)
	this.scrollBar.size(2, H - 2)
	this.scrollBar.pos(W - 2, 1)
}

linesCountStart = 1
symCountStart = 1

TModalTextView.can.draw = function(state) {
	dnaof(this, state)
	if (this.viewer.isModified) {
		var B = this.pal[1] | 0x1000, F = this.pal[0]
		if (this.viewer.isModified()) this.print(2, this.h-1, ' '+markerModified+' ', F, B);
		else this.print(2, this.h-1, '   ', undefined, B)
		this.print(7, this.h-1, ' ' + (this.viewer.para+linesCountStart) + ':' + (this.viewer.sym+symCountStart) +' ', this.pal[0], this.pal[1])
	}
}

var filePositions = []
function findFileMem(name) {
	for (var i = 0; i < filePositions.length; i++) {
		var N = filePositions[i]
		if (N.name == name) return N
	}
}

TFileEdit = kindof(TEdit)
TFileEdit.can.init = function(fileName) {
	dnaof(this)
	this.fileName = fileName
	this.text.setText(fs.readFileSync(fileName).toString())
	var N = findFileMem(fileName)
	if (N) {
		this.para = N.para, this.sym = N.sym, this.delta = N.delta
		if (this.para >= this.text.L.length - 1) this.para = this.text.L.length - 1, this.sym = 0
	}
	this.react(0, keycode.F2, this.save)
	this.react(100, keycode['s'], this.save)
}

TFileEdit.can.savePosState = function() {
	var N = findFileMem(this.fileName)
	if (N) {
		N.para = this.para, N.sym = this.sym, N.delta = this.delta
	} else filePositions.push({name: this.fileName, para: this.para, sym: this.sym, delta: this.delta})
}

TFileEdit.can.save = function() {
	fs.writeFileSync(this.fileName, this.text.getText())
	this.text.modified = false
	this.savePosState()
	return true
}

TFileEdit.can.isModified = function() {
	return this.text.modified == true
}

function viewFileContinue(yes) {
	if (yes == false) return
	this.loadFile()
	this.size(this.getDesktop().w, this.getDesktop().h)
	this.getDesktop().showModal(this)
}

viewFile = function(Desktop, fileName, viewClass, colors) {
	var t = TModalTextView.create(Desktop, fileName, viewClass, colors)
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

