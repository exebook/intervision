themeList = [
//'Green', 'Cyan', 
'White', 'Black',
//'Green2', 'Pink1', 'Purple', 'Yellow', 'Blue1', 
'Atari1', 'Kofe', 'Milk', 'Gray'
]

readColorConfig = ➮{
	∇ cfg = expandPath('~/.deodar/conf.js'), R = 'syntaxWhite'
	⌥ (fs.existsSync(cfg)) {
		cfg = fs.readFileSync(cfg)≂
		∇ config = eval(cfg)
		R = config.editTheme
	}
	⧗ (∇ i ⊜ ⦙ i < 100 ⦙ i++) {
		⌥ ('syntax' + themeList⁰ ≟ R) @
	}
	$ getColor[R]
}

saveColorConfig = ➮(syntax) {
	∇ cfg = expandPath('~/.deodar/conf.js')
	fs.writeFileSync(cfg, ('x={editTheme:"'+syntax+'"}'))
}

TModalTextView = kindof(TWindow)
TModalTextView.can.init = ➮(Desktop, fileName, viewClass, colors) {
	dnaof(⚪)
	∇ colors = readColorConfig()
	⚫title = fileName
	⚫scrollBar = TScrollBar.create(colors)
	⚫add(⚫scrollBar)
	⚫viewer = viewClass.create(fileName)
	⚫viewer.pal = colors
	⚫add(⚫viewer)
	⚫scrollBar.disabled = ⦿
	⚫scrollBar.track = ⚫viewer.track.bind(⚫viewer)
	⚫scrollBar.pal = [⚫viewer.pal⁰, ⚫viewer.pal¹]
	⚫react(100, keycode.ESCAPE, ⚫close)//Prompt)
	⚫react(100, keycode['o'], ⚫commandShowOutput)
	⚫react(0, keycode.F9, ⚫commandRun)
	⚫react(100, keycode.F9, ⚫commandRunNew)
	⚫react(100, keycode['c'], ⚫commandKill)
	⚫actor = ⚫viewer
	⚫runCommand = ''
	⚫runCwd = (fileName⌶('/'))
	⚫runCwd.pop()
	⚫runCwd = ⚫runCwd⫴('/')
	∇ syntax = colors
	⚫pal = [syntax⁰, syntax¹, syntax², syntax³]//colors
	⚫fileName = fileName
}

TModalTextView.can.runDone = ➮{
	⚫hideOutput()
}

∇ fileRunCommands = []
➮ findFileCmd name {
	∇ n = fileRunCommands
	i ⬌ n ⌥ (nⁱ.name ≟ name) $ nⁱ
}

TModalTextView.can.commandRun = ➮{
	⌥ (⚫runCommand ≟ '') {
		∇ N = findFileCmd(⚫fileName)
		⌥ (N) {
			⚫runCommand = N.command
		} ⎇ $ ⚫commandRunNew()
	}
	⚫viewer.save()
	∇ o = ⚫norton.output
	o.size(⚫w - 2, ⚫h - 2) // НАДО: используй window.getInnerSize // а его пока нет 
	o.pos(1, 1)
	∇ f = ⚫runDone.bind(⚪)
	⚫showOutput()
	o.respawn(⚫runCommand, '', ⚫runCwd, f)
	$ ⦿
}

TModalTextView.can.commandKill = ➮{
	⌥ (⚫actor ≟ ∅) { // only if console focused
		∇ o = ⚫norton.output
		o.kill()
		$ ⦿
	}
}

TModalTextView.can.commandRunNew = ➮{
	∇ me = ⚪
	∇ w = TInputBox.create(50, 'Выполнить', 'Имя файла и передаваемые аргументы', ➮(text) {
		me.runCommand = text
		∇ N = findFileCmd(me.fileName)
		⌥ (N) N.command = text ⦙ ⎇ fileRunCommands ⬊({name: me.fileName, command: text})

		⌥ (text ≠ '') me.commandRun()
		⎇ messageBox(
			me.getDesktop(), 
			'Обратите внимание, что вы ничего не ввели и комманда теперь пустая')
	})
	∇ s = ⚫runCommand
	⌥ (s ≟ '') {
		app ∆ './'
		⌥ (⚫fileName≀('.yy') >= 0) app = 'yy '
		⌥ (⚫fileName≀('.js') >= 0) app = 'node '
		s = app + ⚫fileName⌶('/').pop()
	}
	w.input.setText(s)
	⚫getDesktop().showModal(w)
	$ ⦿
}

