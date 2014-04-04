TList = kindof(TView)

TList.can.init = function() {
	dnaof(this)
	this.pal = getColor.list
	this.columns = 3
	this.clearItems()
	this.name = 'TList'
	this.slideSelMode = -1
	this.react(0, keycode.UP, this.moveCursor, { arg:'up', role:['move'] })
	this.react(0, keycode.DOWN, this.moveCursor, { arg:'down', role:['move'] })
	this.react(0, keycode.LEFT, this.moveCursor, { arg:'left', role:['move'] })
	this.react(0, keycode.RIGHT, this.moveCursor, { arg:'right', role:['move'] })
	this.react(0, keycode.HOME, this.moveCursor, { arg:'home', role:['move'] })
	this.react(0, keycode.END, this.moveCursor, { arg:'end', role:['move'] })
	this.react(0, keycode.PAGE_UP, this.moveCursor, { arg:'pageup', role:['move'] })
	this.react(0, keycode.PAGE_DOWN, this.moveCursor, { arg:'pagedown', role:['move'] })
	this.react(100, keycode['a'], this.userSelect, { arg:'all', role:['select'] })
	this.react(0, keycode.INSERT, this.userSelect, { arg:'current', role:['select'] })
	this.react(100, keycode['2'], this.lessColumns, { role:['view'] })
	this.react(100, keycode['1'], this.moreColumns, { role:['view'] })
	this.react(1, keycode.RIGHT_SHIFT, this.shiftSel, { arg: 'start'})
	this.react(1, keycode.LEFT_SHIFT, this.shiftSel, { arg: 'start'})
	this.react(0, keycode.RIGHT_SHIFT, this.shiftSel, {arg: 'end', down: false})
	this.react(0, keycode.LEFT_SHIFT, this.shiftSel, {arg: 'end', down: false})
	this.react(1, keycode.UP, this.shiftSel, { arg:'up', role:['move'] })
	this.react(1, keycode.DOWN, this.shiftSel, { arg:'down', role:['move'] })
	this.react(1, keycode.LEFT, this.shiftSel, { arg:'left', role:['move'] })
	this.react(1, keycode.RIGHT, this.shiftSel, { arg:'right', role:['move'] })
	this.react(1, keycode.HOME, this.shiftSel, { arg:'home', role:['move'] })
	this.react(1, keycode.END, this.shiftSel, { arg:'end', role:['move'] })
	this.react(1, keycode.PAGE_UP, this.shiftSel, { arg:'pageup', role:['move'] })
	this.react(1, keycode.PAGE_DOWN, this.shiftSel, { arg:'pagedown', role:['move'] })
}

TList.can.clearItems = function(arg) {
	this.items = []
	this.selection = []
	this.sid = 0
	this.d = 0
}

TList.can.shiftSel = function(arg) {
	if (arg == 'start') {
		var item = this.items[this.sid]
		if (this.sid == 0 && this.items[this.sid].name == '..') {
			if (this.items.length <= 1) return false
			item = this.items[1]
		}
		if (item.selected == true) this.shiftSelActive = false; else this.shiftSelActive = true
		return false
	}
	if (arg == 'end') {
		delete this.shiftSelActive
		return false
	}
	var start = this.sid
	this.moveCursor(arg)
	var end = this.sid
	if (start > end) { var tmp = start; start = end; end = tmp }
	if (start != end) {
		var oldOnSelect = this.selChanged
		while (start <= end) {
			this.selectItem(start++, this.shiftSelActive)
		}
		this.selChanged = oldOnSelect
		if (this.selChanged != undefined) this.selChanged()
	}
	return true
}

TList.can.moveCursor = function(arg) { with (this) {
	var old = sid
	if (arg == 'down') {
		sid++
		if (sid > items.length - 1) sid = items.length - 1
		if (sid >= d + (h * columns)) d++
	} else if (arg == 'up') {
		sid--; if (sid < 0) sid = 0
		if (sid < d) d = sid
	} else if (arg == 'left') {
		sid -= h; if (sid < 0) sid = 0
		if (sid < d) d -= h
		if (d < 0) d = 0
	} else if (arg == 'right') {
		sid += h
		if (sid > items.length - 1) sid = items.length - 1
		if (sid >= d + (h * columns)) d += h
	} else if (arg == 'home') {
		sid = 0; d = 0;
	} else if (arg == 'end') {
		sid = items.length - 1
		d = sid - (h * columns - 1 - (h >> 1))
		if (d < 0) d = 0
	} else if (arg == 'pageup') {
		sid -= (h * columns - 1); if (sid < 0) sid = 0
		if (sid < d) d -= (h * columns - 1)
		if (d < 0) d = 0
	} else if (arg == 'pagedown') {
		sid += (h * columns - 1)
		if (sid > items.length - 1) sid = items.length - 1
		if (sid >= d + (h * columns)) d += (h * columns - 1)
	}
	if (old != sid) { onItem(); return true }
}}

TList.can.userSelect = function(arg) { with (this) {
	if (arg == 'all') selectAll()
	else if (arg == 'current') {
		var old = sid
		invertCurrent()
		sid++
		if (sid > items.length - 1) sid = items.length - 1
		if (sid >= d + (h * columns)) d++
		if (old != sid) onItem()
		if (this.selChanged != undefined) selChanged()
	}
	return true
}}

TList.can.moreColumns = function() {
	if (this.columns < this.w / 5) {
		this.columns++
		return true
	}
}

TList.can.lessColumns = function() {
	if (this.columns > 1) { this.columns--; return true }
}

