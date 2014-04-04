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
	this.react(100, keycode.ESCAPE, this.close)//Prompt)
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

TModalTextView.can.onKey = function(hand) {
	if (hand.plain && hand.key == keycode.ESCAPE && hand.physical) { // необычное решение
		if (this.viewer.isModified == undefined || this.viewer.isModified() == false) {
			if (hand.down) this.close();
			return true
		}
		else if (hand.down) {
			if (this.warn) this.warn.hidden = false
			else {
				var s = 'Control-Esc: выйти без сохранения'
				this.warn = TDialog.create()
				this.warn.title = 'Файл не сохранён'
				this.warn.size(s.length + 14, 6)
				this.warn.pos((this.w - this.warn.w)>>1, (this.h - this.warn.h)>>1)
				var l
				l = TLabel.create(s), l.pos(5, 5)
				this.warn.add(l, this.warn.w - 10, 1)
				l = TLabel.create('F2 или Control-S: сохранить'), l.pos(5, 5)
				this.warn.add(l, this.warn.w - 10, 1)
				this.add(this.warn)
			}
			this.actor = this.warn
			this.repaint()
		} else {
			this.warn.hidden = true
			this.actor = this.viewer
		}
		return true
	}
	return dnaof(this, hand)
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
		var B = this.pal[1] | 0x1000, F = 0x2f2//this.pal[0]
		if (this.viewer.isModified()) this.print(2, this.h-1, ' '+graphChar.on+' ', F, B);
		else this.print(2, this.h-1, ' '+graphChar.off+' ', F, B)
		this.print(7, this.h-1, ' ' + (this.viewer.para+linesCountStart) 
			+ ':' + (this.viewer.sym+symCountStart) +' ', this.pal[0], this.pal[1])
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
	this.react(100, keycode['p'], this.reloadPalette)
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

TFileEdit.can.reloadPalette = function() {
	this.save()
	require('./palette')
	this.pal = getColor[theme.editor]
	this.repaint()
	return true
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
	try {
		var size = fs.statSync(fileName).size
	} catch (e) {
		messageBox(Desktop, 'Файл "' + fileName.split('/').pop() + '" не удалось открыть')
		return
	}
	var maxSize = 300000
	var f = viewFileContinue.bind(t)
	if (size > maxSize) {
		messageBox(Desktop, 'Файл ' + fileName.split('/').pop() + ' великоват, ' 
			+ readableSize(size) + ', открыть всё равно?', f)
	} else f()
	return t
}

