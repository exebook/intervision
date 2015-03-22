TGroup = kindof(TView)

TGroup.can.init = ➮{
	dnaof(⚪)
	⚫items = []
	⚫name = 'TGroup'
}
TGroup.can.pos = ➮(x, y) {
	dnaof(⚪, x, y)
//	this.x = x, this.y = y
//	var dx = x - this.ux, dy = y - this.uy
//	for (var i = 0; i < this.items.length; i++) {
//		this.items[i].ux += dx
//		this.items[i].uy += dy
//	}
}
TGroup.can.add = ➮(child) {
	child.parent = ⚪
	⌥ (⚫items ≟ ∅) ⚫items = []
	∇ j = ⚫items≀(child)
	⌥ (j < 0) ⚫items ⬊(child)
	⚫actor = child
}
TGroup.can.remove = ➮(item) {
	∇ j = ⚫items≀(item)
	⌥ (j >= 0) ⚫items⨄(j, 1)
	⌥ (⚫actor ≟ item) ⚫actor = ∅
}

TGroup.can.drawChild = ➮(child, state) {
	∇ I = child
	∇ O = SCREEN.O, X = SCREEN.x, Y = SCREEN.y
	SCREEN.O += I.y * SCREEN.W + I.x
	SCREEN.x += I.x
	SCREEN.y += I.y
	I.draw(state)
	SCREEN.O = O
	SCREEN.x = X
	SCREEN.y = Y
}

TGroup.can.draw = ➮(state) {
	⏀ ⚫caret
//	this.clear(' ', this.color.fore, this.color.back)
	i ⬌ this.items {
		∇ I = ⚫itemsⁱ
		⌥ (⚫itemsⁱ.visible()) {
			∇ State = { 
				active: ⚫checkActive(I), 
				focused: ⚫checkFocus(I), 
				disabled: (state.disabled ≟ ⦿)
					|| (⚫disabled ≟ ⦿) || I.disabled ≟ ⦿
			}
			⚫drawChild(I, State)
		}
	}
	i ⬌ this.items {
		∇ I = ⚫itemsⁱ
		//if (I.visible()) I.render(this)
	}
}
TGroup.can.checkActive = ➮(view) {
	$ (⚫actor ≟ view && ⚫parent.checkActive(⚪))
}
TGroup.can.checkFocus = ➮(view) {
	$ (⚫checkActive(view) && (view.actor ≟ ∅))
}

TGroup.can.onKey = ➮(k) {
	⌥ (dnaof(⚪, k)) $ ⦿
	⌥ (⚫actor ≠ ∅ && ⚫actor.onKey ≠ ∅) $ ⚫actor.onKey(k)
}

TGroup.can.next = ➮{
	∇ j = ⚫items≀(⚫actor)
	⌥ (j < 0) j ⊜
	j++
	⌥ (j >= ⚫items ↥) j ⊜
	⚫actor = ⚫itemsʲ
}
TGroup.can.hide = ➮(child) {
	child.hidden = ⦿
}
TGroup.can.show = ➮(child) {
	⏀ child.hidden
}
TGroup.can.whoAtXY = ➮(x, y) {
⌥ (⚫items ≟ ∅) log(⚫name)
	⧗ (∇ i = ⚫items ↥ - 1 ⦙ i >= 0 ⦙ i--) {
		∇ n = ⚫itemsⁱ
		⌥ (n.hidden ≠ ∅) ♻
		⌥ (x >= n.x && x < n.x + n.w && y >= n.y && y < n.y + n.h ) {
			$ n
		}
	}
}

TGroup.can.onMouse = ➮(hand) {
	∇ xdown = hand.down || hand.button ≟ 3 // колёсико всегда фокусит
	⌥ (!xdown) { // верх получает тот же кто и низ
		∇ n = ⚫onMouse.prev
		⌥ (n) $ n.onMouse(hand.child(n))
		$
	}
	⚫onMouse.prev = ∅
	∇ n = ⚫whoAtXY(hand.x, hand.y)
	⚫actor = ∅
//	log('mouse', n == undefined ? 'empty' : n.name)
	⌥ (n ≠ ∅) {
		∇ ret = ⚫actor ≠ n
		⌥ (xdown) ⌥ (n.disabled ≠ ⦿) ⚫actor = n
		⌥ (n.onMouse ≠ ∅) {
			⚫onMouse.prev = n
			⌥ (n.onMouse(hand.child(n))) ret = ⦿
		}
		$ ret
	} ⎇ $ ∅
}

TGroup.can.onCursor = ➮(hand) {
	dnaof(⚪, hand)
	∇ n = ⚫whoAtXY(hand.x, hand.y)
	⌥ (n ≠ ∅) {
		∇ ret// = this.actor != n
		⌥ (n.onCursor ≠ ∅) {
			∇ C = hand.child(n)
			⌥ (n.onCursor(C)) ret = ⦿
		}
		$ ret
	}
}

TDesktop = kindof(TGroup)
TDesktop.can.init = ➮{
	dnaof(⚪)
	⚫name = 'TDesktop'
	⚫actors = []
	⚫modals = []
}
TDesktop.can.getDesktop = ➮{
	$ ⚪
}
TDesktop.can.onMouse = ➮(hand) {
	⌥ (⚫modal ≠ ∅) {
		∇ C = hand.child(⚫modal)
		$ ⚫modal.onMouse(C)
	}
	$ dnaof(⚪, hand)
}
TDesktop.can.showModal = ➮(d, x, y, w, h) {
	⌥ (x ≟ ∅) x = (⚫w >> 1) - (d.w >> 1)
	⌥ (y ≟ ∅) y = (⚫h >> 1) - (d.h >> 1)
	d.pos(x, y)
	⚫actors ⬊(⚫actor)
	⚫add(d)
	⚫modals ⬊(⚫modal)
	⚫modal = d
	d.repaint()
}
TDesktop.can.hideModal = ➮{
	⌥ (⚫modal.onHide) ⚫modal.onHide()
	⚫remove(⚫modal)
	⚫modal = ⚫modals.pop()
	⚫actor = ⚫actors.pop()
	⚫clear()
}
TDesktop.can.checkActive = ➮(view) {
	$ (view ≟ ⚫modal || view ≟ ⚫actor)
}
