fonts = [
{ name: '/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf', extra_x: 0, tune_y: 0 },
{ name: '/usr/share/fonts/truetype/msttcorefonts/Andale_Mono.ttf', extra_x: 0, tune_y: -1 },
{ name: '/usr/share/fonts/truetype/ttf-dejavu/DejaVuSansMono.ttf', extra_x: 0, tune_y: 0 },
{ name: '/usr/share/fonts/truetype/ttf-dejavu/DejaVuSansMono-Oblique.ttf', extra_x: 0, tune_y: 0 },
{ name: '/usr/share/fonts/truetype/ubuntu-font-family/UbuntuMono-R.ttf',  extra_x: 0, tune_y: -1 },
{ name: '/y/yaui/glx/f/consola.ttf', extra_x: -1, tune_y: 0 },
{ name: '/y/yaui/glx/f/fixed7.ttf', extra_x: 0, tune_y: 0 },
]

function selectFirstAvailableFont() {
	for (var i = 0; i < fonts.length; i++) if (glxwin.ijs_fileexists(fonts[i].name)) return i
	return -1
}

var PanelWidth = 45, PanelHeight = 32
var f = selectFirstAvailableFont()
if (f < 0); f = 4
//var W = native_create_win(undefined, fonts[f].name, 18, fonts[f].extra_x, fonts[f].tune_y)


function renderView(win, view, atx, aty) {
	var TEXT = [], COLOR = []
	for (var y = 0; y < view.h; y++) {
		TEXT[y] = [], COLOR[y] = []
		for (var x = 0; x < view.w; x++) {
			var ch = 32, clr = 0xfff
			var o = view.get(x, y)
			if (o != undefined) {
				if (o.ch != undefined) ch = o.ch.charCodeAt(0)
				if (o.fg != undefined) clr = o.fg & 0xffff
				if (o.bg != undefined) clr = clr | (o.bg & 0xffff) << 16
			}
			TEXT[y][x] = ch, COLOR[y][x] = clr
		}
	}
	win.colorText(atx, aty, view.w, view.h, TEXT, COLOR)
/*	if (this.caretDisabled != true && this.caretFlash && view.caret != undefined) {
			if (this.caretVertical)
			native_crect(this.handle,
				view.caret.x * this.fnt[0], view.caret.y * this.fnt[1],                   // vertical
				view.caret.x * this.fnt[0] + 2, view.caret.y * this.fnt[1] + this.fnt[1],
				0xdd00ffff)
			else native_crect(this.handle,
				view.caret.x * this.fnt[0], view.caret.y * this.fnt[1] + this.fnt[1] - 3,   // horizontal
				view.caret.x * this.fnt[0] + this.fnt[0], view.caret.y * this.fnt[1] + this.fnt[1],
				0xdd00ffff)
		}*/
}


TGLXVision = kindof(TGLXWin)

TGLXVision.can.init = function(x, y, w, h) {
	dnaof(this, undefined, fonts[f].name, 18, fonts[f].extra_x, fonts[f].tune_y)
	this.fnt = this.applyFont()// not implemented at all yet..'./fixed7.ttf', 11, 0, 0xffffff)
	this.desktop = TDesktop.create()
	this.desktop.init()
	this.desktop.pos(0, 0)
	this.desktop.size(Math.floor(w / this.fnt[0]), Math.floor(h / this.fnt[1]))
	this.caretFlash = false
	this.caretVertical = false
	this.name = 'TGLXVision'
	this.caretReset()
	this.setXYWH(x, y, w, h)
}

TGLXVision.can.caretReset = function() {
//	if (this.caretInterval != undefined) clearInterval(this.caretInterval)
//	this.caretInterval = setInterval(function() { this.caretFlash = !this.caretFlash; if (Desktop.caret != undefined) repaint() }, 450)
//	this.caretFlash = true
//	repaint()
}

TGLXVision.can.onSize = function(w, h) {
	var W = Math.floor(w / this.fnt[0]), H = Math.floor(h / this.fnt[1])
	if (this.desktop.w != W || this.desktop.h != H) this.desktop.size(W, H)
	if (W * this.fnt[0] != w || H * this.fnt[1] != h) {
		var A = this.getXYWH()
		if (this.sizeTimer != undefined) clearTimeout(this.sizeTimer)
		var me = this
		this.sizeTimer = setTimeout(function() {
			me.setXYWH(undefined, undefined, W * me.fnt[0], H * me.fnt[1])
			delete me.sizeTimer
		}, 200)
	}
}
TGLXVision.can.onPaint = function() {
	this.desktop.draw({focused:true})
	renderView(this, this.desktop, 0, 0)

	var A = this.getXYWH(),
		x = this.desktop.w * this.fnt[0],
		y = this.desktop.h * this.fnt[1],
		w = A[2] - 0,
		h = A[3] - 0
	this.crect(x, 0, w, h, 0xff000000)
	this.crect(0, y, x, h, 0xff000000)
}
key_modifiers = [false,false,false,false,false,false,false,false,false] //0-control 3-alt 6-shift

function key_check(key, down) {
	if (key == 37) key_modifiers[1] = down
	if (key == 105) key_modifiers[2] = down
	if (key == 64) key_modifiers[4] = down
	if (key == 108) key_modifiers[5] = down
	if (key == 50) key_modifiers[7] = down
	if (key == 62) key_modifiers[8] = down
	key_modifiers[0] = key_modifiers[1] || key_modifiers[2] // CONTROL
	key_modifiers[3] = key_modifiers[4] || key_modifiers[5] // ALT
	key_modifiers[6] = key_modifiers[7] || key_modifiers[8] // SHIFT
//	log('key_modifiers=', key_modifiers)
}

TGLXVision.can.onKey = function(key, down, physical) {
	key_check(key, false)
	this.desktop.onKey(key, down, physical)
}

button_state = []

TGLXVision.can.onMouse = function(button, down, x, y) {
	button_state[button] = down
	x = Math.floor(x / this.fnt[0])
	y = Math.floor(y / this.fnt[1])
	if (this.desktop.onMouse(button, down, x, y)) this.repaint()
	//if () repaint
}


cursor_pos_cache = {x:-1, y:-1}

TGLXVision.can.onCursor = function (x, y) {
	x = Math.floor(x / this.fnt[0])
	y = Math.floor(y / this.fnt[1])
	if (x != cursor_pos_cache.x || y != cursor_pos_cache.y) {
		cursor_pos_cache = {x:x, y:y}
		if (this.desktop.onCursor(x, y)) repaint()
	}
	return
}

TGLXVision.can.onChar = function (ch) {
	this.desktop.onChar(ch)
}


repaint = function() {
	glxwin.mainWindow.repaint()
}

//this.win.onCursor = function(x, y) { X = x, Y = y; this.repaint() }


/*


yaui_on_focus = function(handle, on) {
	display.caretDisabled = !on
	for (var i = 0; i < key_modifiers.length; i++) key_modifiers[i] = false
}

*/
