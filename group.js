TGroup = kindof(TView)

TGroup.can.init = function() {
	dnaof(this)
	this.items = []
	this.name = 'TGroup'
}
TGroup.can.add = function(child) {
	child.parent = this
	if (this.items == undefined) this.items = []
	this.items.push(child)
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
TGroup.can.onMouse = function(button, down, x, y) {
	if (!down) return
	var n = this.whoAtXY(x, y)
	this.actor = undefined
//	log('mouse', n == undefined ? 'empty' : n.name)
	if (n != undefined) {
		var ret = this.actor != n
		if (down) if (n.disabled != true) this.actor = n
		if (n.onMouse != undefined) {
			if (n.onMouse(button, down, x - n.x, y - n.y)) ret = true
		}
		return ret
	} else return undefined
}
TGroup.can.onCursor = function(x, y) {
	var n = this.whoAtXY(x, y)
	if (n != undefined) {
		var ret// = this.actor != n
		if (n.onCursor != undefined) {
			if (n.onCursor(x - n.x, y - n.y)) ret = true
		}
		return ret
	}
}

TDesktop = kindof(TGroup)
TDesktop.can.init = function() {
	dnaof(this)
	this.name = 'TDesktop'
	this.actors = []
}
TDesktop.can.getDesktop = function() {
	return this
}
TDesktop.can.onMouse = function(button, down, x, y) {
	if (this.modal != undefined) return this.modal.onMouse(button, down, x - this.modal.x, y - this.modal.y)
	return dnaof(this, button, down, x, y)
}
TDesktop.can.showModal = function(d, x, y, w, h) {
	if (x == undefined) x = (this.w >> 1) - (d.w >> 1)
	if (y == undefined) y = (this.h >> 1) - (d.h >> 1)
	d.pos(x, y)
	this.actors.push(this.actor)
	this.add(d)
	this.modal = d
	d.repaint()
}
TDesktop.can.hideModal = function() {
	this.remove(this.modal)
	this.modal = undefined
	this.actor = this.actors.pop()
	this.clear()
}
TDesktop.can.checkActive = function(view) {
	return (view == this.modal || view == this.actor)
}
