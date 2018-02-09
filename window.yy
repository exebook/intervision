TWindow = kindof(TGroup)
TWindow.can.init = ➮{
	dnaof(⚪)
	⚫border ⊜
	⚫name = 'TWindow'
	⚫pal = getColor.window
}
TWindow.can.getArea = ➮{
	$ {
		x: 1 + ⚫border * 3,
		y: 1 + ⚫border,
		w: ⚫w - 2 - ⚫border * 6,
		h: ⚫h - 2 - ⚫border * 2
	}
}
TWindow.can.solo = ➮(child) {
	⚫add(child)
	∇ area = ⚫getArea()
	child.size(area.w, area.h)
	child.pos(0, 0)
}
TWindow.can.draw = ➮(state) {
	⚫clear()
	⚫drawFrame(state, ⚫border * 3, ⚫border, ⚫w - ⚫border * 6, ⚫h - ⚫border * 2)
	dnaof(⚪, state)
	⌥ (⚫disabled ≟ ⦿) state.disabled = ⦿
}

poorGraphicChar = ⦿

TWindow.can.drawFrame = ➮(state, x, y, w, h) {
//	var F = this.color.get(state), B = F[1]; F = F[0]
	∇ F = ⚫pal⁰, B = ⚫pal¹
	⌥ (state.active) F = ⚫pal²
	⌥ (state.disabled) F = ⚫pal³//(F & 0xfff) | 0x8000
//	if (state.focused && this.actor == undefined) F = 0xfff;//(F & 0xfff) | 0x8000

	⚫set(x, y, graphChar['╔'], F, B)
	⚫set(x+ w - 1, y + h - 1, graphChar['╝'], F, B)
	⚫set(x, y + h - 1, graphChar['╚'], F, B)
	⚫set(x + w - 1, y, graphChar['╗'], F, B)
	⚫rect(x + 1, y, w - 2, 1, graphChar['═'], F, B)
	⚫rect(x + 1, y + h - 1, w - 2, 1, graphChar['═'], F, B)
	⚫rect(x, y + 1, 1, h - 2, graphChar['║'], F, B)
	⚫rect(x + w - 1, y + 1, 1, h - 2, graphChar['║'], F, B)
	⌥ (⚫title ≠ ∅) {
		∇ title = ''
		⌥ (⬤ ⚫title ≟ 'string') title = ⚫title
		⌥ (⬤ ⚫title ≟ 'function') title = ⚫title.apply(⚪)
		⌥ (title ↥ > ⚫w - 6) {
			⌥ (⚫titleFit) title = ⚫titleFit(title, ⚫w - 6)
			⎇ title = '░'+ title⩪(w - title ↥ + 5)
		}
		⌥ (state.active) { F = ⚫pal², B = ⚫pal³ }
		⚫print((⚫w >> 1) - (title ↥ + 2 >> 1), y, ' '+title+' ', F, B)
	}
	⌥ (⚫bottomTitle ≠ ∅) {
		∇ title = ''
		⌥ (⬤ ⚫bottomTitle ≟ 'string') title = ⚫bottomTitle
		⌥ (⬤ ⚫bottomTitle ≟ 'function') title = ⚫bottomTitle()
		⚫print((⚫w >> 1) - (title ↥ + 2 >> 1), ⚫h-1 - (1 * ⚫border), ' '+title+' ', ⚫pal⁰, ⚫pal¹)
	}
}
