TDialog = kindof(TWindow)

TDialog.can.init = ➮(W, H) {
	dnaof(⚪)
	⚫border = 1
	⚫buttons = []
	⚫name = 'TDialog'
	⚫title = 'Без названия'
	⚫size(W, H)
	⚫addX = 5, ⚫addY = 2, ⚫addLineH = 0
	⚫addRow = ➮{ ⚫addX = 5, ⚫addY += ⚫addLineH }
	⚫pal = getColor.dialog
}

TDialog.can.add = ➮(item, W, H) {
	⌥ (item.name ≟ 'TButton') ⚫buttons ⬊(item)
	dnaof(⚪, item)
	⌥ (⚫addX + W > ⚫w - 2) ⚫addRow()
	item.x = ⚫addX, item.y = ⚫addY, item.size(W, H)
	⚫addX += W + 2
	⌥ (H > ⚫addLineH) ⚫addLineH = H
}

TDialog.can.onKey = ➮(K) {
	⌥ (K.down) i ⬌ this.buttons {
		∇ key = ⚫buttonsⁱ.key, k
		⌥ ((key⧉===[]⧉ && key≀(K.key) >= 0) || key ≟ K.key) {
			⚫buttonsⁱ.onClick()
			⚫repaint()
			$ ⦿
		}
	}
	$ dnaof(⚪, K)
}

TOkCancel = kindof(TDialog)
TOkCancel.can.init = ➮(message, callbackOk, callbackCancel) {
	dnaof(⚪, message ↥ + 14+5, 6)
	⚫msg = TLabel.create(message)
	∇ me = ⚪
	⚫ok = TButton.create(keycode.ENTER, 'Ладно', ➮{
		me.close()
		⌥ (callbackOk) callbackOk()
		$ ⦿
	})
	⚫cancel = TButton.create(keycode.ESCAPE, 'Отмена', ➮{
		me.close()
		⌥ (callbackCancel) callbackCancel()
		$ ⦿
	})
	⚫add(⚫msg, message ↥, 1)
	⚫addRow()
	⚫add(⚫ok, 10, 1)
	⚫add(⚫cancel, 10, 1)
}

TInputBox = kindof(TDialog)
TInputBox.can.init = ➮(width, title, message, callback) {
	dnaof(⚪, width, 1)
	∇ me = ⚪
	⚫title = title
	⚫msg = TLabel.create() ⦙ ⚫msg.title = message + ':'
	⚫add(⚫msg, width - 10, 1) ⦙ ⚫addRow()
	⚫input = TInput.create('') ⦙ ⚫add(⚫input, width - 10, 1) ⦙ ⚫addRow() ⦙ ⚫addRow()
	⚫ok = TButton.create(keycode.ENTER, 'Далее', ➮{ 
		me.close() ⦙ callback(me.input.getText()) ⦙ $ ⦿ })
	⚫add(⚫ok, 10, 1)
	⚫cancel = TButton.create(keycode.ESCAPE, 'Отмена', ➮{ ⚫close() ⦙ $ ⦿ })
	⚫add(⚫cancel, 10, 1)
	⚫size(⚫w, ⚫addY + 3)
	⚫actor = ⚫input
}

TReplaceBox = kindof(TDialog)
TReplaceBox.can.init = ➮(width, title, msg1, msg2, callback) {
	dnaof(⚪, width, 1)
	∇ me = ⚪
	⚫title = title
	
	⚫msg = TLabel.create() ⦙ ⚫msg.title = msg1 + ':'
	⚫add(⚫msg, width - 10, 1) ⦙ ⚫addRow()
	⚫search = TInput.create('') ⦙
	⚫add(⚫search, width - 10, 1) ⦙ ⚫addRow()
	
	⚫msg2 = TLabel.create() ⦙ ⚫msg2.title = msg2 + ':'
	⚫add(⚫msg2, width - 10, 1) ⦙ ⚫addRow()
	⚫replace = TInput.create('') ⦙
	⚫add(⚫replace, width - 10, 1) ⦙ ⚫addRow() ⦙ ⚫addRow()
	
	➮ tab dest {
		me.actor = dest
		⚫getDesktop().display.caretReset()
		$ ⦿
	}
	⚫search.react(0, keycode.TAB, tab, {arg:⚫replace})
	⚫replace.react(0, keycode.TAB, tab, {arg:⚫search})

	⚫ok = TButton.create(keycode.ENTER, 'Создать', ➮{ 
		me.close() ⦙ 
		callback(me.search.getText(), me.replace.getText()) ⦙ 
		$ ⦿
	})
	⚫add(⚫ok, 10, 1)
	⚫cancel = TButton.create(keycode.ESCAPE, 'Отмена', 
		➮{ ⚫close() ⦙ $ ⦿ })
	⚫add(⚫cancel, 10, 1)
	⚫size(⚫w, ⚫addY + 3)
	⚫actor = ⚫search
}

