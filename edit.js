if (typeof clipboardSet == 'undefined') {
	clipboardData = ''
	clipboardSet = function (s) { clipboardData = s }
	clipboardGet = function () { return clipboardData }
}

TEdit = kindof(TView)

TEdit.can.init = function() {
	dnaof(this)
	this.text = TText.create()
	this.L = []
	this.name = 'TEdit'
	this.multiLine = true
	this.pal = getColor.syntaxBlack
	this.react(100, keycode['z'], this.commandUndo, {arg:'undo'})
	this.react(101, keycode['z'], this.commandUndo, {arg:'redo'})

	this.react(100, keycode['m'], this.setMatch, { role:['multi']} )
	this.react(100, keycode['c'], this.userCopy)
	this.react(100, keycode['v'], this.userPaste)
	this.react(100, keycode['x'], this.userCut)
	this.react(100, keycode.INSERT, this.userCopy)
	this.react(1, keycode.INSERT, this.userPaste)
	this.react(1, keycode.DELETE, this.userCut)
	this.react(100, keycode['d'], this.commandLineDelete, { role:['multi'] })
	this.react(0, keycode.ENTER, this.commandEnter, { role:['multi'] })
	this.react(100, keycode['g'], this.commandGoToLine, { role:['multi'] })
	this.react(100, keycode['f'], this.commandFind, { role:['multi']})
	this.react(100, keycode['l'], this.commandFindNext, { role:['multi'] })
	this.react(101, keycode['l'], this.commandFindPrev, { role:['multi'] })
	this.react(101, keycode['c'], this.commandComment, {arg:'comment'})
	this.react(101, keycode['x'], this.commandComment, {arg:'uncomment'})
	this.react(0, keycode.F3, this.commandFindNext, { role:['multi'] })
	this.react(1, keycode.F3, this.commandFindPrev, { role:['multi'] })

	this.react(0, keycode.TAB, this.commandTab, { arg: 'indent', role:['multi'] } )
	this.react(1, keycode.TAB, this.commandTab, { arg: 'unindent', role:['multi'] } )
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
	this.react(0, keycode.UP, this.handleCursorKey, {arg:'up', role:['multi']})
	this.react(0, keycode.DOWN, this.handleCursorKey, {arg:'down', role:['multi']})
	this.react(0, keycode.HOME, this.handleCursorKey, {arg:'home'})
	this.react(0, keycode.END, this.handleCursorKey, {arg:'end'})
	this.react(0, keycode.PAGE_UP, this.handleCursorKey, {arg:'pageup', role:['multi']})
	this.react(0, keycode.PAGE_DOWN, this.handleCursorKey, {arg:'pagedown', role:['multi']})
	this.react(0, keycode.LEFT, this.handleCursorKey, {arg:'left'})
	this.react(0, keycode.RIGHT, this.handleCursorKey, {arg:'right'})
	this.react(100, keycode.LEFT, this.handleCursorKey, {arg:'wordleft'})
	this.react(100, keycode.RIGHT, this.handleCursorKey, {arg:'wordright'})
	this.react(100, keycode.PAGE_UP, this.handleCursorKey, {arg:'top', role:['multi']})
	this.react(100, keycode.PAGE_DOWN, this.handleCursorKey, {arg:'bottom', role:['multi']})

	this.react(100, keycode['a'], this.shiftSel, {arg: 'all'})

	this.react(1, keycode.UP, this.shiftSel, {arg:'up', role:['multi']})
	this.react(1, keycode.DOWN, this.shiftSel, {arg:'down', role:['multi']})
	this.react(1, keycode.HOME, this.shiftSel, {arg:'home'})
	this.react(1, keycode.END, this.shiftSel, {arg:'end'})
	this.react(1, keycode.PAGE_UP, this.shiftSel, {arg:'pageup', role:['multi']})
	this.react(1, keycode.PAGE_DOWN, this.shiftSel, {arg:'pagedown', role:['multi']})
	this.react(1, keycode.LEFT, this.shiftSel, {arg:'left'})
	this.react(1, keycode.RIGHT, this.shiftSel, {arg:'right'})
	this.react(101, keycode.LEFT, this.shiftSel, {arg:'wordleft'})
	this.react(101, keycode.RIGHT, this.shiftSel, {arg:'wordright'})
	this.react(101, keycode.PAGE_UP, this.shiftSel, {arg:'top', role:['multi']})
	this.react(101, keycode.PAGE_DOWN, this.shiftSel, {arg:'bottom', role:['multi']})
//	this.clipboardData = '<abc\ncde>'
//	this.sel.start(0, 0)
//	this.sel.end(0, 0)
}

