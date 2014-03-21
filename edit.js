TEdit = kindof(TView)

TEdit.can.init = function() {
	dnaof(this)
	this.text = TText.create()
	this.L = []
	this.name = 'TEdit'
	this.multiLine = true
	this.pal = getColor.syntax
	this.react(100, keycode['z'], this.commandUndo, {arg:'undo'})
	this.react(101, keycode['z'], this.commandUndo, {arg:'redo'})

	this.react(100, keycode['c'], this.userCopy)
	this.react(100, keycode['v'], this.userPaste)
	this.react(100, keycode['x'], this.userCut)
	this.react(100, keycode.INSERT, this.userCopy)
	this.react(1, keycode.INSERT, this.userPaste)
	this.react(1, keycode.DELETE, this.userCut)
	this.react(100, keycode['d'], this.commandLineDelete)
	this.react(0, keycode.ENTER, this.commandEnter)

	this.react(0, keycode.DELETE, this.commandDelete)
	this.react(100, keycode.DELETE, this.commandDeleteWord)
	this.react(0, keycode.BACK_SPACE, this.commandDeleteBack)
	this.react(100, keycode.BACK_SPACE, this.commandDeleteWordBack)
	this.delta = 0
	this.para = 0
	this.sym = 0
	this.targetX = 0
	this.sel = TSelection.create()
	this.react(100, keycode.UP, this.lineScroll, {arg:-1})
	this.react(100, keycode.DOWN, this.lineScroll, {arg:1})
	this.react(0, keycode.UP, this.handleCursorKey, {arg:'up'})
	this.react(0, keycode.DOWN, this.handleCursorKey, {arg:'down'})
	this.react(0, keycode.HOME, this.handleCursorKey, {arg:'home'})
	this.react(0, keycode.END, this.handleCursorKey, {arg:'end'})
	this.react(0, keycode.PAGE_UP, this.handleCursorKey, {arg:'pageup'})
	this.react(0, keycode.PAGE_DOWN, this.handleCursorKey, {arg:'pagedown'})
	this.react(0, keycode.LEFT, this.handleCursorKey, {arg:'left'})
	this.react(0, keycode.RIGHT, this.handleCursorKey, {arg:'right'})
	this.react(100, keycode.LEFT, this.handleCursorKey, {arg:'wordleft'})
	this.react(100, keycode.RIGHT, this.handleCursorKey, {arg:'wordright'})
	this.react(100, keycode.PAGE_UP, this.handleCursorKey, {arg:'top'})
	this.react(100, keycode.PAGE_DOWN, this.handleCursorKey, {arg:'bottom'})

	this.react(100, keycode['a'], this.shiftSel, {arg: 'all'})

	this.react(1, keycode.UP, this.shiftSel, {arg:'up'})
	this.react(1, keycode.DOWN, this.shiftSel, {arg:'down'})
	this.react(1, keycode.HOME, this.shiftSel, {arg:'home'})
	this.react(1, keycode.END, this.shiftSel, {arg:'end'})
	this.react(1, keycode.PAGE_UP, this.shiftSel, {arg:'pageup'})
	this.react(1, keycode.PAGE_DOWN, this.shiftSel, {arg:'pagedown'})
	this.react(1, keycode.LEFT, this.shiftSel, {arg:'left'})
	this.react(1, keycode.RIGHT, this.shiftSel, {arg:'right'})
	this.react(101, keycode.LEFT, this.shiftSel, {arg:'wordleft'})
	this.react(101, keycode.RIGHT, this.shiftSel, {arg:'wordright'})
	this.react(101, keycode.PAGE_UP, this.shiftSel, {arg:'top'})
	this.react(101, keycode.PAGE_DOWN, this.shiftSel, {arg:'bottom'})
	this.clipboardData = '<qwe\nrty>'
	this.sel.start(0, 4)
	this.sel.end(0, 2)
}

TEdit.can.size = function(w, h) {
	dnaof(this, w, h)
	this.text.w = w
	this.text.h = h
}

