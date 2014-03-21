TControl = kindof(TView)
TControl.can.init = function() {
	dnaof(this)
	this.name = 'TControl'
}

TButton = kindof(TControl)

TButton.can.init = function(keycode, title, onClick) {
	dnaof(this)
	if (typeof keycode != 'number') {
		log('Invalid Button: ', keycode, title, onClick)
		throw ('invalid button')
	}
	this.name = 'TButton'
	this.key = keycode
	this.title = title
	this.onClick = onClick
	this.pal = getColor.button
}

TButton.can.draw = function() {
	this.clear()
	if (this.title != undefined) {
		var title = ''
		if (typeof this.title == 'string') title = this.title
		if (typeof this.title == 'function') title = this.title()
		this.print((this.w >> 1) - (title.length + 2 >> 1), 0, ' ' + title + ' ', this.pal[0], this.pal[1])
	}
}
TButton.can.onMouse = function (hand) {
	if (hand.down && hand.button == 0 && this.onClick != undefined) return this.onClick()
}

TLabel = kindof(TControl)
TLabel.can.init = function(title) {
	dnaof(this)
	this.disabled = true
	this.name = 'TLabel'
	this.title = title
	this.pal = getColor.dialog
}
TLabel.can.draw = function() {
	this.clear()
	if (this.title != undefined) {
		var title = ''
		if (typeof this.title == 'string') title = this.title
		if (typeof this.title == 'function') title = this.title()
		this.print(0, 0, title, this.pal[0], this.pal[1])
	}
}

TDialog = kindof(TWindow)

TDialog.can.init = function(W, H) {
	dnaof(this)
	this.border = 1
	this.buttons = []
	this.name = 'TDialog'
	this.title = 'Без названия'
	this.size(W, H)
	this.addX = 5, this.addY = 2, this.addLineH = 0
	this.addRow = function() { this.addX = 5, this.addY += this.addLineH }
	this.pal = getColor.dialog
}
TDialog.can.add = function(item, W, H) {
	if (item.name == 'TButton') this.buttons.push(item)
	dnaof(this, item)
	if (this.addX + W > this.w - 2) this.addRow()
	item.x = this.addX, item.y = this.addY, item.size(W, H)
	this.addX += W + 2
	if (H > this.addLineH) this.addLineH = H
}
TDialog.can.onKey = function(K) {
	if (K.down) for (var i = 0; i < this.buttons.length; i++) {
		if (this.buttons[i].key == K.key) {
			this.buttons[i].onClick()
			this.repaint()
			return true
		}
	}
	return dnaof(this, K)
}

TOkCancel = kindof(TDialog)
TOkCancel.can.init = function(message) {
	dnaof(this, 37, 8)
	this.msg = TLabel(message)
	this.add(this.msg, message.length, 1)
	this.addRow()
	var me = this
	this.ok = TButton.create(36, 'Ладно', function() {
		log('you clicked Button1')
		me.close()
		return true
	})
	this.add(this.ok, 10, 1)
	this.cancel = TButton.create(9, 'Отмена', function() {
		log('you clicked Cancel')
		me.close()
		return true
	})
	this.add(this.cancel, 10, 1)
}

TMessageBox = kindof(TDialog)
TMessageBox.can.init = function() {
	dnaof(this, 37, 8)
	var $ = this
	$.msg = TLabel()
	$.add($.msg, message.length, 1)
	$.addRow()
	$.ok = TButton.create(36, 'Ладно', function() {
		log('you clicked Button1')
		$.close()
		if (this.callback != undefined) this.callback(true)
		return true
	})
	$.add($.ok, 10, 1)
	$.cancel = TButton.create(9, 'Отмена', function() {
		log('you clicked Cancel')
		$.close()
		if (this.callback != undefined) this.callback(false)
		return true
	})
	$.add($.cancel, 10, 1)
}

messageBox = function(desktop, message, callback) {
	message = '   ' + message + '   '
	var $ = TDialog.create(message.length + 10, 8)
	$.callback = callback
	$.addRow();
	$.msg = TLabel.create(); $.msg.title = message; $.add($.msg, message.length, 1); $.addRow();$.addRow();
	var ok = TButton.create(keycode.ENTER, 'Ясно', function() {
		$.close()
		if ($.callback != undefined) $.callback(true)
		return true
	}); $.add(ok, 10, 1)
	ok.x = ($.w >> 1) - (ok.w >> 1)
	$.add(TButton.create(keycode.ESCAPE, '', function() {
		$.close()
		if ($.callback != undefined) $.callback(false)
		return true
	}), 0, 0)
	desktop.showModal($)
}


TInput = kindof(TEdit)
TInput.init = function(text) {
	dnaof(this)
	this.multiLine = false
	this.text = text
}


TLabeledEdit = kindof(TEdit)
TLabeledEdit.can.init = function() {
	dnaof(this)
	this.label = ''
	this.spacer = '>'
	this.name = 'TLabeledEdit'
}

TLabeledEdit.can.draw = function(state) {
	this.clear()
	this.print(0, 0, this.label, this.pal[2], this.pal[1])
	this.print(this.label.length, 0, this.spacer, this.pal[2], this.bg)
	this.print(this.label.length + this.spacer.length, 0, this.text, this.pal[0], this.pal[1])
	if (state.focused) {
//		this.print(this.label.length + this.spacer.length + this.text.length, 0,  this.caretChar, 0x3f3, this.bg)
		this.caret = {x: this.label.length + this.spacer.length + this.text.length, y:0}
	} else delete this.caret
}
// auto keyword list by appearance in this file + config with weights

editFileAlt = function(s) {
	glxwin.sh_async('pluma '+ s)
}


