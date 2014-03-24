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

TInputBox = kindof(TDialog)
TInputBox.can.init = function(width, title, message, callback) {
	dnaof(this, width, 1)
	this.title = title
	this.msg = TLabel.create(); this.msg.title = message + ':'
	this.add(this.msg, 45, 1); this.addRow()
	this.input = TInput.create(''); this.add(this.input, 45, 1); this.addRow(); this.addRow()
	this.ok = TButton.create(keycode.ENTER, 'Создать', function() { this.close(); callback(); return true })
	this.add(this.ok, 10, 1)
	this.cancel = TButton.create(keycode.ESCAPE, 'Отмена', function() { this.close(); return true })
	this.add(this.cancel, 10, 1)
	this.size(this.w, this.addY + 3)
	this.actor = this.input
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


// auto keyword list by appearance in this file + config with weights



