TEdit = kindof(TView)

TEdit.can.init = function() {
	dnaof(this)
	this.L = []
	this.name = 'TEdit'
	this.multiLine = true
	this.pal = getColor.syntax
	this.react(0, keycode.BACK_SPACE, this.editBack)
	this.react(100, keycode.BACK_SPACE, this.editBackWord)
	this.d = 4
	this.cursor = { x:0, y:7, targetX: 0 }
	this.sel = {ax:0, bx:0, ay:0, by:0}
	this.react(0, keycode.UP, this.moveCursor, {arg:'up'})
	this.react(0, keycode.DOWN, this.moveCursor, {arg:'down'})
	this.react(0, keycode.HOME, this.moveCursor, {arg:'home'})
	this.react(0, keycode.END, this.moveCursor, {arg:'end'})
	this.react(0, keycode.PAGE_UP, this.moveCursor, {arg:'pageup'})
	this.react(0, keycode.PAGE_DOWN, this.moveCursor, {arg:'pagedown'})
	this.react(0, keycode.LEFT, this.moveCursor, {arg:'left'})
	this.react(0, keycode.RIGHT, this.moveCursor, {arg:'right'})
	this.react(100, keycode.LEFT, this.moveCursor, {arg:'wordleft'})
	this.react(100, keycode.RIGHT, this.moveCursor, {arg:'wordright'})
	this.react(100, keycode.PAGE_UP, this.moveCursor, {arg:'top'})
	this.react(100, keycode.PAGE_DOWN, this.moveCursor, {arg:'bottom'})

	this.react(1, keycode.RIGHT_SHIFT, this.shiftSel, { arg: 'start'})
	this.react(1, keycode.LEFT_SHIFT, this.shiftSel, { arg: 'start'})
	this.react(0, keycode.RIGHT_SHIFT, this.shiftSel, {arg: 'finish', down: false})
	this.react(0, keycode.LEFT_SHIFT, this.shiftSel, {arg: 'finish', down: false})
	this.react(101, keycode.RIGHT_SHIFT, this.shiftSel, { arg: 'start'})
	this.react(101, keycode.LEFT_SHIFT, this.shiftSel, { arg: 'start'})
	this.react(100, keycode.RIGHT_SHIFT, this.shiftSel, {arg: 'finish', down: false})
	this.react(100, keycode.LEFT_SHIFT, this.shiftSel, {arg: 'finish', down: false})

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
}

TEdit.can.onMouse = function(button, down, x, y) {
	var H = this.getHeight(), me = this
	this.cursor.y = this.d + y
	this.cursor.x = x
	if (this.cursor.y > H - 1) this.cursor.y = H - 1
	var line = this.getLine(this.cursor.y)
	if (this.cursor.x > line.s.length) this.cursor.x = line.s.length
	this.getDesktop().display.caretReset()
	return true
}

TEdit.can.shiftSel = function(arg) {
	if (arg == 'start') {
		this.sel = { ax: this.cursor.x, ay: this.cursor.y }
		return false
	}
	if (arg == 'finish') {
//		this.sel = {}
		return false
	}
	this.moveCursor(arg)
	this.sel.bx = this.cursor.x
	this.sel.by = this.cursor.y
	log(this.getSelText())
	log()
	return true
}

TEdit.can.getSelText = function() {
	var sel = sortSelection(this.sel)
	var T = '', prev
	var l = {i:0, h:0}
	for (var y = sel.ay; y <= sel.by; y++) {
		l = this.getLine(y)//, l.h, l.i) // speed only
		var a = 0, b = l.s.length
		if (y == sel.ay) a = sel.ax
		if (y == sel.by) b = sel.bx
		if (prev && l.l != prev.l) T += '\n'
		T += l.s.substr(a, b - a)
		prev = l
	}
	return T
}

