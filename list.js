TList = kindof(TView)

TList.can.init = function() {
	dnaof(this)
	this.items = [], this.d = 0, this.sid = 0
	this.pal = getColor.list
	this.selection = []
	this.columns = 3
	this.name = 'TList'
	this.slideSelMode = -1
}

TList.can.drawItem = function(item, x, y, w, state) {
//	var F = this.color.get(state), B = F[1]; F = F[0]
	var F = this.pal[0], B = this.pal[1]
	if (state.focused) F = this.pal[2], B = this.pal[3]
	if (state.selected) F = this.pal[4]
//	if (state.focused && state.selected) F = this.pal[5]
	var s = item.name
	if (s.length > w) s = s.substr(0, w)
	this.rect(x, y, w, 1, ' ', undefined, B)
	this.print(x, y, s, F, B)
	return true
}

TList.can.draw = function(status, customDraw) {
	dnaof(this, status) // todo: remove this line
	if (this.items == undefined) return
	var y = 0, cy = 0, x = 0, cw = ((this.w - (this.columns-1)) / this.columns), c = 0
	var i = this.d
	this.column_x = [0]
	while (true) {
		if (y >= this.h * this.columns) break
		if (cy >= this.h) {
			x += cw + 1
			this.column_x.push(Math.floor(x - 1))
			if (++c == this.columns - 1) cw = this.w - x
			this.rect(Math.floor(x - 1), 0, 1, this.h, '│', this.pal[0] | 0x8000, undefined)
			cy = 0
		}
		if (i < this.items.length) {
			var B = undefined
			var itemFocused = (i == this.sid && status.focused)
			var itemSelected = (this.items[i].selected != undefined && this.items[i].selected)
			if (customDraw != undefined) { if (customDraw(this.items[i], Math.floor(x), cy, Math.floor(cw), itemFocused) == true) break }
			else if (this.drawItem(this.items[i], Math.floor(x), cy, Math.floor(cw), { focused: itemFocused, selected: itemSelected} ) != true) break
		}
		y++, cy++, i++
	}
}
TList.can.onItem = function () {
}
TList.can.antiBlink = 0
TList.can.onChar = function(char) {
	log('TList.char=', char)
}
TList.can.onKey = function(key, down, physical) { with (this) {
	if (!down) return false
	var old = sid
	if (key == 116) { // Down
		sid++
		if (sid > items.length - 1) sid = items.length - 1
		if (sid >= d + (h * columns)) d++
	} else if (key == 111) { // Up
		sid--; if (sid < 0) sid = 0
		if (sid < d) d = sid
	} else if (key == 113) { // Left
		sid -= h; if (sid < 0) sid = 0
		if (sid < d) d -= h
		if (d < 0) d = 0
	} else if (key == 114) { // Right
		sid += h
		if (sid > items.length - 1) sid = items.length - 1
		if (sid >= d + (h * columns)) d += h
	} else if (key == 38 && key_modifiers[0]) { // Control-A
		this.selectAll()
		repaint()
	} else if (key == 118) { // Insert
		invertCurrent()
		sid++
		if (sid > items.length - 1) sid = items.length - 1
		if (sid >= d + (h * columns)) d++
		if (this.selChanged != undefined) this.selChanged()
		repaint()
	} else if (key == 110) { // Home
		sid = 0; d = 0;
		repaint()
	} else if (key == 115) { // End
		sid = items.length - 1
		d = sid - (h * columns - 1 - (h >> 1))
		if (d < 0) d = 0
		repaint()
	} else if (key == 112) { // Page UP
		sid -= (h * columns - 1); if (sid < 0) sid = 0
		if (sid < d) d -= (h * columns - 1)
		if (d < 0) d = 0
		repaint()
	} else if (key == 117) { // Page Down
		sid += (h * columns - 1)
		if (sid > items.length - 1) sid = items.length - 1
		if (sid >= d + (h * columns)) d += (h * columns - 1)
		repaint()
	} else if (key == 11 && key_modifiers[0]) { // Control-2
		if (this.columns > 1) this.columns--
		repaint()
	} else if (key == 10 && key_modifiers[0]) { // Control-1
		if (this.columns < this.w / 5) this.columns++
		repaint()
	} else return false
	if (old != sid) onItem()
	repaint()
	return true
}}

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
TList.can.onMouse = function(button, down, x, y) {
	if (!down && button == 0) this.sliding = false
	if (!down && button == 1) this.sliding1 = false
	if (down && (button == 0 || button == 1)) {
		if (button == 0) this.sliding = true
		if (button == 1) this.sliding1 = true
		var found = this.whoAtXY(x, y)
		if (found >= 0) {
			if (button == 1) {
				this.sid = found;
				this.slideSelMode = !this.items[this.sid].selected
				this.selectCurrent(this.slideSelMode)
				return true
			}
			if (this.sid == found) return false;
			var old = this.sid; this.sid = found;
			if (button == 0) this.onItem()
			return true
		}
		this.sid = this.items.length - 1
		return true
	}
}
TList.can.onCursor = function(x, y) {
	if (button_state[0] != true) this.sliding = false
	if (button_state[0] && this.sliding) return this.onMouse(0, true, x, y)
	if (button_state[1] != true) this.sliding1 = false
	if (button_state[1] && this.sliding1) {
		this.onMouse(0, true, x, y)
		this.selectCurrent(this.slideSelMode)
		return true
	}
}

TList.can.selectNone = function() {
	this.selection = []
	for (var i = 0; i < this.items.length; i++) delete this.items[i].selected
}

TList.can.selectAll = function() {
	if (this.selection.length == this.items.length) this.selectNone()
	else {
		this.selection = []
		//if (this.items[i].name != '..')
		for (var i = 0; i < this.items.length; i++) this.selection.push(i), this.items[i].selected = true
	}
	if (this.selChanged != undefined) this.selChanged()
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

'│─┴'
