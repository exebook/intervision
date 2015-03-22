fs = ≣('fs')

TKeyCode = kindof(TDialog)
TKeyCode.can.init = ➮{
	dnaof(⚪, 40, 1)
	⚫title = 'Код клавиши:'
	⚫key = TLabel.create()
	⚫codes = [0,0,0,0,0,0,0]
	∇ me = ⚪
	⚫key.title = ➮{ $ me.codes⫴('-') }
	⚫add(⚫key, 30, 1)
	⚫addRow()
	⚫cancel = TButton.create(9, 'Закрыть', ➮{ me.close() ⦙ $ ⦿ })
	⚫add(⚫cancel, 10, 1)
	⚫size(⚫w, ⚫addY + 3)
}

TKeyCode.can.onKey = ➮(K) {
	⌥ (dnaof(⚪, K)) $ ⦿
	⌥ (K.down && K.physical) {
		⚫codes ⬊(K.key)
		⚫codes.shift()
		⚫repaint()
	}
}

THelp = kindof(TDialog)
THelp.can.init = ➮(Desktop) {
	dnaof(⚪, ⬠(Desktop.w * 0.7), 1)
	⚫title = 'Руководство'
	⚫view = TTextView.create()
	⚫view.pal = ⚫pal ⦙//bg = $.bg; $.view.fg = $.frame.fg
	⚫view.lines = wrapLines((''
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
	)⌶('\n'), ⚫w - 10)
	∇ H = ⬠(Desktop.h * 0.7)
	⚫add(⚫view, ⚫w - 10, H)
	⚫addRow()
	⚫size(⚫w, ⚫addY + 3)
	⚫react(0, 9, ⚫close)
}

showHelp = ➮{
	∇ t = THelp.create(⚫getDesktop())
	⚫getDesktop().showModal(t)
	⚫repaint()
}

TDriveList = kindof(TList)
TDriveList.can.init = ➮ {
	dnaof(⚪)
}
TDriveList.can.drawItem = ➮(X) {
	∇ F = ⚫pal⁰, B = ⚫pal¹
	⌥ (X.focused) F = ⚫pal², B = ⚫pal³
	⌥ (X.selected) F = ⚫pal⁴
	∇ s = '', t = X.item.title, lights = []
	i ⬌ t {
		⌥ (tⁱ ≟ '^') { lights ⬊(i) ⦙ ♻ }
		s += tⁱ
	}
	⌥ (s ↥ > X.w) s = s⩪(0, X.w)
	⚫rect(X.x, X.y, X.w, 1, ∅, ∅, B)
	∇ x ⊜ // X.x + (X.w >> 1) - (s.length>>1) // center align
	⚫print(x, X.y, s, F, B)
	i ⬌ lights
		⚫set(lightsⁱ + x, X.y, t[lightsⁱ+1],
			⚫pal⁶, ⚫pal³)
	$ ⦿
}