TModalTextView.can.showOutput = ➮{
	∇ me = ⚪, o = me.norton.output
	me.viewer.curLineHilite = ⦾
	me.hide(me.viewer)
	me.hide(me.scrollBar)
	me.add(o)
	me.actor = ∅
	o.disabled = ⦿
}

TModalTextView.can.hideOutput = ➮{
	∇ me = ⚪, o = me.norton.output
	o.disabled = ⦾
	me.remove(me.norton.output)
	o.parent = me.norton
	me.show(me.viewer)
	me.show(me.scrollBar)
	me.actor = me.viewer
	me.repaint()
}

TModalTextView.can.commandShowOutput = ➮{
	⌥ (⚫actor ≟ ⚫viewer) ⚫showOutput()
	⎇ ⚫hideOutput()
	$ ⦿
}

TModalTextView.can.close = ➮{
	⌥ (⚫actor ≟ ∅) { // console output active
		⚫hideOutput()
		$
	}
	⌥ (⚫viewer.isModified ≠ ∅) ⚫viewer.savePosState()
	dnaof(⚪)
}

TModalTextView.can.closePrompt = ➮{
	⌥ (⚫viewer.isModified ≟ ∅) $ ⚫close() // not an edit
	∇ me = ⚪
	⌥ (⚫viewer.isModified()) {
		∇ win = TExitSaveCancel.create()
		win.link = ⚪
		⚫getDesktop().showModal(win)
	} ⎇ ⚫close()
	$ ⦿
}

TModalTextView.can.onKey = ➮(hand) {
	⌥ (hand.plain && hand.key ≟ keycode.ESCAPE && hand.physical) {
		// необычное решение
		⌥ (⚫viewer.isModified ≟ ∅ 
		 || ⚫viewer.isModified() ≟ ⦾) {
			⌥ (hand.down) ⚫close() ⦙
			$ ⦿
		}
		⥹ (hand.down) {
			⌥ (⚫warn) ⚫warn.hidden = ⦾
			⎇ {
				∇ s = 'Control-Esc: выйти без сохранения'
				⚫warn = TDialog.create()
				⚫warn.title = 'Файл не сохранён'
				⚫warn.size(s ↥ + 14, 6)
				⚫warn.pos((⚫w - ⚫warn.w)>>1, (⚫h - ⚫warn.h)>>1)
				∇ l
				l = TLabel.create(s), l.pos(5, 5)
				⚫warn.add(l, ⚫warn.w - 10, 1)
				l = TLabel.create('F2 или Control-S: сохранить'), l.pos(5, 5)
				⚫warn.add(l, ⚫warn.w - 10, 1)
				⚫add(⚫warn)
			}
			⚫actor = ⚫warn
			⚫repaint()
		} ⎇ {
			⌥ (⚫warn) ⚫warn.hidden = ⦿
			⚫actor = ⚫viewer
		}
		$ ⦿
	}
	$ dnaof(⚪, hand)
}

TModalTextView.can.loadFile = ➮{
	⚫viewer.lines = fs.readFileSync(⚫fileName)≂.replace(/\r/g, '')⌶('\n')
}

TModalTextView.can.size = ➮(W, H) {
	dnaof(⚪, W, H)
	⚫viewer.size(W - 4, H - 2)
	⚫viewer.pos(1, 1)
	⚫scrollBar.size(2, H - 2)
	⚫scrollBar.pos(W - 2, 1)
}

linesCountStart = 1
symCountStart = 1

TModalTextView.can.draw = ➮(state) {
	dnaof(⚪, state)
	⌥ (⚫viewer.isModified) {
		∇ B = ⚫pal¹ | 0x1000, F ⊜x2f2//this.pal[0]
		⌥ (⚫viewer.isModified()) ⚫print(2, ⚫h-1, ' '+graphChar.on+' ', F, B) ⦙
		⎇ ⚫print(2, ⚫h-1, ' '+graphChar.off+' ', F, B)
		⚫print(7, ⚫h-1, ' ' + (⚫viewer.para+linesCountStart) 
			+ ':' + (⚫viewer.sym+symCountStart) +' ', ⚫pal⁰, ⚫pal¹)
	}
}

∇ filePositions = []
➮ findFileMem name {
	i ⬌ filePositions {
		∇ N = filePositionsⁱ
		⌥ (N.name ≟ name) $ N
	}
}

