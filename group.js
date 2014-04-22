TGroup = kindof(TView)

TGroup.can.init = function() {
	dnaof(this)
	this.items = []
	this.name = 'TGroup'
}
TGroup.can.add = function(child) {
	child.parent = this
	if (this.items == undefined) this.items = []
	var j = this.items.indexOf(child)
	if (j < 0) this.items.push(child)
	this.actor = child
}
TGroup.can.remove = function(item) {
	var j = this.items.indexOf(item)
	if (j >= 0) this.items.splice(j, 1)
	if (this.actor == item) this.actor = undefined
}

TGroup.can.draw = function(state) {
	delete this.caret
//	this.clear(' ', this.color.fore, this.color.back)
	for (var i = 0; i < this.items.length; i++)
		if (this.items[i].visible())
			this.items[i].draw({ 
				active: this.checkActive(this.items[i]), 
				focused: this.checkFocus(this.items[i]), 
				disabled: (state.disabled == true) || (this.disabled == true)
			})
	for (var i = 0; i < this.items.length; i++) {
		if (this.items[i].visible()) this.items[i].render(this)
	}
}
TGroup.can.checkActive = function(view) {
	return (this.actor == view && this.parent.checkActive(this))
}
TGroup.can.checkFocus = function(view) {
	return (this.checkActive(view) && (view.actor == undefined))
}

TGroup.can.onKey = function(k) {
	if (dnaof(this, k)) return true
	if (this.actor != undefined && this.actor.onKey != undefined) return this.actor.onKey(k)
}

TGroup.can.next = function() {
	var j = this.items.indexOf(this.actor)
	if (j < 0) j = 0
	j++
	if (j >= this.items.length) j = 0
	this.actor = this.items[j]
}
TGroup.can.hide = function(child) {
	child.hidden = true
}
TGroup.can.show = function(child) {
	delete child.hidden
}
TGroup.can.whoAtXY = function(x, y) {
if (this.items == undefined) log(this.name)
	for (var i = this.items.length - 1; i >= 0; i--) {
		var n = this.items[i]
		if (n.hidden != undefined) continue
		if (x >= n.x && x < n.x + n.w && y >= n.y && y < n.y + n.h ) {
			return n
		}
	}
}

TGroup.can.onMouse = function(hand) {
	if (!hand.down) { // верх получает тот же кто и низ
		var n = this.onMouse.prev
		if (n) return n.onMouse(hand.child(n))
		return
	}
	this.onMouse.prev = undefined
	var n = this.whoAtXY(hand.x, hand.y)
	this.actor = undefined
//	log('mouse', n == undefined ? 'empty' : n.name)
	if (n != undefined) {
		var ret = this.actor != n
		if (hand.down) if (n.disabled != true) this.actor = n
		if (n.onMouse != undefined) {
			this.onMouse.prev = n
			if (n.onMouse(hand.child(n))) ret = true
		}
		return ret
	} else return undefined
}

TGroup.can.onCursor = function(hand) {
	dnaof(this, hand)
	var n = this.whoAtXY(hand.x, hand.y)
	if (n != undefined) {
		var ret// = this.actor != n
		if (n.onCursor != undefined) {
			var C = hand.child(n)
			if (n.onCursor(C)) ret = true
		}
		return ret
	}
}

TDesktop = kindof(TGroup)
TDesktop.can.init = function() {
	dnaof(this)
	this.name = 'TDesktop'
	this.actors = []
	this.modals = []
}
TDesktop.can.getDesktop = function() {
	return this
}
TDesktop.can.onMouse = function(hand) {
	if (this.modal != undefined) {
		var C = hand.child(this.modal)
		return this.modal.onMouse(C)
	}
	return dnaof(this, hand)
}
TDesktop.can.showModal = function(d, x, y, w, h) {
	if (x == undefined) x = (this.w >> 1) - (d.w >> 1)
	if (y == undefined) y = (this.h >> 1) - (d.h >> 1)
	d.pos(x, y)
	this.actors.push(this.actor)
	this.add(d)
	this.modals.push(this.modal)
	this.modal = d
	d.repaint()
}
TDesktop.can.hideModal = function() {
	if (this.modal.onHide) this.modal.onHide()
	this.remove(this.modal)
	this.modal = this.modals.pop()
	this.actor = this.actors.pop()
	this.clear()
}
TDesktop.can.checkActive = function(view) {
	return (view == this.modal || view == this.actor)
}
