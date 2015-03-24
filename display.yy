∇ fontHints = [
	{ name: 'Andale_Mono.ttf', x: 0, y: -1 },
	{ name: 'DejaVuSansMono-Oblique.ttf', x: 0, y: -1 },
	{ name: 'UbuntuMono-R.ttf',  x: 0, y: -1 },
	{ name: 'LiberationMono-Regular.ttf', x: 0, y: -1 },
	{ name: 'FreeMono.ttf', x: 0, y: -1 },
	{ name: 'fixed7U.ttf', x: 0, y: -1 },
	{ name: 'PTMono-Sym.ttf', x: 0, y: -1 },
]

SCREEN = { T:null, C:null, W:0, H:0, O:0, x:0, y:0 }

➮ renderView win view atx aty {
//	var Ta = new Uint16Array(view.w * view.h)
//	var Ca = new Uint32Array(view.w * view.h)
//	var N = 0
//	for (var y = 0; y < view.h; y++) {
//		for (var x = 0; x < view.w; x++) {
//			var ch = 32, clr = 0xfff
//			var o = view.get(x, y)
//			if (o != undefined) {
//				if (o.ch != undefined) ch = o.ch.charCodeAt(0)
//				if (o.fg != undefined) clr = o.fg & 0xffff
//				if (o.bg != undefined) clr = clr | (o.bg & 0xffff) << 16
//			}
//			Ta[N + x] = ch, Ca[N + x] = clr
//		}
//		N += view.w
//	}
	win.colorTextNew(0, 0, view.w, view.h, SCREEN.T, SCREEN.C)
}


TGLXVision = kindof(TGLXWin)

TGLXVision.can.init = ➮(fontPath, fontSize, desktopKind, W, H) {
//ロ 'INIT', fontPath, fontSize, desktopKind, W, H
	∇ hintX, hintY
	i ⬌ fontHints
		⌥ (fontPath≀('/'+fontHintsⁱ.name) >= 0)
			hintX = fontHintsⁱ.x, hintY = fontHintsⁱ.y
	dnaof(⚪, ∅, fontPath, fontSize, hintX, hintY)//fonts[f].extra_x, fonts[f].tune_y)
	⚫fnt = ⚫applyFont()// not implemented at all yet..'./fixed7.ttf', 11, 0, 0xffffff)
	⚫desktop = desktopKind.create(W, H)
	⚫desktop.pos(0, 0)
	⚫desktop.size(W, H)
	⚫desktop.display = ⚪
	∇ me = ⚪
	⚫desktop.repaint = ➮{ me.repaint() }
	⚫caretFlash = ⦾
	⚫caretVertical = ⦾
	⚫name = 'TGLXVision'
	⚫caretReset()
	⚫setXYWH(∅, ∅, W * ⚫fnt⁰, H * ⚫fnt¹)
	⚫setSizeSteps(⚫fnt⁰ * 2, ⚫fnt¹)
}

TGLXVision.can.caretDraw= ➮{
	⌥ (SCREEN.caret ≠ ∅ && ⚫caretDisabled ≠ ⦿) {
		⚫paintBegin()
		∇ x = SCREEN.caret.x, y = SCREEN.caret.y
		∇ ch = 32, clr = 0xfff
		∇ o = ⚫desktop.get(x, y)
		⌥ (o ≠ ∅) {
			⌥ (o.ch ≠ ∅) ch = o.ch
			⌥ (o.fg ≠ ∅) clr = o.fg & 0xffff
			⌥ (o.bg ≠ ∅) clr = clr | (o.bg & 0xffff) << 16
		}
		∇ TEXT = [[]], COLOR = [[]]
		TEXT⁰⁰ = ch, COLOR⁰⁰ = clr
		x = ⚫fnt⁰ * x, y = ⚫fnt¹ * y
		⚫colorText(x, y, 1, 1, TEXT, COLOR)
		⌥ (⚫caretFlash ≟ ⦿) {
			∇ C = 0xff008800, c
			⌥ (SCREEN.caret.color) {
				c = SCREEN.caret.color
				C = (c & 0xff) << 4 | c & 0xf | (c & 0xff0) << 8 
						| (c & 0xf00) << 12 | (~c & 0xf000) << 16 | (~c & 0xf000) << 12
			}
			⌥ (⚫caretVertical ≟ ⦿)
				⚫crect(x,  y, x + 3, y + ⚫fnt¹, 0xffffffff)
			⎇
				⚫crect(x,  y + ⚫fnt¹ - 3, x + ⚫fnt⁰, y + ⚫fnt¹, C)
		}
		⚫paintEnd()
	}
}

TGLXVision.can.caretReset = ➮{
	⌥ (⚫caretInterval ≠ ∅) ⌿⌚(⚫caretInterval)
	∇ me = ⚪
	⚫caretInterval = ⌚(➮{
		me.caretFlash = !me.caretFlash
		me.caretDraw()
	}, 450)
	⚫caretFlash = ⦿
	me.caretDraw()
}