TList.can.drawItem = function(state) {
//	var F = this.color.get(state), B = F[1]; F = F[0]
	var F = this.pal[0], B = this.pal[1]
	if (state.focused) F = this.pal[2], B = this.pal[3]
	if (state.selected) F = this.pal[4]
//	if (state.focused && state.selected) F = this.pal[5]
	var s = state.item.name
	if (s.length > state.w) s = s.substr(0, state.w)
	this.rect(state.x, state.y, state.w, 1, ' ', undefined, B)
	this.print(state.x, state.y, s, F, B)
	return true
}

TList.can.draw = function(state, customDraw) {
	if (this.w == undefined) return
	dnaof(this, state) // todo: remove this line
	if (this.items == undefined) return
	var y = 0, cy = 0, x = 0, cw = ((this.w - (this.columns-1)) / this.columns), c = 0
	var i = this.d
	var showFocusedItem = (state.focused || this.showFocused == true)
	this.column_x = [0]
	while (true) {
		if (y >= this.h * this.columns) break
		if (cy >= this.h) {
			x += cw + 1
			this.column_x.push(Math.floor(x - 1))
			if (++c == this.columns - 1) cw = this.w - x
			this.rect(Math.floor(x - 1), 0, 1, this.h, graphChar['│'], this.pal[0] | 0x8000, undefined)
			cy = 0
		}
		if (i < this.items.length) {
			var B = undefined
			var itemFocused = (i == this.sid && showFocusedItem)
			var itemSelected = (this.items[i].selected != undefined && this.items[i].selected)
			if (customDraw != undefined) { if (customDraw(this.items[i], Math.floor(x), cy, Math.floor(cw), itemFocused) == true) break }
			else if (this.drawItem({
				item: this.items[i],
				x: Math.floor(x),
				y: cy,
				w: Math.floor(cw),
				focused: itemFocused,
				selected: itemSelected
			}) != true) break
		}
		y++, cy++, i++
	}
}
TList.can.onItem = function () {
}

TList.can.whoAtXY = function(x, y) {
	var me = this, found = -1
	this.draw({}, function(n, X, Y, W, focus) {
		if (x < X + W && y == Y) {
			var a = me.items.indexOf(n)
			if (a >= 0) found = a
			return true // stop iterating
		}
	})
	return found
}
TList.can.onMouse = function(hand) {
	if (!hand.down && hand.button == 0) this.sliding = false
	if (!hand.down && hand.button == 1) this.sliding1 = false
	if (hand.down && (hand.button == 0 || hand.button == 1)) {
		if (hand.button == 0) this.sliding = true
		if (hand.button == 1) this.sliding1 = true
		var found = this.whoAtXY(hand.x, hand.y)
		if (found >= 0) {
			if (hand.button == 1) {
				this.sid = found;
				this.slideSelMode = !this.items[this.sid].selected
				this.selectCurrent(this.slideSelMode)
				return true
			}
			if (this.sid == found) return false;
			var old = this.sid; this.sid = found;
			if (hand.button == 0) this.onItem()
			return true
		}
		this.sid = this.items.length - 1
		return true
	}
	if  (hand.button == 3) {
		if (hand.down) this.moveCursor('down')
		else this.moveCursor('up')
		return true
	}
}
TList.can.onCursor = function(hand) {
	if (button_state[0] != true) this.sliding = false
	if (button_state[0] && this.sliding) return this.onMouse({ button: 0, down: true, x:hand.x, y:hand.y })
	if (button_state[1] != true) this.sliding1 = false
	if (button_state[1] && this.sliding1) {
		this.onMouse({button: 0, down: true, x:hand.x, y:hand.y })
		this.selectCurrent(this.slideSelMode)
		return true
	}
}

TList.can.selectNone = function() {
	this.selection = []
	for (var i = 0; i < this.items.length; i++) delete this.items[i].selected
	return true
}

TList.can.selectAll = function() {
	if (this.selection.length == this.items.length) this.selectNone()
	else {
		this.selection = []
		//if (this.items[i].name != '..')
		for (var i = 0; i < this.items.length; i++) this.selection.push(i), this.items[i].selected = true
	}
	if (this.selChanged != undefined) this.selChanged()
	return true
}

TList.can.selectItem = function(_id, on) { with (this) {
	var j = selection.indexOf(_id)
	if (items[_id].dir && items[_id].name == '..') return
	if (on == true) {
		if (items[_id].selected == undefined) {
			selection.push(_id)
			items[_id].selected = true
			if (this.selChanged != undefined) this.selChanged()
			return true
		}
	} else {
		if (items[_id].selected) {
			selection.splice(j, 1)
			delete items[_id].selected
			if (this.selChanged != undefined) this.selChanged()
			return true
		}
	}
	return false
}}

TList.can.selectCurrent = function(on) {
	return this.selectItem(this.sid, on)
}

TList.can.invertCurrent = function() { with (this) {
	var j = selection.indexOf(sid)
	if (items[sid].dir && items[sid].name == '..') return
	selectCurrent(j < 0)
}}

TList.can.scrollIntoView = function() { with(this) {
	if (sid < d) d = sid
	if (sid > d + (columns * h) - 1) {
		d = sid - (((columns * h) - 1) >> 1)
		if (d < 0) d = 0
	}
}}

TList.can.onKey = function(K) {
	if (K.mod.alt && K.char!= undefined) {
		if (this.onAltChar) this.onAltChar(K)
		return true
	}
	return dnaof(this, K)
}
'│─┴'