TEdit.can.moveCursor = function(arg) { with (this) {
	var H = this.getHeight(), me = this
	function newX() { with (me) {
		cursor.x = cursor.targetX
		var line = getLine(cursor.y)
		if (cursor.x > line.s.length) cursor.x = line.s.length
	}}
	if (arg == 'up') {
		if (cursor.y > 0) {
			cursor.y--
			cursor.x = cursor.targetX
			var line = getLine(cursor.y)
			if (cursor.x > line.s.length) cursor.x = line.s.length
		}
	} else if (arg == 'down') {
		if (cursor.y < H - 1) {
			cursor.y++
			newX()
		}
	} else if (arg == 'home') {
		cursor.x = 0
		cursor.targetX = cursor.x
	} else if (arg == 'end') {
		cursor.x = getLine(cursor.y).s.length
		cursor.targetX = cursor.x
	} else if (arg == 'pageup') {
		cursor.y -= h - 1
		if (cursor.y < 0) cursor.y = 0
		newX()
		d -= h - 1
	} else if (arg == 'pagedown') {
		var q =cursor.y
		cursor.y += h - 1
		if (cursor.y > H - 1) cursor.y = H - 1
		d += h - 1
		newX()
	} else if (arg == 'wordleft') {
		if (cursor.x == 0) return moveCursor('left')
		cursor.x -= 5
		if (cursor.x < 0) cursor.x = 0
		cursor.targetX = cursor.x
	} else if (arg == 'wordright') {
		var q = getLine(cursor.y).s.length
		if (cursor.x == q) return moveCursor('right')
		cursor.x += 5
		if (cursor.x > q) cursor.x = q
		cursor.targetX = cursor.x
	} else if (arg == 'left') {
		cursor.x--
		if (cursor.x < 0) {
			cursor.x = 0
			if (cursor.y > 0) cursor.x = getLine(--cursor.y).s.length
		}
		cursor.targetX = cursor.x
	} else if (arg == 'right') {
		var line = getLine(cursor.y)
		if (cursor.x >= line.s.length) {
			if (cursor.y < H-1) { cursor.y++;  cursor.x = 0 }
		} else cursor.x++
		cursor.targetX = cursor.x
	} else if (arg == 'top') {
		cursor.y = 0
		newX()
	} else if (arg == 'bottom') {
		cursor.y = H - 1
		newX()
	}
	if (cursor.y < d) d = cursor.y
	if (cursor.y > d + h - 1) d = cursor.y - h + 1
	if (d > H - h + 1) d = H - h + 1
	if (d < 0) d = 0
	this.getDesktop().display.caretReset()
	return true
}}

TEdit.can.getLine = function(y, h, i0) {
	if (h == undefined) h = 0
	if (i0 == undefined) i0 = 0
	for (var i = i0; i < this.L.length; i++) {
		var s = this.L[i]
		var B = breakPara(s, this.w)
		var h1 = h
		for (var b = 0; b < B.length; b++) {
			if (h == y) {
				var C = colorizeString(s)
				var P = getParts(s, C, B)
				return { s: P.s[b], c: P.c[b], p: P, l: this.L[i], i: i, h: h1 }
			}
			h++
		}
	}
}

TEdit.can.getHeight = function() {
	var h = 0
	for (var i = 0; i < this.L.length; i++) {
		var P = breakPara(this.L[i], this.w)
		h += P.length
	}
	return h
}

function sortSelection(sel) {
	if ((sel.ay > sel.by) || (sel.ay == sel.by && sel.ax > sel.bx)) s = {ax: sel.bx, ay: sel.by, bx: sel.ax, by: sel.ay}
	else s = {ax: sel.ax, ay: sel.ay, bx: sel.bx, by: sel.by}
	return s
}

TEdit.can.draw = function(state) {
	dnaof(this, state)
	if (state.focused) F = this.pal[2], this.caret = { x: this.cursor.x, y: this.cursor.y - this.d }
	else delete this.caret
	var sel = sortSelection(this.sel)
	var y = -this.d, selState, Y = 0
	for (var i = 0; i < this.L.length; i++) {
		var B = breakPara(this.L[i], this.w)
		var C = colorizeString(this.L[i])
		var P = getParts(this.L[i], C, B)
		for (var p = 0; p < P.s.length; p++) {
			if (Y < sel.ay) selState = 0
			else if (Y == sel.ay) {
				if (Y != sel.by) selState = 1; else selState = 2
			} else if (Y == sel.by) selState = 3
			else if (Y > sel.by) selState = 4
			else selState = 5
			if (y >= this.h) break
			if (y >= 0) {
				for (var x = 0; x < P.s[p].length; x++) {
					B = this.pal[1]
					if (selState == 5 || 
					   (selState == 1 && x >= sel.ax) 
					|| (selState == 2 && x >= sel.ax && x < sel.bx) 
					|| (selState == 3&& x < sel.bx)
					) B = this.pal[2]
					this.set(x, y, P.s[p][x], this.pal[P.c[p][x] + 4], B)
				}
			}
			y++, Y++
		}
		if (y >= this.h) break
	}
}
TEdit.can.editBack = function() {
//	var i = this.text.length
//	this.text = this.text.substr(0, this.text.length - 1)
//	this.getDesktop().display.caretReset()
//	return true
}
TEdit.can.editBackWord = function() {
//	var s = this.text.split(' ')
//	s.pop()
//	this.text = s.join(' ')
//	this.getDesktop().display.caretReset()
//	return true
}
TEdit.can.getText = function() {
	return this.L.join('\n')
}
TEdit.can.setText = function(s) {
	this.L = s.split('\n')
}
//TEdit.can.onKey = function(k) {
//	var R = dnaof(this, k)
//	if (!R && k.char != undefined) {
//		if (k.plain == true) {
//			this.text += k.char
//			this.getDesktop().display.caretReset()
//			return true
//		}
//	}
//	return R
//}


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
// auto keyword list by appearance in this file + config with weights

editFileAlt = function(s) {
	glxwin.sh_async('pluma '+ s)
}


