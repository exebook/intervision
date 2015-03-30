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
	⚫x = x, ⚫y = y
}

//var DATA = []

TView.can.get = ➮ (x, y) {
	∇ O = SCREEN.W * y + x + SCREEN.O
	
	∇ ch = SCREEN.T[O]
	∇ clr = SCREEN.C[O]
	$ {ch:ch, fg: clr & 0xffff, bg: clr >> 16}
	⌥ (⚫dataʸ ≟ ∅) $ ∅
	$ ⚫dataʸˣ
}

➮ fgbgn ch fg bg {
	∇ ch, clr
	ch = ch◬(0)
	clr = fg & 0xffff
	clr = clr | (bg & 0xffff) << 16
	$ [ch, clr]
}

TView.can.set = ➮ (x, y, ch, fg, bg) {
	⌥ (ch ≟ ∅) $
	∇ O = SCREEN.W * y + x + SCREEN.O
	C ∆ fgbgn(ch, fg, bg)
	SCREEN.T[O] = C⁰
	SCREEN.C[O] = C¹
}
TView.can.setn = ➮ (x, y, ch, n) {
	∇ O = SCREEN.W * y + x + SCREEN.O
	SCREEN.T[O] = ch
	SCREEN.C[O] = n
}
TView.can.rect = ➮(X, Y, w, h, ch, fg, bg) {
	⌥ (ch ≟ ∅) $
	∇ n = fgbgn(ch, fg, bg) ⦙ ch = n⁰, n = n¹
	sw ∆ SCREEN.W
	p0 ∆ sw * Y + X + SCREEN.O, p
	∇ T = SCREEN.T, C = SCREEN.C
⌥ (T ≟ ∅) ロ SCREEN
	⧗ (y ∆ 0 ⦙ y < h ⦙ y++) {
		p = p0
		⧗ (x ∆ 0 ⦙ x < w ⦙ x++)
			Tᵖ = ch, Cᵖ = n, p++
		p0 += sw
	}
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
	⧗ (i ∆ 0 ⦙ i < e ⦙ i++) {
		⚫set(x + i, y, s△(i), fg, bg)
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
