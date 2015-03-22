TList.can.onAltChar = ➮ (K) {
	∇ q = TQuickFind.create(K.char, ⚪)
	∇ G = ⚫getGlobal()
	∇ D = ⚫getDesktop()
	D.showModal(q, G.x + 10, D.h - 3)
	⚫showFocused = ⦿
}

TQuickFind = kindof(TWindow)
TQuickFind.can.init = ➮(char, list) {
	dnaof(⚪)
	⚫name = 'TQuickFind'
	⚫list = list
	⚫pal = getColor.window
	⚫size(30, 3)
	⚫error = ⦾
	⚫bottomTitle = 'Escape: отмена'
	⚫input = TInput.create('^' + char)
	⚫input.sel.clear()
	⚫input.text.onChange = ⚫onChange.bind(⚪)
	⚫input.size(⚫w - 2, 1)
	⚫input.pos(1, 1)
	⚫onChange()
	⚫add(⚫input)
	⚫react(0, keycode.ESCAPE, ⚫close)
	⚫altIsDown = ⦿
	☛ (keycode) ⚫closeKeys = [UP, DOWN, LEFT, RIGHT], ⚫transKeys = [TAB, ENTER]
}

TQuickFind.can.close = ➮{
	⚫list.showFocused = ⦾
	dnaof(⚪)
}

TQuickFind.can.title = ➮{
	⌥ (⚫error) $ 'Ошибка regex'
	$ 'Поиск (RegEx)'
}

TQuickFind.can.onChange = ➮{
	try {
		∇ R = ⟡ RegExp(⚫input.getText(), "")
		∇ it = ⚫list.items
		i ⬌ it {
			⌥ (R.test(itⁱ.name) || R.test(itⁱ.name.toLowerCase())) {
				⚫list.sid = i
				⚫list.onItem(i)
				⚫list.scrollIntoView()
				⚫list.repaint()
				@
			}
		}
		⚫error = ⦾
	} catch (e) {
		⚫error = ⦿
	}
}

TQuickFind.can.onKey = ➮(hand) {
	⌥ (⚫altIsDown) {
		⌥ (hand.mod.alt ≠ ⦿) ⚫altIsDown = ⦾
		hand.mod.alt = ⦾
	}
	⌥ (hand.down && ⚫closeKeys≀(hand.key) >= 0) {
		⚫close()
		$
	}
	⌥ (hand.down && (hand.char ≟ ∅ 
	|| ⚫transKeys≀(hand.key) >= 0) && !hand.mod.shift) {
		⚫close()
		⚫getDesktop().onKey(hand)
		$ ⦾
	}
	$ dnaof(⚪, hand)
}

