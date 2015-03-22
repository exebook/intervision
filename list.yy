TList = kindof(TView)

TList.can.init = ➮{
	dnaof(⚪)
	⚫pal = getColor.list
	⚫columns = 3
	⚫clearItems()
	⚫name = 'TList'
	⚫slideSelMode = -1
	⚫react(0, keycode.UP, ⚫moveCursor, { arg:'up', role:['move'] })
	⚫react(0, keycode.DOWN, ⚫moveCursor, { arg:'down', role:['move'] })
	⚫react(0, keycode.LEFT, ⚫moveCursor, { arg:'left', role:['move'] })
	⚫react(0, keycode.RIGHT, ⚫moveCursor, { arg:'right', role:['move'] })
	⚫react(0, keycode.HOME, ⚫moveCursor, { arg:'home', role:['move'] })
	⚫react(0, keycode.END, ⚫moveCursor, { arg:'end', role:['move'] })
	⚫react(0, keycode.PAGE_UP, ⚫moveCursor, { arg:'pageup', role:['move'] })
	⚫react(0, keycode.PAGE_DOWN, ⚫moveCursor, { arg:'pagedown', role:['move'] })
	⚫react(100, keycode['a'], ⚫userSelect, { arg:'all', role:['select'] })
	⚫react(0, keycode.INSERT, ⚫userSelect, { arg:'current', role:['select'] })
	⚫react(100, keycode['2'], ⚫lessColumns, { role:['view'] })
	⚫react(100, keycode['1'], ⚫moreColumns, { role:['view'] })
	⚫react(1, keycode.RIGHT_SHIFT, ⚫shiftSel, { arg: 'start'})
	⚫react(1, keycode.LEFT_SHIFT, ⚫shiftSel, { arg: 'start'})
	⚫react(0, keycode.RIGHT_SHIFT, ⚫shiftSel, {arg: 'end', down: ⦾})
	⚫react(0, keycode.LEFT_SHIFT, ⚫shiftSel, {arg: 'end', down: ⦾})
	⚫react(1, keycode.UP, ⚫shiftSel, { arg:'up', role:['move'] })
	⚫react(1, keycode.DOWN, ⚫shiftSel, { arg:'down', role:['move'] })
	⚫react(1, keycode.LEFT, ⚫shiftSel, { arg:'left', role:['move'] })
	⚫react(1, keycode.RIGHT, ⚫shiftSel, { arg:'right', role:['move'] })
	⚫react(1, keycode.HOME, ⚫shiftSel, { arg:'home', role:['move'] })
	⚫react(1, keycode.END, ⚫shiftSel, { arg:'end', role:['move'] })
	⚫react(1, keycode.PAGE_UP, ⚫shiftSel, { arg:'pageup', role:['move'] })
	⚫react(1, keycode.PAGE_DOWN, ⚫shiftSel, { arg:'pagedown', role:['move'] })
}

TList.can.clearItems = ➮(arg) {
	⚫items = []
	⚫selection = []
	⚫sid ⊜
	⚫d ⊜
}

TList.can.shiftSel = ➮(arg) {
	⌥ (arg ≟ 'start') {
		∇ item = ⚫items[⚫sid]
		⌥ (⚫sid ≟ 0 && ⚫items[⚫sid].name ≟ '..') {
			⌥ (⚫items ↥ <= 1) $ ⦾
			item = ⚫items¹
		}
		⌥ (item.selected ≟ ⦿) ⚫shiftSelActive = ⦾ ⦙ ⎇ ⚫shiftSelActive = ⦿
		$ ⦾
	}
	⌥ (arg ≟ 'end') {
		⏀ ⚫shiftSelActive
		$ ⦾
	}
	∇ start = ⚫sid
	⚫moveCursor(arg)
	∇ end = ⚫sid
	⌥ (start > end) { ∇ tmp = start ⦙ start = end ⦙ end = tmp }
	⌥ (start ≠ end) {
		∇ oldOnSelect = ⚫selChanged
		⧖ (start <= end) {
			⚫selectItem(start++, ⚫shiftSelActive)
		}
		⚫selChanged = oldOnSelect
		⌥ (⚫selChanged ≠ ∅) ⚫selChanged()
	}
	$ ⦿
}

