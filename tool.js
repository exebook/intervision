fs = require('fs')

TKeyCode = kindof(TDialog)
TKeyCode.can.init = function() {
	dnaof(this, 40, 1)
	this.title = 'Код клавиши:'
	this.key = TLabel.create()
	this.codes = [0,0,0,0,0,0,0]
	var $ = this
	this.key.title = function() { return $.codes.join('-') }
	this.add(this.key, 30, 1)
	this.addRow()
	this.cancel = TButton.create(9, 'Закрыть', function() { $.close(); return true })
	this.add(this.cancel, 10, 1)
	this.size(this.w, this.addY + 3)
}

TKeyCode.can.onKey = function(K) {
	if (dnaof(this, K)) return true
	if (K.down && K.physical) {
		this.codes.push(K.key)
		this.codes.shift()
		this.repaint()
	}
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
	this.react(0, 9, this.close)
}

showHelp = function() {
	var t = THelp.create(this.getDesktop())
	this.getDesktop().showModal(t)
	this.repaint()
}

TDriveList = kindof(TList)
TDriveList.can.init = function () {
	dnaof(this)
}
TDriveList.can.drawItem = function(X) {
	var F = this.pal[0], B = this.pal[1]
	if (X.focused) F = this.pal[2], B = this.pal[3]
	if (X.selected) F = this.pal[4]
	var s = '', t = X.item.title, lights = []
	for (var i = 0; i < t.length; i++) {
		if (t[i] == '^') { lights.push(i); continue }
		s += t[i]
	}
	if (s.length > X.w) s = s.substr(0, X.w)
	this.rect(X.x, X.y, X.w, 1, ' ', undefined, B)
	var x = 0 // X.x + (X.w >> 1) - (s.length>>1) // center align
	this.print(x, X.y, s, F, B)
	for (var i = 0; i < lights.length; i++) this.set(lights[i] + x, X.y, undefined, this.pal[6], this.pal[3])
	return true
}

