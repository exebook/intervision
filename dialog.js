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
		var key = this.buttons[i].key, k
		if ((key.map===[].map && key.indexOf(K.key) >= 0) || key == K.key) {
			this.buttons[i].onClick()
			this.repaint()
			return true
		}
	}
	return dnaof(this, K)
}

TOkCancel = kindof(TDialog)
TOkCancel.can.init = function(message, callbackOk, callbackCancel) {
	dnaof(this, message.length + 14, 6)
	this.msg = TLabel.create(message)
	this.add(this.msg, message.length, 1)
	this.addRow()
	var me = this
	this.ok = TButton.create(keycode.ENTER, 'Ладно', function() {
		me.close()
		if (callbackOk) callbackOk()
		return true
	})
	this.add(this.ok, 10, 1)
	this.cancel = TButton.create(keycode.ESCAPE, 'Отмена', function() {
		me.close()
		if (callbackCancel) callbackCancel()
		return true
	})
	this.add(this.cancel, 10, 1)
}

TInputBox = kindof(TDialog)
TInputBox.can.init = function(width, title, message, callback) {
	dnaof(this, width, 1)
	var me = this
	this.title = title
	this.msg = TLabel.create(); this.msg.title = message + ':'
	this.add(this.msg, width - 10, 1); this.addRow()
	this.input = TInput.create(''); this.add(this.input, width - 10, 1); this.addRow(); this.addRow()
	this.ok = TButton.create(keycode.ENTER, 'Создать', function() { 
		me.close(); callback(me.input.getText()); return true })
	this.add(this.ok, 10, 1)
	this.cancel = TButton.create(keycode.ESCAPE, 'Отмена', function() { this.close(); return true })
	this.add(this.cancel, 10, 1)
	this.size(this.w, this.addY + 3)
	this.actor = this.input
}

TExitSaveCancel = kindof(TDialog)
TExitSaveCancel.can.init = function() {
	var message = 'Выйти без сохранения?'
	dnaof(this, 50, 6)
	this.title = 'Выход и сохранение'
	this.msg = TLabel.create(message)
	this.add(this.msg, message.length, 1)
	this.addRow()
	var me = this
	this.yes = TButton.create(keycode.ENTER, 'Да', function() {
		me.link.close()
		me.close()
		return true
	})
	this.add(this.yes, 10, 1)
	this.save = TButton.create(keycode.F2, ' Сохранить', function() {
		saveAndClose()
	})
	this.add(this.save, 11, 1)
	this.cancel = TButton.create(keycode.ESCAPE, 'Отмена', function() {
		me.close()
		return true
	})
	this.add(this.cancel, 10, 1)
	this.addRow()
	this.addRow()
	this.hint = TLabel.create('F2, Control-S: соханить и выйти')
	this.add(this.hint, this.w - 10, 1)
	this.size(this.w, this.addY + 3)
	function saveAndClose() {
		me.link.viewer.save()
		me.link.close()
		me.close()
		return true
	}
	this.react(100, keycode['s'], saveAndClose)
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
	$.title = 'К сведению'
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



