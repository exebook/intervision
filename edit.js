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
	if (handyContext && handyContext.lastSearchQuery) this.textToFind = handyContext.lastSearchQuery
	this.delta = 0
	this.para = 0
	this.sym = 0
	this.targetX = 0
	this.curLineHilite = false
	this.sel = TSelection.create()
	this.lineClipboard = []

with (this) with (keycode) {
	react(100, keycode['z'], commandUndo, {arg:'undo'})
	react(101, keycode['z'], commandUndo, {arg:'redo'})
	react(100, keycode['m'], setMatch, { role:['multi']} )
	react(100, keycode['c'], userCopy)
	react(100, keycode['v'], userPaste)
	react(100, keycode['x'], userCut)
	react(100, keycode.INSERT, userCopy)
	react(1, keycode.INSERT, userPaste)
	react(1, keycode.DELETE, userCut)
	react(100, keycode['d'], commandLineDelete, { role:['multi'] })
	react( 10, keycode['d'], commandLineBack, { role:['multi'] })
	react(0, keycode.ENTER, commandEnter, { role:['multi'] })
	react(100, keycode['g'], commandGoToLine, { role:['multi'] })
	react(100, keycode['f'], commandFind, { role:['multi']})
	react(100, keycode['h'], commandReplace, { role:['multi']})
	react(100, keycode['l'], commandFindNext, { arg:true, role:['multi'] })
	react(101, keycode['l'], commandFindPrev, { role:['multi'] })
	react(101, keycode['c'], commandComment, {arg:'comment'})
	react(101, keycode['x'], commandComment, {arg:'uncomment'})
	react(0, keycode.F3, commandFindNext, { arg:true, role:['multi'] })
	react(1, keycode.F3, commandFindPrev, { role:['multi'] })

	react(101, keycode.TAB, commandTab, { arg: 'convert', role:['multi'] } )
	react(0, keycode.TAB, commandTab, { arg: 'indent', role:['multi'] } )
	react(1, keycode.TAB, commandTab, { arg: 'unindent', role:['multi'] } )
}
	this.react(0, keycode.DELETE, this.commandDelete)
	this.react(100, keycode.DELETE, this.commandDeleteWord)
	this.react(0, keycode.BACK_SPACE, this.commandDeleteBack)
	this.react(100, keycode.BACK_SPACE, this.commandDeleteWordBack)
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
		me = this,
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
	var braceLevel = 0, curlyLevel = 0, B, F
	var lineComment = false, keyw = keyw0 = 10//7-ok
	for (var l = 0; l < lines.length; l++) {
		var line = lines[l]
		if (match) colorizeMatch(line, match)
		B = this.pal[1]
		if (sel) {
			if (Y < sel.a[0]) selState = 0
				else if (Y == sel.a[0]) { if (Y != sel.b[0]) selState = 1; else selState = 2 }
				else if (Y == sel.b[0]) selState = 3
				else if (Y > sel.b[0]) selState = 4
				else selState = 5
		}
		var px = 0
		if (match) colorizeMatch(line, match, -1)
		if (line.part == 0) lineComment = false, keyw = keyw0
		var lineHilite = this.curLineHilite && (caret[0] - this.delta == l)
		for (var x = 0; x < line.s.length; x++) {
			B = this.pal[1]
			var X = line.w[x]
			var char = line.s[x], P = line.c[x]
			if (P == -1) {
				B = 0xff, F = 0x800
				if (this.match) B = 0x88f, F = 0x0cc
			} else F = this.pal[P + 5]
			var selc = false
			if 	(selState == 5 || 
					(selState == 1 && X >= sel.a[1])
				|| (selState == 2 && X >= sel.a[1] && X < sel.b[1]) 
				|| (selState == 3 && X < sel.b[1])
			) B = this.pal[4], lineHilite = false, selc = true//, F = this.pal[P + 5]

//			if (lineHilite) B = blend(B, 0x1, 0xfff)
function remHere() {
//	var lex = me.text.lexer, rem = lex.lineComment, b = true
//	for (var i = 0; i < rem.length; i++) { if (rem[i] != line.s[x + i]) { b = false; break } }
//	if (b) log('*')
	return 
	char == '/' && line.s[x + 1] == '/' && P != me.text.lexer.cstr
}
			if (char == '(') { F = this.pal[keyw+braceLevel], braceLevel++ }
			else if (char == ')') 
				{ if (braceLevel > 0) braceLevel--, F = this.pal[keyw+braceLevel] }
			else if (char == '{') 
				{ F = this.pal[keyw+curlyLevel], curlyLevel++ }
			else if (char == '}') { 
				if (curlyLevel > 0) curlyLevel--, 
					F = this.pal[keyw+curlyLevel]
			}
			else {
				var lex = me.text.lexer, rem = lex.lineComment, brem = true
				for (var i = 0; i < rem.length; i++) {
					if (rem[i] != line.s[x + i]) { brem = false; break }
				}
				//if (b) log('*')
				//if (char == '/' && line.s[x + 1] == '/' && P != me.text.lexer.cstr) 
				if (brem && this.text.lexer.cstr) lineComment = true
			}
			if (lineComment) F = this.pal[5]
			if (char == '\t') {
				var tabc = '   '
				if (sel && selc) B = this.pal[4], tabc = line.s[x+1]=='\t'?' → ':' ⇥ '//
				this.print(
					X, l, tabc, this.pal[0] | 0xa000, B | 0x0000) //'░'
			}
			else this.set(X, l, char, F, B), px++
		}
		if (line.last) { // show line end marker
			B = this.pal[1]
			var ch = ' '
			if (sel && sel.a[0] <= Y && sel.b[0] > Y) B = this.pal[4], ch = '¶'
			this.set(line.w[line.s.length], l, ch, this.pal[0] | 0xa000, B)
		}
		if (lineHilite) {
			B = blend(B, 0x1, 0xfff)
			for (var X = 0; X < this.w; X++) this.set(X, l, undefined, undefined, B)
		}
		Y++
	}
	if (l < this.h) {
		this.rect(0, l, this.w, this.h, '░', this.pal[0] | 0xa000, this.pal[1])
			// | 0x1000)
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


TEdit.can.commandLineBack = function() { with (this) {
	sel.clear()
	moveCursor('home')
	var s = lineClipboard.pop()
	if (lineClipboard.length == 0) lineClipboard.push(s)
	insertText(s)
	moveCursor('up')
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
	this.lineClipboard.push(text.getSelText(sel))
	if (lineClipboard.length > 20) lineClipboard.shift()

	sym = A[1]
	text.deleteText(sel)
	sel.clear()
	scrollToView()
	getDesktop().display.caretReset()
	return true
}}

TEdit.can.deleteSelected = function () {
	var A = this.sel.get()
	if (A) A = A.a; else return
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
		if (arg == 'wordright') {
			var i = 0, s = '', spaceCount, prevLength = 0, startType
			while (true) {
				this.moveCursor('right')
				this.sel.end(this.para, this.sym)
				s = this.text.getSelText(this.sel)
				if (prevLength == s.length) break
				if (s.length == 1) startType = this.text.lexer.charType(s[0])
				else {
					if (this.text.lexer.charType(s[s.length - 1]) != startType) {
						this.moveCursor('left')
						this.sel.end(this.para, this.sym)
						s = this.text.getSelText(this.sel)
						break
					}
				}
				prevLength = s.length
			}
			if (s.indexOf('\n') >= 0) {
				return this.insertText(' ')
			}
		} else {
			this.moveCursor(arg)
			this.sel.end(this.para, this.sym)
		}
		if (this.sel.clean()) return true
	}
	s = this.text.getSelText(this.sel)
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

TEdit.can.onKey = function(hand) {
	if (hand.key == keycode.LEFT_CONTROL) {
		this.curLineHilite = hand.down
		this.repaint()
	}
	var R = dnaof(this, hand)
	if (!R && hand.char != undefined && hand.key != keycode.ESCAPE) {
		if (hand.mod.control == false && hand.mod.alt == false) {
			if (!this.sel.clean()) this.deleteSelected()
			var A = this.text.insertTextAt(hand.char, this.para, this.sym)
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
	var n = this.sym
	while (n < s.length && (s[n] == ' ' || s[n] == '\t')) n++
	n -= this.sym
	i += n
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
	function onPaste(text) { 
		if (me.multiLine == false) {
			text = text.split('\n').join(' ')
		}
		me.insertText(text)
	}
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
		if (hand.down && this.multiLine == true) {
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
	return { size: this.text.getHeight() - this.h + 3, position: this.delta }
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
	var REM = this.text.lexer.lineComment
	if (arg == 'comment') {
		if (this.sel.clean()) {
			var last = this.text.L.length - 1
			if (this.para != last || this.text.L[last].substr(0, 2) != REM)
			this.text.insertTextAt(REM, this.para, 0)
			if (this.para != last) this.moveCursor('down')
		} else
			this.indentWith(REM)
	}
	if (arg == 'uncomment') this.unindentWith(REM)
	this.getDesktop().display.caretReset()
	return true
}

TEdit.can.convertSpacesToTab = function() {
	if (this.sel.clean()) return
	var S = this.sel.get()
	var a = S.a.y, b = S.b.y
	if (S.b.x == 0) b--
	var steps = {}
	for (var y = a; y <= b; y++) {
		var s = this.text.L[y].replace('\t', '   ')
		var spaces = 0
		for (var i = 0; i < s.length; i++) if (s[i] == ' ') spaces++; else break
		steps[spaces] = true
	}
	var sorted = Object.keys(steps).sort(function(a,b){return a-b})
	for (var i = 0; i < sorted.length; i++) steps[sorted[i]] = i
	
	this.text.undoBegin()
	for (var y = a; y <= b; y++) this.text.changeLine(y, function(s) {
		s = s.replace('\t', '   ')
		var spaces = 0
		for (var i = 0; i < s.length; i++) if (s[i] == ' ') spaces++; else break
		s = s.substr(spaces, s.length)
		for (var i = 0; i < steps[spaces]; i++) s = '\t'+s
		console.log(s)
		return s
	})
	this.text.undoEnd()
}

TEdit.can.tabCompletion = function() {
	if (!this.sel.clean()) return
	var a = this.para, b = this.sym
	var s = this.text.L[a], t = ''
	while (--b >= 0) {
		var c = s[b], 
			ok = (c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') 
			|| (c >= 'A' && c <= 'Z') || c == '.'
		if (ok) t = c + t; else break
		if (c == '.') break
	}
	if (t == '') return
//	var cfg = require('path').dirname(require.main.filename) 
//		+ '/tabsnippets.js'

	var cfg = expandPath('~/.deodar/tabsnippets.js')
	if (fs.existsSync(cfg) == false) return false

	cfg = require(cfg)
	ok = cfg[t]
	if (!ok && t[0] == '.') {
		t = t.substr(1)
	}
	if (cfg[t]) {
		var snip = cfg[t]
		T = TSelection.create()
		T.start(this.para, this.sym)
		T.end(this.para, this.sym - t.length)
		this.text.deleteText(T)
		this.text.insertTextAt(snip, this.para, this.sym - t.length)
		this.sym = this.sym - t.length + snip.length
		return true
	}
}

TEdit.can.commandTab = function(arg) {
	if (this.tabCompletion()) return true
	if (arg == 'convert') {
		console.log('spaceToTab conversion')
		this.convertSpacesToTab()
	}
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
console.log('comand Find')
	var me = this, query = ''
	var win = TInputBox.create(45, 'Поиск', 'Искомое', function(text) {
		if (handyContext == undefined) handyContext = {}
		handyContext.lastSearchQuery = text
		me.textToFind = text
		me.replace = undefined
		me.commandFindNext()
	})
	win.ok.title = 'Искать'
	if (this.sel.clean() != true) { 
		console.log('query from selection')
		query = this.text.getSelText(this.sel)
	}
	else if (handyContext && handyContext.lastSearchQuery) {
		console.log('query from handy context')
		query = handyContext.lastSearchQuery
	} else if (me.textToFind) { 
		query = me.textToFind 
		console.log('query from textToFind')
	}
	win.input.setText(query)
	this.getDesktop().showModal(win)
	return true
}


TEdit.can.commandFindNext = function(next) {
//TODO: F3 in edit box = enter
	var me = this
	if (me.textToFind == undefined) return true
	if (next && me.replace != undefined) {
		var cur = me.text.getSelText(me.sel)
		if (cur == me.textToFind) {
			me.text.deleteText(me.sel)
			var S = me.sel.get()
			me.sel.clear()
			me.text.insertTextAt(me.replace, S.a.y, S.a.x)
		}
	}
	var t = me.text.L, c = t.length, match, S = me.sel.get()
	if (S) { me.sym = S.b.x }
	var sym = t[me.para].indexOf(me.textToFind, me.sym)
	if (sym >= 0) match = { para:me.para, sym: sym }
	if (match == undefined) for (var p = me.para + 1; p < c; p++) {
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

TEdit.can.commandReplace = function() {
	var me = this, query = ''
	var win = TReplaceBox.create(45, 'Замена', 'Искать', 'Заменить на',
	function(find, repl) {
		if (handyContext == undefined) handyContext = {}
		handyContext.lastSearchQuery = find
		handyContext.lastReplaceString = repl
		//TODO: move me.textToFind/me.replace to handyContext
		me.replace = repl
		me.textToFind = find
		me.commandFindNext()
	})
	win.ok.title = 'Искать(F3)'
	if (this.sel.clean() != true) { 
		query = this.text.getSelText(this.sel)
	}
	else if (handyContext && handyContext.lastSearchQuery) {
		query = handyContext.lastSearchQuery
		me.replace = handyContext.lastReplaceString
	} else if (me.textToFind) { query = me.textToFind }
	win.search.setText(query)
	if (me.replace) win.replace.setText(me.replace)
	this.getDesktop().showModal(win)
	return true
}
