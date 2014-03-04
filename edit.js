TEdit = kindof(TView)
TEdit.can.init = function() {
	dnaof(this)
	this.text = ''
	this.name = 'TEdit'
	this.multiline = false
	this.caretChar = '║'
	this.pal = getColor.edit
}
TEdit.can.draw = function(state) {
	dnaof(this, state)
	var F = this.pal[0]
	if (state.focused) F = this.pal[2], this.caret = { x: this.text.length, y: 0 }
	else delete this.caret
	this.print(0, 0, this.text, F, this.pal[1])
	//this.print(this.text.length, 0,  '║', this.fg, this.bg)
}
TEdit.can.onKey = function(key, down) {
	if (!down) return false
	if (key == 22) { // Backspace
		if (key_modifiers[0]) { // Control-Back
			var s = this.text.split(' ')
			s.pop()
			this.text = s.join(' ')
			repaint()
		} else { // Back
			var i = this.text.length
			this.text = this.text.substr(0, this.text.length - 1)
			if (this.text.length != i) repaint()
		}
		if (TODO) display.caretReset()
		return true
	}
}
TEdit.can.onChar = function(ch) {
	if (key_modifiers[0]) return
	this.text += ch
	if (TODO) display.caretReset()
	repaint()
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
	for (var i = 0; i < 40; i++) this.lines.push('* * * * * * ' + i + ' * * * * * *')
	this.name = 'TTextView'
	this.d = 0
}

TTextView.can.draw = function() {
	dnaof(this)
	var e = this.d + this.h, y = 0
	for (var i = this.d; i < e; i++) {
		if (i >= this.lines.length) break
		this.print(0, y, this.lines[i], this.fg, this.bg)
		y++
	}
}

TTextView.can.onKey = function(key, down) { with (this) {
	if (!down) return false
	if (key == 111) {
		this.d--
		if (this.d < 0) this.d = 0
		repaint()
	} else if (key == 116) {
		this.d++
		if (this.d > this.lines.length - this.h)  this.scrollToBottom()
		repaint()
	} else if (key == 110) { // Home
		d = 0;
		repaint()
	} else if (key == 115) { // End
		d = lines.length - h + 1
		if (d < 0) d = 0
		repaint()
	} else if (key == 112) { // Page UP
		d -= h - 1
		if (d < 0) d = 0
		repaint()
	} else if (key == 117) { // Page Down
		d += h - 1
		if (d > lines.length - h + 1) d = lines.length - h + 1
		repaint()
	}
}}
TTextView.can.scrollToBottom = function() {
	this.d = this.lines.length - this.h
	if (this.d < 0) this.d = 0
}

TModalTextView = kindof(TTextView)
TModalTextView.can.onKey = function(key, down) {
	if (key == 9) {
		this.parent.hideModal(this)
		repaint()
		return
	}
	dnaof(this, key, down)
}

viewFile = function(Desktop, s) {
	var t = TModalTextView.create()
	var size = glxwin.ijs_fsize(s)
	if (size > 100000) { messageBox('Файл ' + s + ' слишком большой, ' + readableSize(size)); return }
	t.lines = wrapLines(glxwin.ijs_load(s).replace(/\r/g, '').split('\n'), Desktop.w)
	if (TODO) t.size(Desktop.w, Desktop.h); else t.size(30, 12)
	Desktop.showModal(t)
}

editFile = function(s) {
	glxwin.sh_async('codeblocks '+ s)
}

editFileAlt = function(s) {
	glxwin.sh_async('pluma '+ s)
}