TExitSaveCancel = kindof(TDialog)
TExitSaveCancel.can.init = ➮{
	∇ message = 'Выйти без сохранения?'
	dnaof(⚪, 50, 6)
	⚫title = 'Выход и сохранение'
	⚫msg = TLabel.create(message)
	⚫add(⚫msg, message ↥, 1)
	⚫addRow()
	∇ me = ⚪
	⚫yes = TButton.create(keycode.ENTER, 'Да', ➮{
		me.link.close()
		me.close()
		$ ⦿
	})
	⚫add(⚫yes, 10, 1)
	⚫save = TButton.create(keycode.F2, ' Сохранить', ➮{
		saveAndClose()
	})
	⚫add(⚫save, 11, 1)
	⚫cancel = TButton.create(keycode.ESCAPE, 'Отмена', ➮{
		me.close()
		$ ⦿
	})
	⚫add(⚫cancel, 10, 1)
	⚫addRow()
	⚫addRow()
	⚫hint = TLabel.create('F2, Control-S: соханить и выйти')
	⚫add(⚫hint, ⚫w - 10, 1)
	⚫size(⚫w, ⚫addY + 3)
	➮ saveAndClose {
		me.link.viewer.save()
		me.link.close()
		me.close()
		$ ⦿
	}
	⚫react(100, keycode['s'], saveAndClose)
}


TMessageBox = kindof(TDialog)
TMessageBox.can.init = ➮{
	dnaof(⚪, 37, 8)
	∇ me = ⚪
	me.msg = TLabel()
	me.add(me.msg, message ↥, 1)
	me.addRow()
	me.ok = TButton.create(36, 'Ладно', ➮{
		log('you clicked Button1')
		me.close()
		⌥ (⚫callback ≠ ∅) ⚫callback(⦿)
		$ ⦿
	})
	me.add(me.ok, 10, 1)
	me.cancel = TButton.create(9, 'Отмена', ➮{
		log('you clicked Cancel')
		me.close()
		⌥ (⚫callback ≠ ∅) ⚫callback(⦾)
		$ ⦿
	})
	me.add(me.cancel, 10, 1)
}

messageBox = ➮(desktop, message, callback) {
	message = '   ' + message + '   '
	∇ me = TDialog.create(message ↥ + 10, 8)
	me.title = 'К сведению'
	me.callback = callback
	me.addRow() ⦙
	me.msg = TLabel.create() ⦙ me.msg.title = message ⦙ 
	me.add(me.msg, message ↥, 1) ⦙ me.addRow() ⦙me.addRow() ⦙
	∇ ok = TButton.create(keycode.ENTER, 'Ясно', ➮{
		me.close()
		⌥ (me.callback ≠ ∅) me.callback(⦿)
		$ ⦿
	}) ⦙ me.add(ok, 10, 1)
	ok.x = (me.w >> 1) - (ok.w >> 1)
	me.add(TButton.create(keycode.ESCAPE, '', ➮{
		me.close()
		⌥ (me.callback ≠ ∅) me.callback(⦾)
		$ ⦿
	}), 0, 0)
	desktop.showModal(me)
}

TKeyChoose = kindof(TDialog)
TKeyChoose.can.onKey = ➮ (K) {
	⌥ (K.key ≟ keycode.ESCAPE) { ⚫close() } //process.exit()⦙$}
	⌥ (K.key ≟ keycode.DELETE) { ⚫close() ⦙ ⚫onSelected(∅) }
	⌥ (dnaof(⚪, K)) $ ⦿ ⦙
	⌥ (K.physical) {
		⌥ (K.down) {
			⚫KEY = K
			$ ⦿
		} ⥹ (⚫KEY && ⚫KEY.char) {
			⚫close()
			⚫onSelected(⚫KEY)
			ロ 'Selection:', K.key, ⚫KEY.char
		}
	}
	$ dnaof(⚪, K)
}
TKeyChoose.can.draw = ➮{
	dnaof(⚪, a)
	❶ 'Выбор буквы:'
	⚫print(5, 3, ①, ⚫pal⁰, ⚫pal¹)
	K ∆ ⚫KEY
	⌥ (K) {
		⚫print(5 + ①↥ +2, 3, ' '+K.char+' ', ⚫pal¹, ⚫pal⁰)
	}
}

makeKeyChoose = ➮ (desktop, f) {
	w ∆ TKeyChoose.create()
	w.title = 'Нажми!'
	w.bottomTitle = 'Esc:отмена,Del:сброс'
	w.pos(1,1)
	w.size(32, 7)
	w.x = (desktop.w >> 1) - (w.w >> 1)
	w.onSelected = f
	desktop.showModal(w)
//	desktop.add(w)
//	desktop.actor = w
}

// auto keyword list by appearance in this file + config with weights