TList.can.moveCursor = ➮(arg) { ☛ (⚪) {
	∇ old = sid
	⌥ (arg ≟ 'down') {
		sid++
		⌥ (sid > items ↥ - 1) sid = items ↥ - 1
		⌥ (sid >= d + (h * columns)) d++
	} ⥹ (arg ≟ 'up') {
		sid-- ⦙ ⌥ (sid < 0) sid ⊜
		⌥ (sid < d) d = sid
	} ⥹ (arg ≟ 'left') {
		sid -= h ⦙ ⌥ (sid < 0) sid ⊜
		⌥ (sid < d) d -= h
		⌥ (d < 0) d ⊜
	} ⥹ (arg ≟ 'right') {
		sid += h
		⌥ (sid > items ↥ - 1) sid = items ↥ - 1
		⌥ (sid >= d + (h * columns)) d += h
	} ⥹ (arg ≟ 'home') {
		sid ⊜ ⦙ d ⊜ ⦙
	} ⥹ (arg ≟ 'end') {
		sid = items ↥ - 1
		d = sid - (h * columns - 1 - (h >> 1))
		⌥ (d < 0) d ⊜
	} ⥹ (arg ≟ 'pageup') {
		sid -= (h * columns - 1) ⦙ ⌥ (sid < 0) sid ⊜
		⌥ (sid < d) d -= (h * columns - 1)
		⌥ (d < 0) d ⊜
	} ⥹ (arg ≟ 'pagedown') {
		sid += (h * columns - 1)
		⌥ (sid > items ↥ - 1) sid = items ↥ - 1
		⌥ (sid >= d + (h * columns)) d += (h * columns - 1)
	}
	⌥ (old ≠ sid) { onItem() ⦙ $ ⦿ }
}}

TList.can.userSelect = ➮(arg) { ☛ (⚪) {
	⌥ (arg ≟ 'all') selectAll()
	⥹ (arg ≟ 'current') {
		∇ old = sid
		invertCurrent()
		sid++
		⌥ (sid > items ↥ - 1) sid = items ↥ - 1
		⌥ (sid >= d + (h * columns)) d++
		⌥ (old ≠ sid) onItem()
		⌥ (⚫selChanged ≠ ∅) selChanged()
	}
	$ ⦿
}}

TList.can.moreColumns = ➮{
	⌥ (⚫columns < ⚫w / 5) {
		⚫columns++
		$ ⦿
	}
}

TList.can.lessColumns = ➮{
	⌥ (⚫columns > 1) { ⚫columns-- ⦙ $ ⦿ }
}

TList.can.drawItem = ➮(state) {
//	var F = this.color.get(state), B = F[1]; F = F[0]
	∇ F = ⚫pal⁰, B = ⚫pal¹
	⌥ (state.focused) F = ⚫pal², B = ⚫pal³
	⌥ (state.selected) F = ⚫pal⁴
//	if (state.focused && state.selected) F = this.pal[5]
	∇ s = state.item.name
	⌥ (s ↥ > state.w) s = s⩪(0, state.w)
	⚫rect(state.x, state.y, state.w, 1, ' ', ∅, B)
	⚫print(state.x, state.y, s, F, B)
	$ ⦿
}

TList.can.draw = ➮(state, customDraw) {
	⌥ (⚫w ≟ ∅) $
	dnaof(⚪, state) // todo: remove this line
	⌥ (⚫items ≟ ∅) $
	∇ y ⊜, cy ⊜, x ⊜, cw = ((⚫w - (⚫columns-1)) / ⚫columns), c ⊜
	∇ i = ⚫d
	∇ showFocusedItem = (state.focused || ⚫showFocused ≟ ⦿)
	⚫column_x = ⁰
	∞ {
		⌥ (y >= ⚫h * ⚫columns) @
		⌥ (cy >= ⚫h) {
			x += cw + 1
			⚫column_x ⬊(⍽(x - 1))
			⌥ (++c ≟ ⚫columns - 1) cw = ⚫w - x
			⚫rect(⍽(x - 1), 0, 1, ⚫h, graphChar['│'], ⚫pal⁰, ⚫pal¹)
			cy ⊜
		}
		⌥ (i < ⚫items ↥) {
			∇ B = ∅
			∇ itemFocused = (i ≟ ⚫sid && showFocusedItem)
			∇ itemSelected = (⚫itemsⁱ.selected ≠ ∅ && ⚫itemsⁱ.selected)
			⌥ (customDraw ≠ ∅) { ⌥ (customDraw(⚫itemsⁱ, ⍽(x), cy, ⍽(cw), itemFocused) ≟ ⦿) @ }
			⥹ (⚫drawItem({
				item: ⚫itemsⁱ,
				x: ⍽(x),
				y: cy,
				w: ⍽(cw),
				focused: itemFocused,
				selected: itemSelected
			}) ≠ ⦿) @
		}
		y++, cy++, i++
	}
}
TList.can.onItem = ➮ {
}

