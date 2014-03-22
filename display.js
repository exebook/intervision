var fs = require('fs')
fonts = [
{ name: '/usr/share/fonts/truetype/ttf-dejavu/DejaVuSansMono.ttf', extra_x: 0, tune_y: 0 },
{ name: '/usr/share/fonts/truetype/tlwg/TlwgTypewriter.ttf'},
{ name: '/usr/share/fonts/truetype/freefont/FreeMono.ttf', extra_x: 0, tune_y: -1 },
//{ name: '', extra_x: 0, tune_y: 0 },
{ name: '/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf', extra_x: 0, tune_y: -1 },
{ name: '/usr/share/fonts/truetype/msttcorefonts/Andale_Mono.ttf', extra_x: 0, tune_y: -1 },
{ name: '/usr/share/fonts/truetype/ttf-dejavu/DejaVuSansMono-Oblique.ttf', extra_x: 0, tune_y: -1 },
{ name: '/usr/share/fonts/truetype/ubuntu-font-family/UbuntuMono-R.ttf',  extra_x: 0, tune_y: -1 },
{ name: '/usr/share/fonts/truetype/ttf-liberation/LiberationMono-Regular.ttf', extra_x: 0, tune_y: -1 },
{ name: '/y/yaui/glx/f/consola.ttf', extra_x: -1, tune_y: 0 },
{ name: '/y/yaui/glx/f/fixed7.ttf', extra_x: 0, tune_y: 0 },
]
markerModified = 'x'
var fontSize = 22
function selectFirstAvailableFont() {
	for (var i = 0; i < fonts.length; i++) if (fs.existsSync(fonts[i].name)) return i
	return -1
}

var f = selectFirstAvailableFont()
f = 3

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

TGLXVision.can.init = function(desktopKind, W, H) {
	dnaof(this, undefined, fonts[f].name, fontSize, fonts[f].extra_x, fonts[f].tune_y)
	this.fnt = this.applyFont()// not implemented at all yet..'./fixed7.ttf', 11, 0, 0xffffff)
	this.desktop = desktopKind.create(W, H)
	this.desktop.pos(0, 0)
	this.desktop.size(W, H)
	this.desktop.display = this
	var me = this
	this.desktop.repaint = function() { me.repaint() }
	this.caretFlash = false
	this.caretVertical = false
	this.name = 'TGLXVision'
	this.caretReset()
	this.setXYWH(undefined, undefined, W * this.fnt[0], H * this.fnt[1])
}

TGLXVision.can.caretDraw= function() {
	if (this.desktop.caret != undefined && this.caretDisabled != true) {
		this.paintBegin()
		var x = this.desktop.caret.x, y = this.desktop.caret.y
		var ch = 32, clr = 0xfff
		var o = this.desktop.get(x, y)
		if (o != undefined) {
			if (o.ch != undefined) ch = o.ch.charCodeAt(0)
			if (o.fg != undefined) clr = o.fg & 0xffff
			if (o.bg != undefined) clr = clr | (o.bg & 0xffff) << 16
		}
		var TEXT = [[]], COLOR = [[]]
		TEXT[0][0] = ch, COLOR[0][0] = clr
		x = this.fnt[0] * x, y = this.fnt[1] * y
		this.colorText(x, y, 1, 1, TEXT, COLOR)
		if (this.caretFlash == true) 
			if (this.caretVertical == true)
				this.crect(x,  y, x + 3, y + this.fnt[1], 0xffffffff)
			else
				this.crect(x,  y + this.fnt[1] - 3, x + this.fnt[0], y + this.fnt[1], 0xffffffff)
		this.paintEnd()
	}
}

TGLXVision.can.caretReset = function() {
	if (this.caretInterval != undefined) clearInterval(this.caretInterval)
	var me = this
	this.caretInterval = setInterval(function() {
		me.caretFlash = !me.caretFlash
		me.caretDraw()
	}, 450)
	this.caretFlash = true
	me.caretDraw()
}

TGLXVision.can.onSizeDo = function() {
	var w = this.resizeLast.w, h = this.resizeLast.h
	var W = Math.floor(w / this.fnt[0]), H = Math.floor(h / this.fnt[1])
	if (this.desktop.w != W || this.desktop.h != H) {
		this.desktop.size(W, H)
		this.repaint()
	}
}

TGLXVision.can.onSize = function(w, h) {
	if (this.ignoreResize == true) {
		this.ignoreResize = false
		return
	}
	var me = this
	this.resizeLast = {w:w, h:h}
	if (this.resizer == undefined) this.resizer = setInterval(function() {
		me.onSizeDo()
	}, 200)
	if (this. stopResize != undefined) clearTimeout(this.stopResize)
	this. stopResize = setTimeout(function(){
		this. stopResize  = undefined
		clearInterval(this.resizer)
		this.resizer = undefined
		var W = me.desktop.w * me.fnt[0], H = me.desktop.h * me.fnt[1]
		me.ignoreResize = true
		me.setXYWH(undefined, undefined, W, H)
	}, 400)
}