TFileEdit = kindof(TEdit)
TFileEdit.can.init = ➮(fileName) {
	dnaof(⚪)
	⚫fileName = fileName
	❶ ''
	⌥ (fs.existsSync(fileName)) ① = fs.readFileSync(fileName)≂
		⚫text.setText(①)
	⌥ (⚫fileName≀('.asm') > 0
		|| ⚫fileName≀('.inc') > 0) ⚫text.lexer = ASMLexer
	⌥ (⚫fileName≀('.sh') > 0) ⚫text.lexer = ShellLexer
	∇ N = findFileMem(fileName)
	⌥ (N) {
		⚫para = N.para, ⚫sym = N.sym, ⚫delta = N.delta
		⌥ (⚫para >= ⚫text.L ↥ - 1) ⚫para = ⚫text.L ↥ - 1, ⚫sym ⊜
	}
	⚫react(0, keycode.F2, ⚫save)
	⚫react(100, keycode['s'], ⚫save)
	⚫react(100, keycode['p'], ⚫reloadPalette)
	⚫react(101, keycode['t'], ⚫nextTheme)
	⚫react(10, keycode.UP, ⚫openGuide)
	⚫react(10, keycode.DOWN, ⚫openGuide)
	⚫react(10, keycode.RIGHT, ⚫openGuide)
	⚫react(10, keycode.LEFT, ⚫openGuide)
	⚫react(100, keycode.CAPS_LOCK, ⚫openGuide)
//	⚫react(0, keycode['`'], ➮ { room.say('guide open')⦙$⦿ })
//	⚫react(100, keycode['`'], ➮ { ⚫insertText('`') })
}

TFileEdit.can.openGuide = ➮ {
	showGuide(⚪, ⚫fileName)
	me ∆ ⚪
	signal('guide', 'clean')
	wait('guide', 'select', ➮ {
		me.close()
//		ロ 'Signal2', a
		∇ viewer = viewFile(me.getDesktop(), a, TFileEdit)
		⌥ (viewer) {
			viewer.norton = me.parent.norton
		}
//		me.viewFileName(TFileEdit, a)
	})
	$⦿
}

TFileEdit.can.savePosState = ➮{
	∇ N = findFileMem(⚫fileName)
	⌥ (N) {
		N.para = ⚫para, N.sym = ⚫sym, N.delta = ⚫delta
	} ⎇ filePositions ⬊({name: ⚫fileName, para: ⚫para, sym: ⚫sym, delta: ⚫delta})
}

TFileEdit.can.save = ➮{
	try {
		fs.writeFileSync(⚫fileName, ⚫text.getText())
	} catch (e) {
		messageBox(⚫getDesktop(), 'Файл "' + ⚫fileName⌶('/').pop()
		+ '" не удалось сохранить, ' + e)
		$ ⦿
	}
	⚫text.modified = ⦾
	⚫savePosState()
	$ ⦿
}

TFileEdit.can.isModified = ➮{
	$ ⚫text.modified ≟ ⦿
}

TFileEdit.can.nextTheme = ➮{
	readColorConfig()
	themeList ⬊(themeList.shift())
	theme.editor = 'syntax' + themeList⁰
	⚫reloadPalette()
	saveColorConfig(theme.editor)
	$ ⦿
}

TFileEdit.can.reloadPalette = ➮{
	⚫save()
	≣('./palette')
	⚫pal = getColor[theme.editor]
	∇ syntax = ⚫pal
	⚫parent.pal = [syntax⁰, syntax¹, syntax², syntax³]
	⚫parent.scrollBar.pal =
		[syntax⁰, syntax¹, syntax², syntax³]
	⚫parent.draw({active:⦿,focused:⦿})
	⚫repaint()
	$ ⦿
}

➮ viewFileContinue yes {
	⌥ (yes ≟ ⦾) $
	⌥ (⚫viewer.name ≟ 'TTextView') ⚫loadFile()
	⚫size(⚫getDesktop().w, ⚫getDesktop().h)
	⚫getDesktop().showModal(⚪)
}

viewFile = ➮(Desktop, fileName, viewClass, colors) {
	∇ t = TModalTextView.create(Desktop, fileName, viewClass, colors)
	t.parent = Desktop
	try {
		∇ size = fs.statSync(fileName).size
	} catch (e) {
		messageBox(Desktop, 'Файл "' + fileName⌶('/').pop()
		+ '" не удалось открыть')
		$
	}
	room.say('edit begin file', fileName)
	∇ maxSize = 300000
	∇ f = viewFileContinue.bind(t)
	⌥ (size > maxSize && ((t.viewer.name ≟ 'TTextView') || (t.viewer.name ≟ 'TEdit')) ) {
		messageBox(Desktop, 'Файл ' + fileName⌶('/').pop() + ' великоват, ' 
			+ readableSize(size) + ', открыть всё равно?', f)
	} ⎇ f()
	$ t
}

