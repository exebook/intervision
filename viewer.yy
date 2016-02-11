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
	⚫react(10, keycode['o'], ⚫commandShowOutput)
	⚫react(0, keycode.F9, ⚫commandRun)
	⚫react(10, keycode['x'], ⚫commandRun)
	⚫react(110, keycode['x'], ⚫commandRunNew)
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
	⌥ ⚫viewer.isModified() {
		⚫viewer.save()
	}
	∇ o = ⚫norton.output
//	o.size(⚫w - 2, ⚫h - 2) // НАДО: используй window.getInnerSize // а его пока нет 
//	o.pos(1, 1)
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
		⌥ (⚫fileName≀('.scala') >= 0) app = 'scala '
		⌥ (⚫fileName≀('.py') >= 0) app = 'python '
		⌥ (⚫fileName≀('.rb') >= 0) app = 'ruby '
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
	me.actor = o//∅
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
	//⌥ (⚫viewer.isModified ≠ ∅)
ロ 'SAVING CURSOR POS'
	⌥(⚫viewer.savePosState) ⚫viewer.savePosState() // лучше всегда сохранять?
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

TModalTextView.can.createModifiedWarning = ➮ {
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

TModalTextView.can.onKey = ➮(hand) {
	onlyIfSaved ∆ (hand.plain && hand.key ≟ keycode.ESCAPE)
	|| (hand.key ≟ keycode.LEFT && hand.mod.alt ≟ ⦿)
	|| (hand.key ≟ keycode.RIGHT && hand.mod.alt ≟ ⦿)
	|| (hand.key ≟ keycode.ENTER && hand.mod.control ≟ ⦿)
	
	⌥ (onlyIfSaved && hand.physical) {
		// необычное решение
		⌥ (⚫viewer.isModified ≟ ∅ 
		 || ⚫viewer.isModified() ≟ ⦾) {
			⌥ (hand.down && hand.key ≟ keycode.ESCAPE) {
				⚫close()
				$ ⦿
			}
			$ dnaof(⚪, hand) // dispatch hotkeys alt+left/right
		}
		⥹ (hand.down) {
//			showModifiedWarning()
			⌥ (⚫warn) ⚫warn.hidden = ⦾
			⎇ {
				⚫createModifiedWarning()
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
		⌥ (⚫para >= ⚫text.paraCount() - 1) ⚫para = ⚫text.paraCount() - 1, ⚫sym ⊜
	}
	⚫react(0, keycode.F2, ⚫save)
	⚫react(100, keycode['s'], ⚫save)
	⚫react(100, keycode['p'], ⚫reloadPalette)
	⚫react(101, keycode['t'], ⚫nextTheme)

	// THEY MUST GO TO PARENT (TWindow::TModalTextView)

	⚫react(10, keycode.UP, ⚫openGuide)
	⚫react(10, keycode.DOWN, ⚫openGuide)
	⚫react(10, keycode.RIGHT, ⚫quickToNextFile, {arg:'right'})
	⚫react(10, keycode.LEFT, ⚫quickToNextFile, {arg:'left'})
	
	⚫react(100, keycode.CAPS_LOCK, ⚫openGuide)
	⚫react(100, keycode.ENTER, ⚫openFileAtCursor)
//	⚫react(0, keycode['`'], ➮ { room.say('guide open')⦙$⦿ })
//	⚫react(100, keycode['`'], ➮ { ⚫insertText('`') })
}

➮ extractPathFromLine s x {
	chars ∆ 'QAZWSXEDCRFVTGBYHNUJMIKOLPqazwsxedcrfvtgbyhnujmikolp1234567890.-_/$~!'
	a ∆ x  b ∆ x
	⧖ (chars ≀ (s[a-1]) >= 0 && a > 0) a--
	⧖ (chars ≀ (sᵇ) >= 0 && b < s↥) b++
	$ s ⩪ (a, b-a)
}

TFileEdit.can.openFileAtCursor = ➮ {
	A ∆ ⚫text.textToScroll(⚫para, ⚫sym)
	s ∆ ⚫text.getLines(A⁰, 1)
	txt ∆ s⁰.s
	tab ∆ ''
	⧖ (tab↥ < ⚫text.tab) tab += ' '
	txt = txt.replace('\t', tab)
	filePath ∆ extractPathFromLine(txt, A¹)
	⌥ (filePath↥ ≟ 0) $
	⌥ (filePath⁰ != '/') {
		P ∆ ⚫fileName ⌶ '/'
		P ⬈
		P ⬊ filePath
		filePath = P ⫴ '/'
	}
	ok ∆ ⦾
	⌥ (fs.existsSync(filePath)) ok = ⦿
	⎇ {
		exts ∆ ['yy','js']
		i ⬌ exts {
			⌥ (fs.existsSync(filePath) + '.' + extsⁱ) {
				filePath += '.' + extsⁱ
				ok = ⦿
				@
			}
		}
	}
	⌥ (ok) {
		⚫close()
		⌥ (resortGuideConfig) resortGuideConfig(filePath)
		viewer ∆ viewFile(⚫getDesktop(), filePath, TFileEdit)
		⌥ (viewer) {
			viewer.norton = ⚫parent.norton
		}
	}
}

TFileEdit.can.quickToNextFile = ➮ {
	⌥ (loadGuideConfig ≟ ∅) $
	L ∆ loadGuideConfig()
	∇ fileName
	i ⬌ L {
		⌥ (Lⁱ.path ≟ ⚫fileName) {
			⌥ (a ≟ 'right') {
				⌥ (++i < L↥) fileName = Lⁱ.path
			}
			⥹ (a ≟ 'left') {
				⌥ (--i >= 0) fileName = Lⁱ.path
			}
			@
		}
	}
	⌥ (fileName) {
		⚫savePosState() // this must be all implemented in parent
		// also must save selection in "state"
		⚫close()
		viewer ∆ viewFile(⚫getDesktop(), fileName, TFileEdit)
		⌥ (viewer) {
			viewer.norton = ⚫parent.norton
		}
	}
	⎇ {
		ロ 'fileName empty'
	}
}

TFileEdit.can.openGuide = ➮ {
	showGuide(⚪, ⚫fileName)
	me ∆ ⚪
	signal('guide', 'clean')
	wait('guide', 'select', ➮ {
		me.close()
		⌥ (resortGuideConfig) resortGuideConfig(a)
		viewer ∆ viewFile(me.getDesktop(), a, TFileEdit)
		⌥ (viewer) {
			viewer.norton = me.parent.norton
		}
	})
	$⦿
}

TFileEdit.can.savePosState = ➮{
	// TODO: save selection as well, but think of externally modified file(crc?)
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

