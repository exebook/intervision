// можно разрастающиеся виды выносить в отдельные файлы

TControl = kindof(TView)
TControl.can.init = ➮{
	dnaof(⚪)
	⚫name = 'TControl'
}

TButton = kindof(TControl)

TButton.can.init = ➮(keycode, title, onClick) {
	dnaof(⚪)
	⌥ (⬤ keycode ≠ 'number') {
		log('Invalid Button: ', keycode, title, onClick)
		throw ('invalid button')
	}
	⚫name = 'TButton'
	⚫key = keycode
	⚫title = title
	⚫onClick = onClick
	⚫pal = getColor.button
}

TButton.can.draw = ➮{
	⚫clear()
	⌥ (⚫title ≠ ∅) {
		∇ title = ''
		⌥ (⬤ ⚫title ≟ 'string') title = ⚫title
		⌥ (⬤ ⚫title ≟ 'function') title = ⚫title()
		⚫print((⚫w >> 1) - (title ↥ + 2 >> 1), 0, ' ' + title + ' ', ⚫pal⁰, ⚫pal¹)
	}
}

TButton.can.onMouse = ➮ (hand) {
	⌥ (hand.down && hand.button ≟ 0 && ⚫onClick ≠ ∅) $ ⚫onClick()
}

TLabel = kindof(TControl)
TLabel.can.init = ➮(title) {
	dnaof(⚪)
	⚫disabled = ⦿
	⚫name = 'TLabel'
	⚫title = title
	⚫pal = getColor.dialog
}

TLabel.can.draw = ➮{
	⚫clear()
	⌥ (⚫title ≠ ∅) {
		∇ title = ''
		⌥ (⬤ ⚫title ≟ 'string') title = ⚫title
		⌥ (⬤ ⚫title ≟ 'function') title = ⚫title()
		⚫print(0, 0, title, ⚫pal⁰, ⚫pal¹)
	}
}

TInput = kindof(TEdit)
TInput.can.init = ➮(text) {
	dnaof(⚪)
	⚫multiLine = ⦾
	⚫shortcuts.enable('multi', ⦾)
	⌥ (text) ⚫setText(text)
}

TDoneBar = kindof(TView)
TDoneBar.can.init = ➮{
	dnaof(⚪)
	⚫position = 0, ⚫max = 100
	//'█▒▓░▍▌'
}

TDoneBar.can.draw = ➮(state) {
	dnaof(⚪, state)
	∇ X = (⚫max / ⚫w)
	⌥ (X ≟ 0) $
	X = ⬠(⚫position / X)
	⚫rect(0, 0, ⚫w, 1, '░', ⚫pal⁰, ⚫pal¹)
	⚫rect(0, 0, X, 1, ' ', ⚫pal¹, ⚫pal⁰) //█≣
}


TScrollBar = kindof(TView)
TScrollBar.can.init = ➮(color) {
	⚫pal = color
}
TScrollBar.can.draw = ➮(state) {
	⚫clear(' ', ⚫pal⁰, ⚫pal¹ | 0x1000)
//	this.print(0, 0, '  ', this.pal[0], this.pal[1] | 0x1000)
//	this.print(0, this.h - 1, '  ', this.pal[0], this.pal[1] | 0x1000)
	⌥ (⚫track) {
		∇ track = ⚫track()
		∇ max = track.size + 1 // track.page -- depends on pagedown/end behaviour
		∇ Y = ⍽(⚫h * (track.position / max))
		⚫print(0, Y, '::', ⚫pal⁰, ⚫pal¹ | 0x3000)
	}
}


