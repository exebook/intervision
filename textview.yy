// это было написано за несколько минут, скорее временная заглушка чем просмотрщик
// можно сделать просмотрщик на основе правки, переведя её в состояние только для чтения

TTextView = kindof(TView)

TTextView.can.init = ➮{
	dnaof(⚪)
	⚫lines = []
	⧗ (∇ i ⊜ ⦙ i < 40 ⦙ i++) ⚫lines ⬊('')
	//'* * * * * * ' + i + ' * * * * * *')
	⚫name = 'TTextView'
	⚫d ⊜
	⚫navx ⊜
	⚫react(0, keycode.UP, ⚫moveCursor, {arg:'up'})
	⚫react(0, keycode.DOWN, ⚫moveCursor, {arg:'down'})
	⚫react(0, keycode.HOME, ⚫moveCursor, {arg:'home'})
	⚫react(0, keycode.END, ⚫moveCursor, {arg:'end'})
	⚫react(0, keycode.PAGE_UP, ⚫moveCursor, {arg:'pageup'})
	⚫react(0, keycode.PAGE_DOWN, ⚫moveCursor, {arg:'pagedown'})
	⚫react(0, keycode.LEFT, ⚫moveCursor, {arg:'left'})
	⚫react(0, keycode.RIGHT, ⚫moveCursor, {arg:'right'})
	⚫pal = getColor.syntax
	⚫tabSize = 3
	⚫lexer = JSLexer
	⚫pal = [0xfff, 0xf00, 0x0f0, 0x00f]//colors
}

TTextView.can.coloredPrint = ➮(x, y, s) {
	∇ L = ⚫lexer.colorizeString(s)
	i ⬌ s {
		∇ F = ⚫pal[Lⁱ + 5]
		⚫set(x + i, y, sⁱ, F, ⚫pal¹)
	}
}
TTextView.can.draw = ➮{
	dnaof(⚪)
	∇ e = ⚫d + ⚫h, y ⊜
	⧗ (∇ i = ⚫d ⦙ i < e ⦙ i++) {
		⌥ (i >= ⚫lines ↥) @
		∇ s = ⚫linesⁱ
		⚫coloredPrint(-⚫navx, y, s)
		y++
	}
}

TTextView.can.moveCursor = ➮(arg) { ☛ (⚪) {
	⌥ (arg ≟ 'up') {
		⚫d--
		⌥ (⚫d < 0) ⚫d ⊜
	} ⥹ (arg ≟ 'down') {
		⚫d++
		⌥ (⚫d > ⚫lines ↥ - ⚫h)  ⚫scrollToBottom()
	} ⥹ (arg ≟ 'home') {
		d ⊜
		x ⊜
	} ⥹ (arg ≟ 'end') {
		d = lines ↥ - h + 1
		⌥ (d < 0) d ⊜
	} ⥹ (arg ≟ 'pageup') {
		d -= h - 1
		⌥ (d < 0) d ⊜
	} ⥹ (arg ≟ 'pagedown') {
		d += h - 1
		⌥ (d > lines ↥ - h + 1) d = lines ↥ - h + 1
		⌥ (d < 0) d ⊜
	} ⥹ (arg ≟ 'left') {
		navx -= 5
		⌥ (navx < 0) navx ⊜
	} ⥹ (arg ≟ 'right') {
		navx += 5
	}
	$ ⦿
}}

TTextView.can.scrollToBottom = ➮{
	⚫d = ⚫lines ↥ - ⚫h
	⌥ (⚫d < 0) ⚫d ⊜
}

TTextView.can.track = ➮{
	$ { position: ⚫d, size: ⚫lines ↥, page: ⚫h }
}

