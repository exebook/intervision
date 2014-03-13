TWindow = kindof(TGroup)
TWindow.can.init = function() {
	dnaof(this)
	this.border = 0
	this.name = 'TWindow'
	this.pal = getColor.window
}
TWindow.can.getArea = function() {
	return {
		x: 1 + this.border * 3,
		y: 1 + this.border,
		w: this.w - 2 - this.border * 6,
		h: this.h - 2 - this.border * 2
	}
}
TWindow.can.solo = function(child) {
	this.add(child)
	var area = this.getArea()
	child.size(area.w, area.h)
	child.pos(0, 0)
}
TWindow.can.draw = function(state) {
	this.clear()
	this.drawFrame(state, this.border * 3, this.border, this.w - this.border * 6, this.h - this.border * 2)
	dnaof(this, state)
	if (this.disabled == true) state.disabled = true
}

TWindow.can.drawFrame = function(state, x, y, w, h) {
//	var F = this.color.get(state), B = F[1]; F = F[0]
	var F = this.pal[0], B = this.pal[1]
	if (state.active) F = this.pal[2]
	if (state.disabled) F = this.pal[3]//(F & 0xfff) | 0x8000
//	if (state.focused && this.actor == undefined) F = 0xfff;//(F & 0xfff) | 0x8000
	this.set(x, y, '╔', F, B)
	this.set(x+ w - 1, y + h - 1, '╝', F, B)
	this.set(x, y + h - 1, '╚', F, B)
	this.set(x + w - 1, y, '╗', F, B)
	this.rect(x + 1, y, w - 2, 1, '═', F, B)
	this.rect(x + 1, y + h - 1, w - 2, 1, '═', F, B)
	this.rect(x, y + 1, 1, h - 2, '║', F, B)
	this.rect(x + w - 1, y + 1, 1, h - 2, '║', F, B)
	if (this.title != undefined) {
		var title = ''
		if (typeof this.title == 'string') title = this.title
		if (typeof this.title == 'function') title = this.title.apply(this)
		if (title.length > this.w) title = title.substr(title.length - this.w, this.w)
		if (state.active) { F = this.pal[2], B = this.pal[3] }
		this.print((this.w >> 1) - (title.length + 2 >> 1), y, ' '+title+' ', F, B)
	}
	if (this.bottom_title != undefined) {
		var title = ''
		if (typeof this.bottom_title == 'string') title = this.bottom_title
		if (typeof this.bottom_title == 'function') title = this.bottom_title()
		this.print((this.w >> 1) - (title.length + 2 >> 1), this.h-1 - (1 * this.border), ' '+title+' ', this.pal[0], this.pal[1])
	}
}

