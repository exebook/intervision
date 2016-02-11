/*
First off, I'd suggest printing out a copy of the GNU coding standards, and NOT read it. Burn them, it's a great symbolic gesture.
			Linus Torvalds
*/

THexView = kindof(TView)

THexView.can.init = ➮(fileName) {
	dnaof(⚪)
	⚫fileName = fileName
	⚫symWidth = 3
	⚫base = 16
	⚫bytes = 1
	⚫lined = ⦿
	⚫utf8 = ⦿
	⚫setMode('overlay')
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
	⚫react(0, keycode['u'], ⚫setMode, {arg:'utf8'})
	⚫react(0, keycode['t'], ⚫setMode, {arg:'lined'})
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

THexView.can.setMode = ➮ {
	⚫mode = a
	⌥ (a ≟ 'utf8') {
		⚫utf8 = !⚫utf8
//		⌥ ⚫utf8 { symWidth = 5 } ⎇ symWidth = 2
	}
	⌥ (a ≟ 'lined') ⚫lined = !⚫lined
	⌥ (a ≟ 'number') ⚫rows = 1, ⚫setBase(⚫base)
	⌥ (a ≟ 'text') ⚫rows = 1, ⚫symWidth = 1
	⌥ (a ≟ 'double') ⚫rows = 2, ⚫setBase(⚫base)
	⌥ (a ≟ 'overlay') ⚫rows = 1, ⚫setBase(⚫base)
	ロ 'lined=', ⚫lined, 'rows=', ⚫rows, 'base=', ⚫base, 'symwidth=', ⚫symWidth
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

➮ iconicChar n F {
	icon = ⦿
	⌥ (n ≟ 0) n = '⁰'
	⥹ (n ≟ 1) n = '¹'
	⥹ (n ≟ 2) n = '²'
	⥹ (n ≟ 3) n = '³'
	⥹ (n ≟ 4) n = '⁴'
	⥹ (n ≟ 5) n = '⁵'
	⥹ (n ≟ 6) n = '⁶'
	⥹ (n ≟ 7) n = '⁷'
	⥹ (n ≟ 8) n = '⁸'
	⥹ (n ≟ 9) n = '⇥'
	⥹ (n ≟ 10) n = '↵'//'⏎'//'░'
	⥹ (n ≟ 11) n = '¹¹'
	⥹ (n ≟ 13) n = '⏎'//←
	⎇ icon = ⦾
	⌥ (icon) F = ⚫pal⁵ //5-comment 7-number 0-id 
	$[n,F]
}

THexView.can.draw = ➮{
	charList ∆ '`~1!2@3#4$5%6^7&8*9(0)-_=+QWERTYUIOP{}qwertyuiop[]azsxdcfvgbhnjmk,l.;/\'AZSXDCFVGBHNJMK<L>:?" '
	dnaof(⚪)
	∇ x ⊜, y ⊜, w = ⚫symWidth
	∇ ch, num, F
	⧗ (∇ i ⊜ ⦙ i < ⚫bytesRead && y < ⚫h ⦙ i++) {
		num ∆ ∅ ch ∆ ∅ F ∆ ⚫pal⁷
		n ∆ ⚫bufⁱ
		⌥ ⚫lined && n ≟ 10 {
			x = 0, y++
			⌥ y ≟ ⚫h {@}
		}
		⌥ (⚫mode ≟ 'text' || ⚫mode ≟ 'double' || ⚫mode ≟ 'lined' || 
			(⚫mode ≟ 'overlay' && charList≀(∼◬n) >= 0))
				ch = ∼◬n
		icon ∆ ⦾
		⌥ ((⚫mode ≟ 'overlay' || ⚫mode ≟ 'lined') && ch ≟ ∅) {
			n,F ꔪ iconicChar ꘉ(⚪) (n, F)
		}
		⌥ (!icon) {
			n = n≂ (⚫base)
			⌥ (⚫mode ≟ 'overlay' && ch) n = ch, F = ⚫pal⁸
			⥹ (⚫mode ≟ 'text' || ⚫mode ≟ 'lined') n = ch
			⎇ {
				n = n.toUpperCase()
				⧖ (n ↥ < (⚫bytes << 1)) n = '0' + n
			}
		}
		⚫print(x, y, n, F, ⚫pal¹)
		⌥ (⚫rows ≟ 2) ⚫print(x, y + 1, ch, ⚫pal⁵, ⚫pal¹)
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