TEdit.can.setMatch = function () {
	if (this.match) {
		this.oldMatch = this.match
		delete this.match
		return true
	}
	if (!this.sel.clean()) {
		var sel = this.sel.get()
		if (sel && sel.a.y == sel.b.y) {
			this.match = this.text.getSelText(this.sel)
			return true
		}
	}
	if (this.oldMatch) this.match = this.oldMatch
	return true
}

TEdit.can.size = function(w, h) {
	dnaof(this, w, h)
	this.text.w = w
	this.text.h = h
}

function colorizeMatch(line, match, colorIndex) {
	if (match.length > 31) return
	var s = line.s
	var t = ''
	var i = 0;
	while (true) {
		i = s.indexOf(match, i)
		if (i < 0) break
		var m = match.length + i
		for (; i < m; i++) line.c[i] = colorIndex
	}
}

TEdit.can.draw = function(state) {
	dnaof(this, state)
	var
		caret = this.text.textToScroll(this.para, this.sym),
		lines = this.text.getLines(this.delta, this.delta + this.h),
		Y = this.delta, sel = this.sel.get(), selState,
		match
	if (this.multiLine == true) {
		if (sel && sel.a.y == sel.b.y) match = this.text.getSelText(this.sel)
		if (this.match) match = this.match
	}
	
	if (sel) sel.a = this.text.textToScroll(sel.a.y, sel.a.x), sel.b = this.text.textToScroll(sel.b.y, sel.b.x)
//	if (caret[1] == undefined) caret[1] = 0
	if (state.focused && caret) F = this.pal[2], this.caret = { x: caret[1], y: caret[0] - this.delta, color: this.pal[0] }
	else delete this.caret
	var braceLevel = 0, curlyLevel = 0
	for (var l = 0; l < lines.length; l++) {
		var line = lines[l]
		if (match) colorizeMatch(line, match)
		var B = this.pal[1], F
		if (sel) {
			if (Y < sel.a[0]) selState = 0
				else if (Y == sel.a[0]) { if (Y != sel.b[0]) selState = 1; else selState = 2 }
				else if (Y == sel.b[0]) selState = 3
				else if (Y > sel.b[0]) selState = 4
				else selState = 5
		}
		var px = 0
		if (match) colorizeMatch(line, match, -1)
		var lineComment = false, keyw = 4
		for (var x = 0; x < line.s.length; x++) {
			B = this.pal[1]
			var X = line.w[x]
			var char = line.s[x], P = line.c[x]
			if (P == -1) {
				B = 0xff, F = 0x800
				if (this.match) B = 0x88f, F = 0x0cc
			} else F = this.pal[P + 4]
			if	(selState == 5 || 
					(selState == 1 && X >= sel.a[1])
				||	(selState == 2 && X >= sel.a[1] && X < sel.b[1]) 
				||	(selState == 3 && X < sel.b[1])
			) B = this.pal[4], F = this.pal[P + 4]
			if (char == '(') { F = this.pal[keyw+braceLevel], braceLevel++ }
			else if (char == ')') { if (braceLevel > 0) braceLevel--, F = this.pal[keyw+braceLevel] }
			else if (char == '{') { F = this.pal[keyw+curlyLevel], curlyLevel++ }
			else if (char == '}') { if (curlyLevel > 0) curlyLevel--, F = this.pal[keyw+curlyLevel] }
			else if (char == '/' && line.s[x + 1] == '/') lineComment = true
			if (lineComment) F = 0x755
			if (char == '\t') this.print(X, l, '   ', this.pal[0] | 0xa000, B | 0x0000) //'░'
			else this.set(X, l, char, F, B), px++
		}
		if (line.last) { // show line end marker
			B = this.pal[1]
			var ch = ' '
			if (sel && sel.a[0] <= Y && sel.b[0] > Y) B = this.pal[4], ch = '¶'
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
		var line = text.L[para]
		var xpos = wordLeft(line, sym)
		A = text.textToScroll(para, xpos)
		targetX = A[1]
		sym = xpos
	} else if (arg == 'wordright') {
		var A = text.textToScroll(para, sym)
		var q = text.getLines(A[0])[0].length
		if (A[1] == q) return moveCursor('right')
		var line = text.L[para]
		var xpos = wordRight(line, sym)
		A = text.textToScroll(para, xpos)
		targetX = A[1]
		sym = xpos
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
	var A = this.sel.get().a
	this.text.deleteText(this.sel)
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
		if (this.sel.clean()) return true
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
		if (this.sel.clean()) return true
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
	if (this.multiLine != true) return false
	var H = this.text.getHeight(), me = this
	var oldDelta = me.delta
	me.delta += arg
	if (me.delta > H - me.h + 3) me.delta = H - me.h + 3
	if (me.delta < 0) me.delta = 0
	if (me.delta != oldDelta) {
		if (arg < 0) this.moveCursor('up'); else this.moveCursor('down')
	}
	this.getDesktop().display.caretReset()
	return true
}

TEdit.can.onKey = function(k) {
	var R = dnaof(this, k)
	if (!R && k.char != undefined && k.key != keycode.ESCAPE) {
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
	if (this.multiLine == false && txt.indexOf('\n') >= 0) return true
	if (!this.sel.clean()) this.deleteSelected()
	var A = this.text.insertTextAt(txt, this.para, this.sym)
	this.para = A.para, this.sym = A.sym
	this.updateTargetX()
	this.scrollToView()
	this.repaint()
	this.getDesktop().display.caretReset()
	return true
}

TEdit.can.userCopy = function() {
	var s = this.text.getSelText(this.sel)
	if (s.length > 0) clipboardSet(s)
	return true
}

TEdit.can.userPaste = function() {
	var me = this
	function onPaste(text) { me.insertText(text) }
	clipboardGet(onPaste)
	return true
}

TEdit.can.userCut = function() {
	clipboardSet(this.text.getSelText(this.sel))
	this.deleteSelected()
	this.scrollToView()
	this.getDesktop().display.caretReset()
	return true
}

TEdit.can.dragScroll = function(arg, hand) {
	if (arg == 'start') {
		var G = this.getGlobal()
		this.drawScrollActive = { d: this.delta, y: hand.Y + hand.h * G.y, H: this.text.getHeight() }
		this.getDesktop().display.setCursor(2)
	} else if (arg == 'end') {
		delete this.drawScrollActive
		this.getDesktop().display.setCursor(1)
	} else {
		var S = this.drawScrollActive
		var D = S.d + (S.y - hand.Y)
		if (D < 0) {
			D = 0
		}
		if (D > S.H - this.h + 3) {
			D = S.H - this.h + 3
			// каааак это сделать та?
		}
		if (D != 	this.delta) {
			this.delta = D
			return true
		}
	}
}

TEdit.can.onCapture = function(hand) {
	if (this.drawScrollActive) {
		if (hand.button == 1 && hand.down == false) {
			this.dragScroll('end', hand)
			delete this.getDesktop().mouseCapture
			return true
		}
		return this.dragScroll('move', hand)
	}
}

function extendSelWord(sel) {
	sel.a.x = wordLeft(this.L[sel.a.y], sel.a.x)
	sel.b.x = wordRight(this.L[sel.b.y], sel.b.x)
	return sel
}

TEdit.can.mouseSelect = function(hand, noGlobal) {
	if (noGlobal != true) {
		var G = this.getGlobal()
		hand.x -= G.x, hand.y -= G.y
	}
	if (hand.button == 10) {
		this.sel.clear()
		this.sel.start(this.para, this.sym, extendSelWord.bind(this.text))
		this.sel.end(this.para, this.sym)
//		var ax = wordLeft(this.text.L[this.para], this.sym)
		var bx = wordRight(this.text.L[this.para], this.sym)
		this.sym = bx
		this.mouseSelecting = true
		return true
	}
	if (hand.button != undefined) {
		//if ((hand.X % hand.w) - (hand.w>>1) > 0) hand.x++
		var A = this.text.scrollToText(this.delta + hand.y, hand.x)
		if (hand.down) {
			if (A) this.para = A[0], this.sym = A[1], this.targetX = hand.x
			else this.moveCursor('bottom')
			this.sel.clear()
			this.sel.start(this.para, this.sym)
			this.mouseSelecting = true
		} else {
			if (this.scrollTimer) clearInterval(this.scrollTimer)
			if (this.mouseSelecting == true) this.mouseSelecting = false
			delete this.getDesktop().mouseCapture
		}
		this.getDesktop().display.caretReset()
		return true
	} else {
		if (this.mouseSelecting == true) {
			if (this.cacheMouse && this.cacheMouse.x == hand.x && this.cacheMouse.y == hand.y) return
			this.cacheMouse = { x: hand.x, y: hand.y }

			var overScroll = 0, me= this
			if (hand.y < 0) overScroll = -1
			else if (hand.y >= this.h) overScroll = 1
			var Y = hand.y, X = hand.x
			if (overScroll ==-1) Y = 0
			if (overScroll == 1) Y = me.h - 1
			
			if (overScroll == 0) {
				clearInterval(this.scrollTimer), this.scrollTimer = undefined
			}
			else { // Timer induced scrolling
				me.lineScroll(overScroll)
				if (this.scrollTimer) clearInterval(this.scrollTimer)
				this.scrollTimer = setInterval(function() {
					me.lineScroll(overScroll)
					var A = me.text.scrollToText(me.delta + Y, X)
					if (A) me.para = A[0], me.sym = A[1], me.targetX = X
					me.sel.end(me.para, me.sym)
					me.repaint()
				}, 50)
			}
			
			var A = this.text.scrollToText(this.delta + Y, X)
			if (A) this.para = A[0], this.sym = A[1], this.targetX = X
			this.sel.end(this.para, this.sym)
				
			return true
		}
	}
}

TEdit.can.onCursor = function(hand) {
//	if ((hand.X % hand.w) - (hand.w>>1) > 0) hand.x++
	this.getDesktop().display.setCursor(1)
}

TEdit.can.onMouse = function(hand) {
//	if ((hand.X % hand.w) - (hand.w>>1) > 0) hand.x++
	if (hand.button == 0) {
		if (hand.down) {
			this.getDesktop().mouseCapture = this.mouseSelect.bind(this)
			this.mouseSelect(hand, true)
		}
	}
	
	else if (hand.button == 1) {
		if (hand.down) {
			this.getDesktop().mouseCapture = this.onCapture.bind(this)
			return this.dragScroll('start', hand)
		}
	}
	
	else if (hand.button == 3 && this.multiLine == true) { 
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

TEdit.can.indentWith = function(sub) {
	var S = this.sel.get(), Y = S.b.y
	this.text.undoBegin()
	if (S.b.x == 0) Y--
	for (var y = S.a.y; y <= Y; y++) {
		this.text.insertTextAt(sub, y, 0)
	}
	var mova = 0, movb = 0
	if (S.a.x > 0) mova = sub.length
	if (S.b.x > 0) movb = sub.length
	this.sel.start(S.a.y, S.a.x + mova)
	this.sel.end(S.b.y, S.b.x + movb)
	this.text.undoEnd()
}

TEdit.can.unindentWith = function(sub) {
	var a, b
	if (this.sel.clean()) {
		a = this.para, b = a
	} else {
		var S = this.sel.get()
		a = S.a.y, b = S.b.y
		if (S.b.x == 0) b--
	}
	var L = this.text.L
	this.text.undoBegin()
	var T = TSelection.create(), mova = 0, movb = 0
	for (var y = a; y <= b; y++) {
		if (L[y].substr(0, sub.length) == sub) {
			if (y == a) mova = sub.length
			if (y == b) movb = sub.length
			T.start(y, 0), T.end(y, sub.length)
			this.text.deleteText(T)
		}
	}
	this.text.undoEnd()
	if (S) {
		if (S.a.x < mova) mova = 0
		if (S.b.x < movb) movb = 0
		this.sel.start(S.a.y, S.a.x - mova)
		this.sel.end(S.b.y, S.b.x - movb)
	}
}

TEdit.can.commandComment = function(arg) {
	//TODO: сделать '//' переменной настроек
	if (arg == 'comment') {
		if (this.sel.clean()) {
			var last = this.text.L.length - 1
			if (this.para != last || this.text.L[last].substr(0, 2) != '//')
			this.text.insertTextAt('//', this.para, 0)
			if (this.para != last) this.moveCursor('down')
		} else
			this.indentWith('//')
	}
	if (arg == 'uncomment') this.unindentWith('//')
	this.getDesktop().display.caretReset()
	return true
}

TEdit.can.commandTab = function(arg) {
	if (arg == 'indent') {
		if (this.sel.clean()) {
			this.insertText('\t')
			return true
		}
		this.indentWith('\t')
	}
	if (arg == 'unindent') this.unindentWith('\t')
	this.getDesktop().display.caretReset()
	return true
}

TEdit.can.getText = function () {
	return this.text.getText()
}

TEdit.can.setText = function(s) {
	this.text.setText(s)
	this.sel.clear()
	this.para = 0
	this.sym = 0
	if (this.text.L.length == 1) {
		this.shiftSel('all')
		this.sym = s.length
	} else {
		this.moveCursor('bottom')//will it work in TEdit.create(text)?
		this.moveCursor('end')
	}
}

TEdit.can.commandGoToLine = function() {
	var me = this
	var win = TInputBox.create(45, 'Переход', 'Номер строки', function(text) {
		me.para = parseInt(text - 1)
		if (me.para > me.text.L.length - 1) me.para = me.text.L.length - 1
		me.sym = 0
		me.scrollToView()
	})
	this.getDesktop().showModal(win)
	return true
}

TEdit.can.commandFindNext = function() {
	var me = this
	var t = me.text.L, c = t.length, match
	for (var p = me.para + 1; p < c; p++) {
		var sym = t[p].indexOf(me.textToFind)
		if (sym >= 0) {
			match = { para:p, sym: sym }
			break
		}
	}
	if (match == undefined) for (var p = 0; p <= me.para; p++) {
		var sym = t[p].indexOf(me.textToFind)
		if (sym >= 0) {
			match = { para:p, sym: sym }
			break
		}
	}
	if (match) {
		me.para = match.para, me.sym = match.sym
		me.sel.start(me.para, me.sym)
		me.sel.end(me.para, me.sym + me.textToFind.length)
		me.scrollToView()
		this.getDesktop().display.caretReset()
	}
	return true
}

TEdit.can.commandFindPrev = function() {
	var me = this
	var t = me.text.L, c = t.length, match
	for (var p = me.para - 1; p >= 0; p--) {
		var sym = t[p].indexOf(me.textToFind)
		if (sym >= 0) {
			match = { para:p, sym: sym }
			break
		}
	}
	if (match == undefined) for (var p = c - 1; p >= me.para; p--) {
		var sym = t[p].indexOf(me.textToFind)
		if (sym >= 0) {
			match = { para:p, sym: sym }
			break
		}
	}
	if (match) {
		me.para = match.para, me.sym = match.sym
		me.sel.start(me.para, me.sym)
		me.sel.end(me.para, me.sym + me.textToFind.length)
		me.scrollToView()
		this.getDesktop().display.caretReset()
	}
	return true
}

TEdit.can.commandFind = function() {
	var me = this
	var win = TInputBox.create(45, 'Поиск', 'Искомое', function(text) {
		me.textToFind = text
		me.commandFindNext()
	})
	if (this.sel.clean() != true) win.input.setText(this.text.getSelText(this.sel))
	this.getDesktop().showModal(win)
	return true
}
