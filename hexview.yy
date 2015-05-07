THexView = kindof(TView)

THexView.can.init = ➮(fileName) {
	dnaof(⚪)
	⚫fileName = fileName
	⚫symWidth = 3
	⚫base = 16
	⚫bytes = 1
	⚫setMode('double')
	⚫lines = []
	⚫name = 'THexView'
	⚫delta ⊜
	⚫react(0, keycode.UP, ⚫moveCursor, {arg:'up'})
	⚫react(0, keycode.DOWN, ⚫moveCursor, {arg:'down'})
	⚫react(0, keycode.HOME, ⚫moveCursor, {arg:'home'})
	⚫react(0, keycode.END, ⚫moveCursor, {arg:'end'})
	⚫react(0, keycode.PAGE_UP, ⚫moveCursor, {arg:'pageup'})
	⚫react(0, keycode.PAGE_DOWN, ⚫moveCursor, {arg:'pagedown'})
	⚫react(100, keycode.PAGE_UP, ⚫moveCursor, {arg:'%up'})
	⚫react(100, keycode.PAGE_DOWN, ⚫moveCursor, {arg:'%down'})
//	this.react(0, keycode.LEFT, this.moveCursor, {arg:'left'})
//	this.react(0, keycode.RIGHT, this.moveCursor, {arg:'right'})
	⚫react(0, keycode['1'], ⚫setBase, {arg:16})
	⚫react(0, keycode['2'], ⚫setBase, {arg:10})
	⚫react(0, keycode['3'], ⚫setBase, {arg:8})
	⚫react(0, keycode['r'], ⚫setMode, {arg:'overlay'})
	⚫react(0, keycode['e'], ⚫setMode, {arg:'double'})
	⚫react(0, keycode['q'], ⚫setMode, {arg:'number'})
	⚫react(0, keycode['w'], ⚫setMode, {arg:'text'})
}

THexView.can.size = ➮(w, h) {
	⚫dna(w, h)
	⚫loadBuf()
}

THexView.can.setBase = ➮(arg) {
	⚫base = arg
	⚫symWidth = 1
	⌥ (arg ≟ 10) ⚫symWidth = 4
	⌥ (arg ≟ 16) ⚫symWidth = 3
	⌥ (arg ≟ 8) ⚫symWidth = 4
	⚫loadBuf()
	$ ⦿
}

THexView.can.setMode = ➮(arg) {
	⚫mode = arg
	⌥ (arg ≟ 'number') ⚫rows = 1, ⚫setBase(⚫base)
	⌥ (arg ≟ 'text') ⚫rows = 1, ⚫symWidth = 1
	⌥ (arg ≟ 'double') ⚫rows = 2, ⚫setBase(⚫base)
	⌥ (arg ≟ 'overlay') ⚫rows = 1, ⚫setBase(⚫base)
	⚫loadBuf()
	$ ⦿
}

THexView.can.track = ➮{
	$ { size: ⚫fileSize, position: ⚫delta }
}

THexView.can.loadBuf = ➮{
	⌥ (⚫w ≟ ∅) $
	try {
		⚫fileSize = fs.lstatSync(⚫fileName).size
		∇ f = fs.openSync(⚫fileName, 'r'), N = ⍽(⚫w / ⚫symWidth) * ⚫h
		N /= ⚫rows
		⚫buf = ⟡ Buffer(N)
		⚫bytesRead = fs.readSync(f, ⚫buf, 0, N, ⚫delta)
		fs.closeSync(f)
	} catch (e) { 
		⌥ (f) fs.closeSync(f)
		log(e)
	}
}

THexView.can.draw = ➮{
	∇ charList = '`~1!2@3#4$5%6^7&8*9(0)-_=+QWERTYUIOP{}qwertyuiop[]azsxdcfvgbhnjmk,l.;/\'AZSXDCFVGBHNJMK<L>:?" '
	dnaof(⚪)
//	log(this.bytes)
	∇ x ⊜, y ⊜, w = ⚫symWidth
	∇ ch, num, F, C1 = ⚫pal⁰, C2 = ⚫pal²
	⧗ (∇ i ⊜ ⦙ i < ⚫bytesRead ⦙ i++) {
		num = ∅, ch = ∅, F = C1
		∇ n = ⚫bufⁱ
		⌥ (⚫mode ≟ 'text' || ⚫mode ≟ 'double' || 
			(⚫mode ≟ 'overlay' && charList≀(String.fromCharCode(n)) >= 0))
				ch = String.fromCharCode(n)
		n = n.toString(⚫base)
		⌥ (⚫mode ≟ 'overlay' && ch) n = ch, F = C2
		⥹ (⚫mode ≟ 'text') n = ch
		⎇ {
			n = n.toUpperCase()
			⧖ (n ↥ < (⚫bytes << 1)) n = '0' + n
		}
		⚫print(x, y, n, F, ⚫pal¹)
		⌥ (⚫rows ≟ 2) {
			⚫print(x, y + 1, ch, C2, ⚫pal¹)
		}
		x += w ⦙ ⌥ ((x + w) >= ⚫w) x ⊜, y += ⚫rows
	}
}

THexView.can.moveCursor = ➮(arg) { ☛ (⚪) {
	∇ N = ⍽(w / symWidth), H = (N * h) / rows, block = ~~(fileSize / 100)
 	⌥ (arg ≟ 'up') {
		delta -= N
		⌥ (delta < 0) delta ⊜
	} ⥹ (arg ≟ 'down') {
		⌥ (delta < fileSize - N) delta += N
	} ⥹ (arg ≟ 'home') {
		delta ⊜
		x ⊜
	} ⥹ (arg ≟ 'end') {
		delta = fileSize - H
		⌥ (delta < 0) delta ⊜
	} ⥹ (arg ≟ 'pageup') {
		delta -= H
		⌥ (delta < 0) delta ⊜
	} ⥹ (arg ≟ 'pagedown') {
		⌥ (delta < fileSize - H) delta += H
	} ⥹ (arg ≟ '%up') {
		delta -= block
		⌥ (delta < 0) delta ⊜
	} ⥹ (arg ≟ '%down') {
		⌥ (delta < fileSize - block) delta += block ⦙ ⎇ moveCursor('end')
	} ⥹ (arg ≟ 'left') {
//		navx -= 5
//		if (navx < 0) navx = 0
	} ⥹ (arg ≟ 'right') {
//		navx += 5
	}
	⚫loadBuf()
	⚫repaint()
	$ ⦿
}}

THexView.can.scrollToBottom = ➮{
	⚫d = ⚫lines ↥ - ⚫h
	⌥ (⚫d < 0) ⚫d ⊜
}