TGLXVision.can.onPaint = function() {
	var A = this.getXYWH()
	this.crect(0, 0, A[2], A[3], 0xff000000)
	if (this.caretOnly == true) return
//	try { // TODO: make all C++ win::callbacks automagic with error and backtrace
		this.desktop.draw({ active:true, focused: true })
		renderView(this, this.desktop, 0, 0)
		var x = this.desktop.w * this.fnt[0],
			y = this.desktop.h * this.fnt[1],
			w = A[2] - 0,
			h = A[3] - 0
		this.crect(x, 0, w, h, 0xff000000)
		this.crect(0, y, x, h, 0xff000000)
//	} catch (e) {
//		console.log(e)
//		backtrace()
//	}
	this.caretDraw()
}

keycode = {
	F1: 67, F2:68, F3:69, F4:70, F5:71, F6: 72, F7: 73, F8:74, F9: 75, F10: 76,
	ESCAPE: 9, ENTER: 36, TAB: 23, F11: 95, F12: 96,
	BACK_SPACE: 22, PRINT_SCREEN: 107, PAUSE_BREAK: 127, SPACE: 65,
	INSERT: 118, DELETE: 119, HOME: 110, END: 115, PAGE_UP: 112, PAGE_DOWN: 117, POPUP_MENU: 135,
	LEFT_SHIFT: 50, LEFT_CONTROL: 37, LEFT_ALT: 64,
	RIGHT_ALT: 108, RIGHT_CONTROL: 105, RIGHT_SHIFT: 62,
	UP:111, DOWN: 116, LEFT: 113, RIGHT: 114, CAPS_LOCK: 66,
	'1':10, '2':11, '3':12, '4':13, '5':14, '6':15, '7':16, '8': 17, '9': 18, '0':19, '-':20, '=':21,
	'q':24,'w':25,'e':26,'r':27,'t':28,'y':29,'u':30,'i':31,'o':32,'p':33,'[':34,']':35,
	'a':38,'s':39,'d':40,'f':41,'g':42,'h':43,'j':44,'k':45,'l':46,';':47,"'":48,'`':49,
	'\\': 51,'z':52,'x':53,'c':54,'v':55,'b':56,'n':57,'m':58,',':59,'.':60,'/':61,
}
findKeyCode = function(C) {
	for (var i in keycode) if (keycode[i] == C) return i
}

keyModifiers = [false,false,false,false,false,false,false,false,false]

function keyCheck(key, down) { with(keycode) {
	if (key == LEFT_CONTROL) keyModifiers[1] = down
	if (key == RIGHT_CONTROL) keyModifiers[2] = down
	if (key == LEFT_ALT) keyModifiers[4] = down
	if (key == RIGHT_ALT) keyModifiers[5] = down
	if (key == LEFT_SHIFT) keyModifiers[7] = down
	if (key == RIGHT_SHIFT) keyModifiers[8] = down
	keyModifiers[0] = keyModifiers[1] || keyModifiers[2] // CONTROL
	keyModifiers[3] = keyModifiers[4] || keyModifiers[5] // ALT
	keyModifiers[6] = keyModifiers[7] || keyModifiers[8] // SHIFT
}}

TGLXVision.can.onKey = function(down, char, key, physical) {
	keyCheck(key, down)
	var k = keyModifiers
	var mod = {
		control: k[0], alt: k[3], shift: k[6],
		left: { control: k[1], alt: k[4], shift: k[7] },
		right: { control: k[2], alt: k[5], shift: k[8] },
	}
	var state = { key:key, char:char, down:down, physical:physical, mod:mod, plain: !(k[0] || k[3] || k[6]) }
	if (this.desktop.onKey(state)) this.repaint()
}

button_state = []

TMouse = kindof(TObject)
TMouse.can.init = function(X, Y, w, h) {
	dnaof(this)
	this.X = X, this.Y = Y
	this.x = Math.floor(X / w)
	this.y = Math.floor(Y / h)
	this.w = w
	this.h = h
	var me = this
	this.child = function(view) {
		var R = TMouse.create()
		R.x = me.x - view.x
		R.y = me.y - view.y
		R.X = me.X - (view.x * me.w)
		R.Y = me.Y - (view.y * me.h)
		R.w = me.w
		R.h = me .h
		R.button = me.button
		R.down = me.down
		return R
	}
}

TGLXVision.can.onMouse = function(button, down, X, Y) {
	var hand = TMouse.create(X, Y, this.fnt[0], this.fnt[1])
	hand.down = down
	hand.button = button
	button_state[button] = down
	var ret = false
	if (this.desktop.mouseCapture) ret = this.desktop.mouseCapture(hand)
	else ret = this.desktop.onMouse(hand)
	if (ret) this.repaint()
}

cursor_pos_cache = { x:-1, y:-1 }

TGLXVision.can.onCursor = function (X, Y) {
	var hand = TMouse.create(X, Y, this.fnt[0], this.fnt[1]), ret = false
	if (this.desktop.mouseCapture) ret = this.desktop.mouseCapture(hand)
	else if (hand.x != cursor_pos_cache.x || hand.y != cursor_pos_cache.y) {
		cursor_pos_cache = { x: hand.x, y: hand.y }
		ret = this.desktop.onCursor(hand)
	}
	if (ret) this.repaint()
}

TGLXVision.can.onFocus = function (on) {
	this.caretDisabled = !on
	this.caretReset()
	for (var i = 0; i < keyModifiers.length; i++) keyModifiers[i] = false
	return true
}

repaint = function() {
	log('oops: global repaint() deprecated')
	try { i.dont.exist += 0 } catch (e) {
		var S = e.stack.split('\n')
		//process.stdout.write(e.stack + '\n')
		log(S[2])
		log(S[3])
	}
}