TEdit.can.draw = function(state) {
	dnaof(this, state)
	var
		caret = this.text.textToScroll(this.para, this.sym),
		lines = this.text.getLines(this.delta, this.delta + this.h),
		Y = this.delta, sel = this.sel.get(), selState
		if (sel) sel.a = this.text.textToScroll(sel.a.y, sel.a.x), sel.b = this.text.textToScroll(sel.b.y, sel.b.x)
	if (state.focused) F = this.pal[2], this.caret = { x: caret[1], y: caret[0] - this.delta }
	else delete this.caret
	for (var l = 0; l < lines.length; l++) {
		var line = lines[l]
		var B = this.pal[1]
		if (sel) {
			if (Y < sel.a[0]) selState = 0
				else if (Y == sel.a[0]) { if (Y != sel.b[0]) selState = 1; else selState = 2 }
				else if (Y == sel.b[0]) selState = 3
				else if (Y > sel.b[0]) selState = 4
				else selState = 5
		}
		var px = 0
		for (var x = 0; x < line.s.length; x++) {
			B = this.pal[1]
			var X = line.w[x]
			if	(selState == 5 || 
				(selState == 1 && X >= sel.a[1])
			||	(selState == 2 && X >= sel.a[1] && X < sel.b[1]) 
			||	(selState == 3 && X < sel.b[1])
			) B = this.pal[2]
			var char = line.s[x], F = this.pal[line.c[x] + 4]
			if (char == '\t') {
//				for (var f = 0; f < this.text.tab; f++) this.set(X+f, l, '-', F | 0xd000, B) // мож пригодится
				this.set(X+1, l, '░', this.pal[0] | 0xa000, B | 0x0000)
			}
			else this.set(X, l, char, F, B), px++
		}
		if (line.last) { // show line end marker
			B = this.pal[1]
			var ch = ' '
			if (sel && sel.a[0] <= Y && sel.b[0] > Y) B = this.pal[2], ch = '¶'
			this.set(line.w[line.s.length], l, ch, this.pal[0] | 0xa000, B)
		}
		Y++
	}
	if (l < this.h) {
		this.rect(0, l, this.w, this.h, '░', this.pal[0] | 0xa000, this.pal[1])// | 0x1000)
	}
}

TEdit.can.updateTargetX = function() {
	var A = this.text.textToScroll(this.para, this.sym)
	this.targetX = A[1]
}

TEdit.can.moveCursor = function(arg) { with (this) {
	var me = this
	function newX() { with (me) {
		var A = text.textToScroll(para, sym)
		A = text.scrollToText(A[0], targetX)
		if  (A) para = A[0], sym = A[1]
	}}
	if (arg == 'left') {
		sym--
		if (sym < 0) {
			sym = 0
			if (para > 0)  sym = this.text.L[--para].length
		}
		updateTargetX()
	} else if (arg == 'right') {
		sym++
		if (sym > text.L[para].length) {
			if (para < text.L.length - 1) {
				sym = 0
				para++
			} else sym--
		}
		updateTargetX()
	} else if (arg == 'up') {
		var A = text.textToScroll(para, sym)
		if (A[0] > 0) {
			A[0]--
			A = text.scrollToText(A[0], targetX)
			para = A[0], sym = A[1]
		}
	} else if (arg == 'down') {
		var A = text.textToScroll(para, sym)
		if (A[0] < text.getHeight() - 1) {
			A[0]++
			A = text.scrollToText(A[0], targetX)
			para = A[0], sym = A[1]
		}
	} else if (arg == 'home') {
		var A = text.textToScroll(para, sym)
		A = text.scrollToText(A[0], 0)
		para = A[0], sym = A[1]
		updateTargetX()
	} else if (arg == 'end') {
		var A = text.textToScroll(para, sym)
		A = text.scrollToText(A[0], this.w+1)
		para = A[0], sym = A[1]
		updateTargetX()
		
	} else if (arg == 'pageup') {
		var A = text.textToScroll(para, sym)
		A[0] -= h 
		if (A[0] < 0) A[0] = 0
		A = text.scrollToText(A[0], targetX)
		if (A) para = A[0], sym = A[1]//, delta -= h
	} else if (arg == 'pagedown') {
		var A = text.textToScroll(para, sym)
		A[0] += h 
		var H = text.getHeight()
		if (A[0] > H - 1) A[0] = H - 1
		A = text.scrollToText(A[0], targetX)
		if (A) para = A[0], sym = A[1]//, delta += h - 1
	} else if (arg == 'wordleft') {
		var A = text.textToScroll(para, sym)
		if (A[1] == 0) return moveCursor('left')
		A[1] -= 5
		if (A[1] < 0) A[1] = 0
		targetX = A[1]
		A = text.scrollToText(A[0], A[1])
		if (A) para = A[0], sym = A[1]
	} else if (arg == 'wordright') {
		var A = text.textToScroll(para, sym)
		var q = text.getLines(A[0])[0].length
		if (A[1] == q) return moveCursor('right')
		A[1] += 5
		if (A[1] > q) A[1] = q
		targetX = A[1]
		A = text.scrollToText(A[0], A[1])
		if (A) para = A[0], sym = A[1]
	} else if (arg == 'top') {
		para = 0
		newX()
	} else if (arg == 'bottom') {
		para = text.L.length - 1
		newX()
	}
}}

