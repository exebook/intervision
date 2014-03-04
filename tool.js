TKeyCode = kindof(TDialog)
TKeyCode.can.init = function() {
	dnaof(this, 40, 1)
	this.title = 'Код клавиши:'
	this.key = TLabel.create()
	this.codes = [0,0,0,0,0,0,0]
	var $ = this
	this.key.title = function() { return $.codes.join('-') }
log('--->')
	this.add(this.key, 30, 1)
log('<---')
	this.addRow()
	this.cancel = TButton.create(9, 'Закрыть', function() { $.close(); return true })
	this.add(this.cancel, 10, 1)
	this.size(this.w, this.addY + 3)
}
TKeyCode.can.onKey = function(key, down, physical) {
	if (dnaof(this, key, down, physical)) return true
	if (down && physical) {
		this.codes.push(key)
		this.codes.shift()
		repaint()
	}
}

showKeyCode = function(Desktop, panel) {
	var keyCode = TKeyCode.create()
	Desktop.showModal(keyCode)
}

THelp = kindof(TDialog)
THelp.can.init = function(Desktop) {
	dnaof(this, Math.round(Desktop.w * 0.7), 1)
	this.title = 'Руководство'
	this.view = TTextView.create()
	this.view.pal = this.pal;//bg = $.bg; $.view.fg = $.frame.fg
	this.view.lines = wrapLines((''
		+ "F1 - данное руководство\n"
		+ "F2 - ...\n"
		+ "F3 - Просмотр файла\n"
		+ "F4 - Вызов редактора\n"
		+ "F5 - Копировать\n"
		+ "F6 - Перенести\n"
		+ "F7 - Создать каталог\n"
		+ "F8 - Удалить\n"
		+ "Insert - Выделение\n"
		+ "Control-A - Выделить все / убрать выделение\n"
		+ "Control-\\ - выйти в корневой каталог\n"
		+ "Control-[ - Добавить путь левой панели в коммандную строку\n"
		+ "Control-] - Добавить путь правой панели в коммандную строку\n"
		+ "Control-Enter - Добавить имя выбранного файла в коммандную строку\n"
		+ "Control-1 - Колонки у\'же, но их больше\n"
		+ "Control-2 - Колонки шире, но их меньше\n"
		+ "Control-R - обновить панель (перечитать содержимое с диска)"
		+ "Control-K - Просмотрщик кодов клавиш на клавиатуре\n"
		+ "Control-O - Убрать панели, показать консоль и обратно\n"
		+ "Up, Down, Page Up, Page Down, Left, Right, Home, End - перемешение указателя в списке файлов\n"
		+ "Alt-буква - Быстрый поиск в текущем списке (понимает регулярные выражения)\n"
		+ "Tab - Переключение между панелями\n"
		+ "Control-U - Поменять панели местами\n"
		+ "Control-P - спрятать/показать противоположную панель\n"
		+ "Control-Вверх, Control-Вниз - история комманд\n"
		+ "Control-.(точка) Показать/скрыть дот-файлы\n"
		+ "\n"
		+ "Конец"
	).split('\n'), this.w - 10)
	var H = Math.round(Desktop.h * 0.7)
	this.add(this.view, this.w - 10, H)
	this.addRow()
	this.size(this.w, this.addY + 3)
}

THelp.can.onKey = function(key, down) {
	if (key == 9) {
		this.Desktop.hideModal(this)
		repaint()
		return
	}
	dnaof(this, key, down)
}

showHelp = function(Desktop) {
	var t = THelp.create(Desktop)
	t.Desktop = Desktop
	Desktop.showModal(t)
}

TDriveMenu = kindof(TDialog)
TDriveMenu.can.init = function() {
	dnaof(this, 40, 1)
	this.title = 'Телепорт:'
	this.addY ++
	//$.bg = 0xabb, $.frame.fg_focus = 0, $.frame.fg = 0, $.frame.bg = $.frame.bg_focus = 0xabb
	var list = [
	//,
	{ key:49, title:'~ (HOME)', path:'~' }, { key:58, title:'/media', path:'/media' }]
	if (glxwin.ijs_fileexists(expandPath('~/.deodar/driveMenu.js'))) {
		list = require(expandPath('~/.deodar/driveMenu.js'))
	}
	var me = this
	for (var i = 0; i < list.length; i++) {
		b = TButton.create(list[i].key, list[i].title, function() {
			this.close();
			panel.list.path = expandPath(this.driveItem.path)
			panel.list.reload()
			var Deodar = panel.parent
			Deodar.actor = panel
			setTimeout(function() { Deodar.input.text = ''; repaint() }, 50) // Ugly hack! Remove it by properly dispatching on_char()
			return true
		})
		b.key = list[i].key; this.add(b, this.w - 10, 1); b.driveItem = list[i];
		this.addRow()
		this.addRow()
	}
	this.size(this.w, this.addY + 2)
	this.frame.bottom_title = 'Escape - отмена'
}
TDriveMenu.can.onKey = function(key, down, physical) {
	if (dnaof(this, key, down, physical)) return true
	if (down && key == 9) {
		this.close()
		repaint()
		return true
	}
}

showDriveMenu = function(Desktop, panel) {
	var menu = TDriveMenu.create()
	Desktop.showModal(menu, panel.x + 1, 3)
}