TList.can.whoAtXY = ➮(x, y) {
	∇ me = ⚪, found = -1
	⚫draw({}, ➮(n, X, Y, W, focus) {
		⌥ (x < X + W && y ≟ Y) {
			∇ a = me.items≀(n)
			⌥ (a >= 0) found = a
			$ ⦿ // stop iterating
		}
	})
	$ found
}
TList.can.onMouse = ➮(hand) {
	⌥ (!hand.down && hand.button ≟ 0) ⚫sliding = ⦾
	⌥ (!hand.down && hand.button ≟ 1) ⚫sliding1 = ⦾
	⌥ (hand.down && (hand.button ≟ 0 || hand.button ≟ 1)) {
		⌥ (hand.button ≟ 0) ⚫sliding = ⦿
		⌥ (hand.button ≟ 1) ⚫sliding1 = ⦿
		∇ found = ⚫whoAtXY(hand.x, hand.y)
		⌥ (found >= 0) {
			⌥ (hand.button ≟ 1) {
				⚫sid = found ⦙
				⚫slideSelMode = !⚫items[⚫sid].selected
				⚫selectCurrent(⚫slideSelMode)
				$ ⦿
			}
			⌥ (⚫sid ≟ found) $ ⦾ ⦙
			∇ old = ⚫sid ⦙ ⚫sid = found ⦙
			⌥ (hand.button ≟ 0) ⚫onItem()
			$ ⦿
		}
		⚫sid = ⚫items ↥ - 1
		$ ⦿
	}
	⌥  (hand.button ≟ 3) {
		⌥ (hand.down) ⚫moveCursor('down')
		⎇ ⚫moveCursor('up')
		$ ⦿
	}
}
TList.can.onCursor = ➮(hand) {
	⌥ (button_state⁰ ≠ ⦿) ⚫sliding = ⦾
	⌥ (button_state⁰ && ⚫sliding) $ ⚫onMouse({ button: 0, down: ⦿, x:hand.x, y:hand.y })
	⌥ (button_state¹ ≠ ⦿) ⚫sliding1 = ⦾
	⌥ (button_state¹ && ⚫sliding1) {
		⚫onMouse({button: 0, down: ⦿, x:hand.x, y:hand.y })
		⚫selectCurrent(⚫slideSelMode)
		$ ⦿
	}
}

TList.can.selectNone = ➮{
	⚫selection = []
	i ⬌ this.items ⏀ ⚫itemsⁱ.selected
	$ ⦿
}

TList.can.selectAll = ➮{
	⌥ (⚫selection ↥ ≟ ⚫items ↥) ⚫selectNone()
	⎇ {
		⚫selection = []
		//if (this.items[i].name != '..')
		i ⬌ this.items ⚫selection ⬊(i), ⚫itemsⁱ.selected = ⦿
	}
	⌥ (⚫selChanged ≠ ∅) ⚫selChanged()
	$ ⦿
}

TList.can.selectItem = ➮(_id, on) { ☛ (⚪) {
	∇ j = selection≀(_id)
	⌥ (items[_id].dir && items[_id].name ≟ '..') $
	⌥ (on ≟ ⦿) {
		⌥ (items[_id].selected ≟ ∅) {
			selection ⬊(_id)
			items[_id].selected = ⦿
			⌥ (⚫selChanged ≠ ∅) ⚫selChanged()
			$ ⦿
		}
	} ⎇ {
		⌥ (items[_id].selected) {
			selection⨄(j, 1)
			⏀ items[_id].selected
			⌥ (⚫selChanged ≠ ∅) ⚫selChanged()
			$ ⦿
		}
	}
	$ ⦾
}}

TList.can.selectCurrent = ➮(on) {
	$ ⚫selectItem(⚫sid, on)
}

TList.can.invertCurrent = ➮{ ☛ (⚪) {
	∇ j = selection≀(sid)
	⌥ (items[sid].dir && items[sid].name ≟ '..') $
	selectCurrent(j < 0)
}}

TList.can.scrollIntoView = ➮{ ☛(⚪) {
	⌥ (sid < d) d = sid
	⌥ (sid > d + (columns * h) - 1) {
		d = sid - (((columns * h) - 1) >> 1)
		⌥ (d < 0) d ⊜
	}
}}

TList.can.onKey = ➮(K) {
	⌥ (K.mod.alt && K.char≠ ∅) {
		⌥ (⚫onAltChar) ⚫onAltChar(K)
		$ ⦿
	}
	$ dnaof(⚪, K)
}
'│─┴'
