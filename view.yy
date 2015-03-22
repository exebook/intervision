poorGraphicChar = ⦾
//◉○◌◈◇◆
graphChar = { on:'■', off:' ' ,'│': '│', '─': '─', '┴': '┴', '╔':'╔','╝':'╝','╚':'╚','╗':'╗', '═':'═', '║':'║'}
⌥ (poorGraphicChar)
graphChar = { on:'x', off:' ' ,'│': '|', '─': '-', '┴': '+', '╔':'-','╝':'-','╚':'-','╗':'-', '═':'=', '║':'|'}
//markersModified = ' x'//'x◆◉◇◆▪■'


≣('./palette')
//	var cnorm = 0, csym = 1, cnum = 2, cstr = 3, cid = 4, ckey = 5

//getColor = defaultPalette

//colorDialog.init({ fore: 0x000, back: 0x89a, focusFore: 0xff0, labelFore: 0x444, inputBack:0x990, focusBack: 0x700, selFore: 0xff0, selBack: 0x700, disabled: 0xa44 })

TView = kindof(TKeyInput)

TView.can.init = ➮{
	dnaof(⚪)
	⚫name = 'TView'
	⚫pal = getColor.view
	⚫ux ⊜, ⚫uy ⊜
}
TView.can.getDesktop = ➮{
	$ ⚫parent.getDesktop()
}

TView.can.repaint = ➮{
	⚫parent.repaint()
}

TView.can.size = ➮(w, h) {
	⚫w = w, ⚫h = h, ⚫data = []
}

TView.can.pos = ➮(x, y) {
//	if (this.parent && this.parent.x) {
//	this.ux = x + this.parent.x
//	this.uy = y + this.parent.y
//	}
//	else {
// 	this.ux = x, this.uy = y
//		console.log('PARENTLES POS', this.name, x,y)
//		console.log(new Error().stack)
//	//	process.exit()
//	}
//	this.x = x, this.y = y
//
//	return
	⚫x = x, ⚫y = y
}

//var DATA = []

TView.can.get = ➮ (x, y) {
//	if (DATA[y] == undefined) return undefined
//	return DATA[y][x]
//
	∇ O = SCREEN.W * y + x + SCREEN.O
	
	∇ ch = SCREEN.T[O]
	∇ clr = SCREEN.C[O]
	$ {ch:ch, fg: clr & 0xffff, bg: clr >> 16}
	⌥ (⚫dataʸ ≟ ∅) $ ∅
	$ ⚫dataʸˣ
}

//	if (this.data[y] == undefined) this.data[y] = []
//	var o = this.data[y][x]
//	if (o == undefined) o = { }
//	if (ch != undefined) o.ch = ch
//	if (fg != undefined) o.fg = fg
//	if (bg != undefined) o.bg = bg
//	this.data[y][x] = o

sets = {}
TView.can.set = ➮ (x, y, ch, fg, bg) {
	∇ O = SCREEN.W * y + x + SCREEN.O

	∇ ch, clr
	⌥ (ch) {
		ch = ch◬(0)
		clr = fg & 0xffff
		clr = clr | (bg & 0xffff) << 16
	} ⎇ {
		⌥ (fg ≠ ∅) clr = fg & 0xffff
		⌥ (bg ≠ ∅) clr = clr | (bg & 0xffff) << 16
		$
	}

	SCREEN.T[O] = ch
	SCREEN.C[O] = clr
}

TView.can.render = ➮{
	$
	⌥ (⚫caret ≠ ∅) {
		⚫parent.caret = { x:⚫caret.x + ⚫x, y:⚫caret.y + ⚫y, color: ⚫caret.color }
	}
//return
	⧗ (∇ y ⊜ ⦙ y < ⚫h ⦙ y++) {
		⧗ (∇ x ⊜ ⦙ x < ⚫w ⦙ x++) {
			∇ o = ⚫get(x, y)
			⌥ (o ≠ ∅) {
				⚫parent.set(⚫x+x, ⚫y+y, o.ch, o.fg, o.bg)
			}
		}
	}
}

TView.can.print = ➮ (x, y, s, fg, bg) {
	∇ e = s ↥
	⌥ (x + e > ⚫w) e = ⚫w - x
	⧗ (∇ i ⊜ ⦙ i < e ⦙ i++) {
		⚫set(x + i, y, s△(i), fg, bg)
	}
}

TView.can.rect = ➮(X, Y, w, h, ch, fg, bg) {
	⧗ (∇ y = Y ⦙ y < Y+h ⦙ y++) {
		⧗ (∇ x = X ⦙ x < X+w ⦙ x++) {
			⚫set(x, y, ch, fg, bg)
		}
	}
}

TView.can.clear = ➮(ch, fg, bg) {
	⌥ (ch ≟ ∅) ch = ' '
	⌥ (fg ≟ ∅) fg = ⚫pal⁰
	⌥ (bg ≟ ∅) bg = ⚫pal¹
	⚫rect(0, 0, ⚫w, ⚫h, ch, fg, bg)
}

TView.can.draw = ➮(state) {
	⚫clear(' ', ⚫pal⁰, ⚫pal¹)
}

TView.can.visible = ➮{
	$ (⚫hidden ≟ ∅ || ⚫hidden ≟ ⦾)
}

TView.can.close = ➮{
	⚫getDesktop().hideModal()
	⚫getDesktop().remove(⚪)
	⚫getDesktop().repaint()
	$ ⦿
}

TView.can.getGlobal = ➮{
	⌥ (⚫parent ≟ ∅) $ { x: ⚫x, y: ⚫y }
	∇ Z = ⚫parent.getGlobal()
	Z.x += ⚫x, Z.y += ⚫y
	$ Z
}

TView.can.onCursor = ➮(hand) {
	⚫getDesktop().display.setCursor(0)
}
