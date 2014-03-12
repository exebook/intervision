
nortonPalette = {
	view: [0xaa0, 0x700],
	window: [0xaa0, 0x700, 0xff0, 0xa44],
	dialog: [0x555, 0xbcd, 0x444, 0x9ab, 0x555, 0, 0xefe],//	$.bg = , $.frame.fg = 0x555, $.frame.fg_focus = 0,
	list: [0xaa0, 0x700, 0x700, 0x880, 0x0ff],//0xff0, 0x880, 0xfff],//, 0x00f, 0xafa, 0x88f],
//	filelist: [0x700, 0xff0, 0x880, 0xfff, 0x00f, 0xafa, 0x88f],
	filelist: [0xff0, 0x700, 0xfff, 0xff,
		0, 0, 0x880, 0, 0],
	label: [0, 0xe0e, 0xf00, 0x0f0],
	button: [0, 0x888],
	edit: [0x990, 0x500, 0xff0],
	console: [0x6a6, 0x021]
}

getColor = nortonPalette

//colorDialog.init({ fore: 0x000, back: 0x89a, focusFore: 0xff0, labelFore: 0x444, inputBack:0x990, focusBack: 0x700, selFore: 0xff0, selBack: 0x700, disabled: 0xa44 })

TView = kindof(TKeyInput)

TView.can.init = function() {
	dnaof(this)
	this.name = 'TView'
	this.pal = getColor.view
}
TView.can.getDesktop = function() {
	return this.parent.getDesktop()
}
TView.can.repaint = function() {
	this.parent.repaint()
}
TView.can.size = function(w, h) {
	this.w = w, this.h = h, this.data = []
}
TView.can.pos = function(x, y) {
	this.x = x, this.y = y
}
TView.can.get = function (x, y) {
	if (this.data[y] == undefined) return undefined
	return this.data[y][x]
}
TView.can.set = function (x, y, ch, fg, bg) {
	if (this.data[y] == undefined) this.data[y] = []
	var o = this.data[y][x]
	if (o == undefined) o = { }
	if (ch != undefined) o.ch = ch
	if (fg != undefined) o.fg = fg
	if (bg != undefined) o.bg = bg
	this.data[y][x] = o
}
TView.can.render = function() {
	if (this.caret != undefined) {
		this.parent.caret = { x:this.caret.x + this.x, y:this.caret.y + this.y }
	}
	for (var y = 0; y < this.h; y++) {
		for (var x = 0; x < this.w; x++) {
			var o = this.get(x, y)
			if (o != undefined) {
				this.parent.set(this.x+x, this.y+y, o.ch, o.fg, o.bg)
			}
		}
	}
}
TView.can.print = function (x, y, s, fg, bg) {
	var e = s.length
	if (x + e > this.w) e = this.w - x
	for (var i = 0; i < e; i++) {
		this.set(x + i, y, s.charAt(i), fg, bg)
	}
}
TView.can.rect = function(X, Y, w, h, ch, fg, bg) {
	for (var y = Y; y < Y+h; y++) {
		for (var x = X; x < X+w; x++) {
			this.set(x, y, ch, fg, bg)
		}
	}
}
TView.can.clear = function(fg, bg) {
	if (fg == undefined) fg = this.pal[0]
	if (bg == undefined) bg = this.pal[1]
	this.rect(0, 0, this.w, this.h, ' ', fg, bg)
}
TView.can.draw = function(state) {
	this.clear(this.pal[0], this.pal[1])
}

TView.can.visible = function() {
	return (this.hidden == undefined || this.hidden == false)
}