TGLXVision.can.onSize = ➮(w, h) {
	∇ W = ⍽(w / ⚫fnt⁰), H = ⍽(h / ⚫fnt¹)
	⚫desktop.size(W, H)
	⌛(⚫repaint.bind(⚪), 30)
	SCREEN.T = ⟡ Uint16Array(W*H)
	SCREEN.C = ⟡ Uint32Array(W*H)
i ⬌ SCREEN.T { SCREEN.Tⁱ = 32 }
i ⬌ SCREEN.C { SCREEN.Cⁱ = 0x777 }
}

TGLXVision.can.onPaint = ➮{
//console.time('paint')
	∇ A = ⚫getXYWH()
	∇ W = ⚫desktop.w, H = ⚫desktop.h
	SCREEN.W = W
	SCREEN.H = H
	⚫crect(0, 0, A², A³, 0xff000000)
	⌥ (⚫caretOnly ≟ ⦿) $
//	try { // TODO: make all C++ win::callbacks automagic with error and backtrace
	⚫desktop.draw({ active:⦿, focused: ⦿ })
	renderView(⚪, ⚫desktop, 0, 0)
	∇ x = ⚫desktop.w * ⚫fnt⁰,
		y = ⚫desktop.h * ⚫fnt¹,
		w = A² - 0,
		h = A³ - 0
	⚫crect(x, 0, w, h, 0xff000000)
	⚫crect(0, y, x, h, 0xff000000)
	⚫caretDraw()
//console.timeEnd('paint')
}

keycode = {
	F1: 67, F2:68, F3:69, F4:70, F5:71, F6: 72, F7: 73, F8:74, F9: 75, F10: 76,
	ESCAPE: 9, ENTER: 36, TAB: 23, F11: 95, F12: 96,
	BACK_SPACE: 22, PRINT_SCREEN: 107, PAUSE_BREAK: 127, SPACE: 65,
	INSERT: 118, DELETE: 119, HOME: 110, END: 115, PAGE_UP: 112, PAGE_DOWN: 117, POPUP_MENU: 135,
	LEFT_SHIFT: 50, LEFT_CONTROL: 37, LEFT_ALT: 64,
	RIGHT_ALT: 108, RIGHT_CONTROL: 105, RIGHT_SHIFT: 62,
	UP:111, DOWN: 116, LEFT: 113, RIGHT: 114, CAPS_LOCK: 66,
	NUM_PLUS: 86, NUM_MINUS: 82,
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
	var bit = 0
	if (mod.control) bit += 100
	if (mod.alt) bit += 10
	if (mod.shift) bit += 1
	var state = {
		key:key, char:char, down:down, physical:physical, 
		mod:mod, bit:bit, plain: !(k[0] || k[3] || k[6])
	}
	if (this.desktop.onKey(state)) this.repaint()
}

button_state = []

TMouse = kindof(TObject)
TMouse.can.init = function(X, Y, w, h) {
	dnaof(this)
	this.X = X, this.Y = Y
	this.x = Math.floor(X / w)
	⚫y = ⍽(Y / h)
	⚫w = w
	⚫h = h
	∇ me = ⚪
	⚫child = ➮(view) {
		∇ R = TMouse.create()
		R.x = me.x - view.x
		R.y = me.y - view.y
		R.X = me.X - (view.x * me.w)
		R.Y = me.Y - (view.y * me.h)
		R.w = me.w
		R.h = me .h
		R.button = me.button
		R.down = me.down
		$ R
	}
}

TGLXVision.can.onMouse = ➮(button, down, X, Y) {
	∇ hand = TMouse.create(X, Y, ⚫fnt⁰, ⚫fnt¹)
	hand.down = down
	hand.button = button
	button_state[button] = down
	∇ ret = ⦾
	⌥ (⚫desktop.mouseCapture) ret = ⚫desktop.mouseCapture(hand)
	⎇ ret = ⚫desktop.onMouse(hand)
	⌥ (ret) ⚫repaint()
}

cursor_pos_cache = { x:-1, y:-1 }

TGLXVision.can.onCursor = ➮ (X, Y) {
	∇ hand = TMouse.create(X, Y, ⚫fnt⁰, ⚫fnt¹), ret = ⦾
	⌥ (⚫desktop.mouseCapture) ret = ⚫desktop.mouseCapture(hand)
	⥹ (hand.x ≠ cursor_pos_cache.x || hand.y ≠ cursor_pos_cache.y) {
		cursor_pos_cache = { x: hand.x, y: hand.y }
		ret = ⚫desktop.onCursor(hand)
	}
	⌥ (ret) ⚫repaint()
}

TGLXVision.can.onFocus = ➮ (on) {
	⚫caretDisabled = !on
	⚫caretReset()
	i ⬌ keyModifiers keyModifiersⁱ = ⦾
	$ ⦿
}

repaint = ➮{
	log('oops: global repaint() deprecated')
	try { i.dont.exist += 0 } catch (e) {
		∇ S = e.stack⌶('\n')
		//process.stdout.write(e.stack + '\n')
		log(S²)
		log(S³)
	}
}