TEdit.can.scrollToView = function () { with (this) {
	var H = text.getHeight()
	var A = text.textToScroll(para, sym)
	if (delta == A[0] + 1) delta = A[0]
	if (delta == A[0] - h) delta++
	while (A[0] < delta) {
		delta -= h
		if (delta < 0) break
	}
	while (A[0] > delta + h - 1) {
		delta += h
		if (delta > H - h + 3) { delta = H - h + 3; break }
	}
	if (delta > H - h + 3) delta = H - h +3
	if (delta < 0) delta = 0
}}

TEdit.can.shiftSel = function(arg) {
	if (arg == 'all') {
		this.sel.start(0, 0)
		var q = this.text.L.length - 1
		this.sel.end(q, this.text.L[q].length)
		return true
	}
	if (this.sel.clean()) this.sel.start(this.para, this.sym)
	this.moveCursor(arg)
	this.sel.end(this.para, this.sym)
	this.scrollToView()
	this.getDesktop().display.caretReset()
	return true
}

TEdit.can.handleCursorKey = function(arg) { with (this) {
	var H = this.text.getHeight(), clearOnly = false
	if (!sel.clean()) {
		var A = sel.get()
		if (arg == 'left') clearOnly = true, para = A.a.y, sym = A.a.x
		if (arg == 'right') clearOnly = true, para = A.b.y, sym = A.b.x
		sel.clear()
	}
	if (!clearOnly) moveCursor(arg, H)
	scrollToView()
	getDesktop().display.caretReset()
	return true
}}


TEdit.can.commandLineDelete = function() { with (this) {
	var H = text.getHeight()
	var A = text.textToScroll(para, sym), B = [A[0] + 1, 0]
	A[1] = 0
	if (A[0] == H - 1) {
		var line = text.getLines(A[0], 1)[0]
		B[0] = A[0]
		B[1] = line.length
	}
	A = text.scrollToText(A[0], A[1])
	B = text.scrollToText(B[0], B[1])
	sel.start(A[0], A[1])
	sel.end(B[0], B[1])
	sym = A[1]
	text.deleteText(sel)
	sel.clear()
	scrollToView()
	getDesktop().display.caretReset()
	return true
}}

TEdit.can.deleteSelected = function () {
	this.text.deleteText(this.sel)
	var A = this.sel.get().a
	this.sel.clear()
	this.para = A.y
	this.sym = A.x
	this.updateTargetX()
}

TEdit.can.commandDelete = function () {
	if (this.sel.clean()) {
		this.sel.start(this.para, this.sym)
		this.moveCursor('right')
		this.sel.end(this.para, this.sym)
		if (this.sel.clean()) return false
	}
	this.deleteSelected()
	this.scrollToView()
	this.getDesktop().display.caretReset()
	return true
}

TEdit.can.deleteTo = function(arg) {
	if (this.sel.clean()) {
		this.sel.start(this.para, this.sym)
		this.moveCursor(arg)
		this.sel.end(this.para, this.sym)
		if (this.sel.clean()) return false
	}
	this.deleteSelected()
	this.scrollToView()
	this.getDesktop().display.caretReset()
	return true
}

TEdit.can.commandDeleteBack = function() {
	return this.deleteTo('left')
}

TEdit.can.commandDeleteWord = function() {
	return this.deleteTo('wordright')
}

TEdit.can.commandDeleteWordBack = function() {
	return this.deleteTo('wordleft')
}

TEdit.can.lineScroll = function(arg) {
	var H = this.text.getHeight(), me = this
	me.delta += arg
	if (me.delta > H - me.h + 3) me.delta = H - me.h + 3
	if (me.delta < 0) me.delta = 0
	this.getDesktop().display.caretReset()
	return true
}

TEdit.can.onKey = function(k) {
	var R = dnaof(this, k)
	if (!R && k.char != undefined) {
		if (k.mod.control == false && k.mod.alt == false) {
			if (!this.sel.clean()) this.deleteSelected()
			var A = this.text.insertTextAt(k.char, this.para, this.sym)
			this.para = A.para, this.sym = A.sym
			this.updateTargetX()
			this.scrollToView()
			this.getDesktop().display.caretReset()
			return true
		}
	}
	return R
}

TEdit.can.commandEnter = function () {
	var i = 0, s = this.text.L[this.para], t = ''
	while (i < s.length && s[i] == '\t' || s[i] == ' ') t += s[i++]
	return this.insertText('\n' + t)
}

TEdit.can.insertText = function (txt) {
	if (!this.sel.clean()) this.deleteSelected()
	var A = this.text.insertTextAt(txt, this.para, this.sym)
	this.para = A.para, this.sym = A.sym
	this.updateTargetX()
	this.scrollToView()
	this.getDesktop().display.caretReset()
	return true
}

TEdit.can.userCopy = function() {
	this.clipboardData = this.text.getSelText(this.sel)
	return true
}

TEdit.can.userPaste = function() {
	return this.insertText(this.clipboardData)
}

TEdit.can.userCut = function() {
	this.clipboardData = this.text.getSelText(this.sel)
	this.deleteSelected()
	this.scrollToView()
	this.getDesktop().display.caretReset()
	return true
}

TEdit.can.onCursor = function(hand) {
//	if ((hand.X % hand.w) - (hand.w>>1) > 0) hand.x++
	this.getDesktop().display.setCursor(1)
	if (this.mouseSelecting == true) {
		var A = this.text.scrollToText(this.delta + hand.y, hand.x)
		if (A) this.para = A[0], this.sym = A[1], this.targetX = hand.x
		this.sel.end(this.para, this.sym)
		return true
	}
}

TEdit.can.dragScroll = function(arg, hand) {
	if (arg == 'start') {
		log('***', this.getGlobal())
		this.drawScrollActive = { d: this.delta, y: hand.Y, H: this.text.getHeight() }
		log('START', this.drawScrollActive)
	} else if (arg == 'end') {
		delete this.drawScrollActive
	} else {
		var S = this.drawScrollActive
//		log(S, hand.Y)
		var D = S.d + (S.y - hand.Y)
		log('-->', D, S.d, S.y, hand.Y)
//		if (D < 0) D = 0
//		if (D > S.H - this.h + 3) D = S.H - this.h + 3
		if (D != 	this.delta) {
			this.delta = D
			return true
		}
	}
}

TEdit.can.onCapture = function(hand) {
	if (hand.button == 1 && hand.down == false) {
		this.dragScroll('end', hand)
		delete this.getDesktop().mouseCapture
		return true
	}
	if (this.drawScrollActive) return this.dragScroll('move', hand)
}

TEdit.can.onMouse = function(hand) {
	if ((hand.X % hand.w) - (hand.w>>1) > 0) hand.x++
	if (hand.button == 0) {
		var A = this.text.scrollToText(this.delta + hand.y, hand.x)
		if (A) this.para = A[0], this.sym = A[1], this.targetX = hand.x
		else this.moveCursor('bottom')
		if (hand.down) {
			this.sel.clear()
			this.sel.start(this.para, this.sym)
			this.mouseSelecting = true
		} else {
			this.sel.end(this.para, this.sym)
			this.mouseSelecting = false
		}
		this.getDesktop().display.caretReset()
	} else if (hand.button == 1) {
		if (hand.down) {
			this.getDesktop().mouseCapture = this.onCapture.bind(this)
			return this.dragScroll('start', hand)
		}
	} else if (hand.button == 3) {
		var H = this.text.getHeight(), me = this
		this.wheelSpeed = 3
		for (var i = 0; i < this.wheelSpeed; i++) setTimeout(function() {
			if (hand.down) me.delta ++; else me.delta --;
			if (me.delta > H - me.h + 3) me.delta = H - me.h + 3
			if (me.delta < 0) me.delta = 0
			if (me.mouseSelecting == true) me.onCursor(hand)
			me.getDesktop().display.forceRepaint()
		}, i * 100)
	}
	// TODO: dabl klik selekt
	return true
}

TEdit.can.commandUndo = function(arg) {
	this.sel.clear()
	if (arg == 'undo') var A = this.text.undo(); else A = this.text.redo()
	if (A) {
		this.para = A[0]
		this.sym = A[1]
		this.updateTargetX()
		this.scrollToView()
		this.getDesktop().display.caretReset()
		return true
	}
}

TEdit.can.track = function() {
	return { size: this.text.getHeight() - this.h + 3, pos: this.delta }
}



