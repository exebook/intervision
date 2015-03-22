⌥ (⬤ clipboardSet ≟ '∅') {
	clipboardData = ''
	clipboardSet = ➮ (s) { clipboardData = s }
	clipboardGet = ➮ { $ clipboardData }
}

TEdit = kindof(TView)

TEdit.can.init = ➮{
	dnaof(⚪)
	⚫text = TText.create()
	⚫L = []
	⚫name = 'TEdit'
	⚫multiLine = ⦿
	⚫pal = getColor.syntaxBlack
	⌥ (handyContext && handyContext.lastSearchQuery) ⚫textToFind = handyContext.lastSearchQuery
	⚫delta ⊜
	⚫para ⊜
	⚫sym ⊜
	⚫targetX ⊜
	⚫curLineHilite = ⦾
	⚫sel = TSelection.create()
	⚫lineClipboard = []

☛ (⚪) ☛ (keycode) {
	react(100, keycode['z'], commandUndo, {arg:'undo'})
	react(101, keycode['z'], commandUndo, {arg:'redo'})
	react(100, keycode['m'], setMatch, { role:['multi']} )
	react(100, keycode['c'], userCopy)
	react(100, keycode['v'], userPaste)
	react(100, keycode['x'], userCut)
	react(100, keycode.INSERT, userCopy)
	react(1, keycode.INSERT, userPaste)
	react(1, keycode.DELETE, userCut)
	react(100, keycode['d'], commandLineDelete, { role:['multi'] })
	react( 10, keycode['d'], commandLineBack, { role:['multi'] })
	react(0, keycode.ENTER, commandEnter, { role:['multi'] })
	react(100, keycode['g'], commandGoToLine, { role:['multi'] })
	react(100, keycode['f'], commandFind, { role:['multi']})
	react(100, keycode['h'], commandReplace, { role:['multi']})
	react(100, keycode['l'], commandFindNext, { arg:⦿, role:['multi'] })
	react(101, keycode['l'], commandFindPrev, { role:['multi'] })
	react(101, keycode['c'], commandComment, {arg:'comment'})
	react(101, keycode['x'], commandComment, {arg:'uncomment'})
	react(0, keycode.F3, commandFindNext, { arg:⦿, role:['multi'] })
	react(1, keycode.F3, commandFindPrev, { role:['multi'] })

	react(101, keycode.TAB, commandTab, { arg: 'convert', role:['multi'] } )
	react(0, keycode.TAB, commandTab, { arg: 'indent', role:['multi'] } )
	react(1, keycode.TAB, commandTab, { arg: 'unindent', role:['multi'] } )
}
	⚫react(0, keycode.DELETE, ⚫commandDelete)
	⚫react(100, keycode.DELETE, ⚫commandDeleteWord)
	⚫react(0, keycode.BACK_SPACE, ⚫commandDeleteBack)
	⚫react(100, keycode.BACK_SPACE, ⚫commandDeleteWordBack)
	⚫react(100, keycode.UP, ⚫lineScroll, {arg:-1})
	⚫react(100, keycode.DOWN, ⚫lineScroll, {arg:1})
	⚫react(0, keycode.UP, ⚫handleCursorKey, {arg:'up', role:['multi']})
	⚫react(0, keycode.DOWN, ⚫handleCursorKey, {arg:'down', role:['multi']})
	⚫react(0, keycode.HOME, ⚫handleCursorKey, {arg:'home'})
	⚫react(0, keycode.END, ⚫handleCursorKey, {arg:'end'})
	⚫react(0, keycode.PAGE_UP, ⚫handleCursorKey, {arg:'pageup', role:['multi']})
	⚫react(0, keycode.PAGE_DOWN, ⚫handleCursorKey, {arg:'pagedown', role:['multi']})
	⚫react(0, keycode.LEFT, ⚫handleCursorKey, {arg:'left'})
	⚫react(0, keycode.RIGHT, ⚫handleCursorKey, {arg:'right'})
	⚫react(100, keycode.LEFT, ⚫handleCursorKey, {arg:'wordleft'})
	⚫react(100, keycode.RIGHT, ⚫handleCursorKey, {arg:'wordright'})
	⚫react(100, keycode.PAGE_UP, ⚫handleCursorKey, {arg:'top', role:['multi']})
	⚫react(100, keycode.PAGE_DOWN, ⚫handleCursorKey, {arg:'bottom', role:['multi']})

	⚫react(100, keycode['a'], ⚫shiftSel, {arg: 'all'})

	⚫react(1, keycode.UP, ⚫shiftSel, {arg:'up', role:['multi']})
	⚫react(1, keycode.DOWN, ⚫shiftSel, {arg:'down', role:['multi']})
	⚫react(1, keycode.HOME, ⚫shiftSel, {arg:'home'})
	⚫react(1, keycode.END, ⚫shiftSel, {arg:'end'})
	⚫react(1, keycode.PAGE_UP, ⚫shiftSel, {arg:'pageup', role:['multi']})
	⚫react(1, keycode.PAGE_DOWN, ⚫shiftSel, {arg:'pagedown', role:['multi']})
	⚫react(1, keycode.LEFT, ⚫shiftSel, {arg:'left'})
	⚫react(1, keycode.RIGHT, ⚫shiftSel, {arg:'right'})
	⚫react(101, keycode.LEFT, ⚫shiftSel, {arg:'wordleft'})
	⚫react(101, keycode.RIGHT, ⚫shiftSel, {arg:'wordright'})
	⚫react(101, keycode.PAGE_UP, ⚫shiftSel, {arg:'top', role:['multi']})
	⚫react(101, keycode.PAGE_DOWN, ⚫shiftSel, {arg:'bottom', role:['multi']})
//	this.clipboardData = '<abc\ncde>'
//	this.sel.start(0, 0)
//	this.sel.end(0, 0)
}

TEdit.can.setMatch = ➮ {
	⌥ (⚫match) {
		⚫oldMatch = ⚫match
		⏀ ⚫match
		$ ⦿
	}
	⌥ (!⚫sel.clean()) {
		∇ sel = ⚫sel.get()
		⌥ (sel && sel.a.y ≟ sel.b.y) {
			⚫match = ⚫text.getSelText(⚫sel)
			$ ⦿
		}
	}
	⌥ (⚫oldMatch) ⚫match = ⚫oldMatch
	$ ⦿
}

TEdit.can.size = ➮(w, h) {
	dnaof(⚪, w, h)
	⚫text.w = w
	⚫text.h = h
}

➮ colorizeMatch line match colorIndex {
	⌥ (match ↥ > 31) $
	∇ s = line.s
	∇ t = ''
	∇ i ⊜ ⦙
	∞ {
		i = s≀(match, i)
		⌥ (i < 0) @
		∇ m = match ↥ + i
		⧗ ( ⦙ i < m ⦙ i++) line.cⁱ = colorIndex
	}
}

TEdit.can.draw = ➮(state) {
	dnaof(⚪, state)
	∇
		me = ⚪,
		caret = ⚫text.textToScroll(⚫para, ⚫sym),
		lines = ⚫text.getLines(⚫delta, ⚫h),
		Y = ⚫delta, sel = ⚫sel.get(), selState,
		match
	⌥ (⚫multiLine ≟ ⦿) {
		⌥ (sel && sel.a.y ≟ sel.b.y) match = ⚫text.getSelText(⚫sel)
		⌥ (⚫match) match = ⚫match
	}
	
	⌥ (sel) sel.a = ⚫text.textToScroll(sel.a.y, sel.a.x), sel.b = ⚫text.textToScroll(sel.b.y, sel.b.x)
//	if (caret[1] == undefined) caret[1] = 0
	⌥ (state.focused && caret) F = ⚫pal², SCREEN.caret = { x: caret¹+SCREEN.x, y: caret⁰ - ⚫delta + SCREEN.y, color: ⚫pal⁰ }
	⎇ ⏀ SCREEN.caret
	∇ braceLevel ⊜, curlyLevel ⊜, B, F
	∇ lineComment = ⦾, keyw = keyw0 = 10//7-ok
	l ⬌ lines {
		∇ line = linesˡ
		⌥ (match) colorizeMatch(line, match)
		B = ⚫pal¹
		⌥ (sel) {
			⌥ (Y < sel.a⁰) selState ⊜
				⥹ (Y ≟ sel.a⁰) { ⌥ (Y ≠ sel.b⁰) selState = 1 ⦙ ⎇ selState = 2 }
				⥹ (Y ≟ sel.b⁰) selState = 3
				⥹ (Y > sel.b⁰) selState = 4
				⎇ selState = 5
		}
		∇ px ⊜
		⌥ (match) colorizeMatch(line, match, -1)
		⌥ (line.part ≟ 0) lineComment = ⦾, keyw = keyw0
		∇ lineHilite = ⚫curLineHilite && (caret⁰ - ⚫delta ≟ l)
		x ⬌ line.s {
			B = ⚫pal¹
			∇ X = line.wˣ
			∇ char = line.sˣ, P = line.cˣ
			⌥ (P ≟ -1) {
				B ⊜xff, F ⊜x800
				⌥ (⚫match) B ⊜x88f, F ⊜x0cc
			} ⎇ F = ⚫pal[P + 5]
			∇ selc = ⦾
			⌥ 	(selState ≟ 5 || 
					(selState ≟ 1 && X >= sel.a¹)
				|| (selState ≟ 2 && X >= sel.a¹ && X < sel.b¹) 
				|| (selState ≟ 3 && X < sel.b¹)
			) B = ⚫pal⁴, lineHilite = ⦾, selc = ⦿//, F = this.pal[P + 5]

//			if (lineHilite) B = blend(B, 0x1, 0xfff)
➮ remHere {
//	var lex = me.text.lexer, rem = lex.lineComment, b = true
//	for (var i = 0; i < rem.length; i++) { if (rem[i] != line.s[x + i]) { b = false; break } }
//	if (b) log('*')
	$ 
	char ≟ '/' && line.s[x + 1] ≟ '/' && P ≠ me.text.lexer.cstr
}
			⌥ (char ≟ '(') { F = ⚫pal[keyw+braceLevel], braceLevel++ }
			⥹ (char ≟ ')') 
				{ ⌥ (braceLevel > 0) braceLevel--, F = ⚫pal[keyw+braceLevel] }
			⥹ (char ≟ '{') 
				{ F = ⚫pal[keyw+curlyLevel], curlyLevel++ }
			⥹ (char ≟ '}') { 
				⌥ (curlyLevel > 0) curlyLevel--, 
					F = ⚫pal[keyw+curlyLevel]
			}
			⎇ {
				∇ lex = me.text.lexer, rem = lex.lineComment, brem = ⦿
				i ⬌ rem {
					⌥ (remⁱ ≠ line.s[x + i]) { brem = ⦾ ⦙ @ }
				}
				//if (b) log('*')
				//if (char == '/' && line.s[x + 1] == '/' && P != me.text.lexer.cstr) 
				⌥ (brem && ⚫text.lexer.cstr) lineComment = ⦿
			}
			⌥ (lineComment) F = ⚫pal⁵
			⌥ (char ≟ '\t') {
				∇ tabc = '   '
				⌥ (sel && selc) B = ⚫pal⁴, tabc = line.s[x+1]≟'\t'?' → ':' ⇥ '//
				⚫print(
					X, l, tabc, ⚫pal⁰ | 0xa000, B | 0x0000) //'░'
			}
			⎇ ⚫set(X, l, char, F, B), px++
		}
		⌥ (line.last) { // show line end marker
			B = ⚫pal¹
			∇ ch = ' '
			⌥ (sel && sel.a⁰ <= Y && sel.b⁰ > Y) B = ⚫pal⁴, ch = '¶'
			⚫set(line.w[line.s ↥], l, ch, ⚫pal⁰ | 0xa000, B)
		}
		⌥ (lineHilite) {
			B = blend(B, 0x1, 0xfff)
			⧗ (∇ X ⊜ ⦙ X < ⚫w ⦙ X++) ⚫set(X, l, ∅, ∅, B)
		}
		Y++
	}
	⌥ (l < ⚫h) {
		⚫rect(0, l, ⚫w, ⚫h-1, '░', ⚫pal⁰ | 0xa000, ⚫pal¹)
			// | 0x1000)
	}
}

TEdit.can.updateTargetX = ➮{
	∇ A = ⚫text.textToScroll(⚫para, ⚫sym)
	⚫targetX = A¹
}

TEdit.can.moveCursor = ➮(arg) { ☛ (⚪) {
	∇ me = ⚪
	➮ newX { ☛ (me) {
		∇ A = text.textToScroll(para, sym)
		A = text.scrollToText(A⁰, targetX)
		⌥  (A) para = A⁰, sym = A¹
	}}
	⌥ (arg ≟ 'left') {
		sym--
		⌥ (sym < 0) {
			sym ⊜
			⌥ (para > 0)  sym = ⚫text.L[--para] ↥
		}
		updateTargetX()
	} ⥹ (arg ≟ 'right') {
		sym++
		⌥ (sym > text.L[para] ↥) {
			⌥ (para < text.L ↥ - 1) {
				sym ⊜
				para++
			} ⎇ sym--
		}
		updateTargetX()
	} ⥹ (arg ≟ 'up') {
		∇ A = text.textToScroll(para, sym)
		⌥ (A⁰ > 0) {
			A⁰--
			A = text.scrollToText(A⁰, targetX)
			para = A⁰, sym = A¹
		}
	} ⥹ (arg ≟ 'down') {
		∇ A = text.textToScroll(para, sym)
		⌥ (A⁰ < text.getHeight() - 1) {
			A⁰++
			A = text.scrollToText(A⁰, targetX)
			para = A⁰, sym = A¹
		}
	} ⥹ (arg ≟ 'home') {
		∇ A = text.textToScroll(para, sym)
		A = text.scrollToText(A⁰, 0)
		para = A⁰, sym = A¹
		updateTargetX()
	} ⥹ (arg ≟ 'end') {
		∇ A = text.textToScroll(para, sym)
		A = text.scrollToText(A⁰, ⚫w+1)
		para = A⁰, sym = A¹
		updateTargetX()
		
	} ⥹ (arg ≟ 'pageup') {
		∇ A = text.textToScroll(para, sym)
		A⁰ -= h 
		⌥ (A⁰ < 0) A⁰ ⊜
		A = text.scrollToText(A⁰, targetX)
		⌥ (A) para = A⁰, sym = A¹//, delta -= h
	} ⥹ (arg ≟ 'pagedown') {
		∇ A = text.textToScroll(para, sym)
		A⁰ += h 
		∇ H = text.getHeight()
		⌥ (A⁰ > H - 1) A⁰ = H - 1
		A = text.scrollToText(A⁰, targetX)
		⌥ (A) para = A⁰, sym = A¹//, delta += h - 1
	} ⥹ (arg ≟ 'wordleft') {
		∇ A = text.textToScroll(para, sym)
		⌥ (A¹ ≟ 0) $ moveCursor('left')
		∇ line = text.L[para]
		∇ xpos = wordLeft(line, sym)
		A = text.textToScroll(para, xpos)
		targetX = A¹
		sym = xpos
	} ⥹ (arg ≟ 'wordright') {
		∇ A = text.textToScroll(para, sym)
		∇ q = text.getLines(A⁰)⁰ ↥
		⌥ (A¹ ≟ q) $ moveCursor('right')
		∇ line = text.L[para]
		∇ xpos = wordRight(line, sym)
		A = text.textToScroll(para, xpos)
		targetX = A¹
		sym = xpos
	} ⥹ (arg ≟ 'top') {
		para ⊜
		newX()
	} ⥹ (arg ≟ 'bottom') {
		para = text.L ↥ - 1
		newX()
	}
}}

TEdit.can.scrollToView = ➮ { ☛ (⚪) {
	∇ H = text.getHeight()
	∇ A = text.textToScroll(para, sym)
	⌥ (delta ≟ A⁰ + 1) delta = A⁰
	⌥ (delta ≟ A⁰ - h) delta++
	⧖ (A⁰ < delta) {
		delta -= h
		⌥ (delta < 0) @
	}
	⧖ (A⁰ > delta + h - 1) {
		delta += h
		⌥ (delta > H - h + 3) { delta = H - h + 3 ⦙ @ }
	}
	⌥ (delta > H - h + 3) delta = H - h +3
	⌥ (delta < 0) delta ⊜
}}

TEdit.can.shiftSel = ➮(arg) {
	⌥ (arg ≟ 'all') {
		⚫sel.start(0, 0)
		∇ q = ⚫text.L ↥ - 1
		⚫sel.end(q, ⚫text.Lʱ ↥)
		$ ⦿
	}
	⌥ (⚫sel.clean()) ⚫sel.start(⚫para, ⚫sym)
	⚫moveCursor(arg)
	⚫sel.end(⚫para, ⚫sym)
	⚫scrollToView()
	⚫getDesktop().display.caretReset()
	$ ⦿
}

TEdit.can.handleCursorKey = ➮(arg) { ☛ (⚪) {
	∇ H = ⚫text.getHeight(), clearOnly = ⦾
	⌥ (!sel.clean()) {
		∇ A = sel.get()
		⌥ (arg ≟ 'left') clearOnly = ⦿, para = A.a.y, sym = A.a.x
		⌥ (arg ≟ 'right') clearOnly = ⦿, para = A.b.y, sym = A.b.x
		sel.clear()
	}
	⌥ (!clearOnly) moveCursor(arg, H)
	scrollToView()
	getDesktop().display.caretReset()
	$ ⦿
}}


TEdit.can.commandLineBack = ➮{ ☛ (⚪) {
	sel.clear()
	moveCursor('home')
	∇ s = lineClipboard.pop()
	⌥ (lineClipboard ↥ ≟ 0) lineClipboard ⬊(s)
	insertText(s)
	moveCursor('up')
}}

TEdit.can.commandLineDelete = ➮{ ☛ (⚪) {
	∇ H = text.getHeight()
	∇ A = text.textToScroll(para, sym), B = [A⁰ + 1, 0]
	A¹ ⊜
	⌥ (A⁰ ≟ H - 1) {
		∇ line = text.getLines(A⁰, 1)⁰
		B⁰ = A⁰
		B¹ = line ↥
	}
	A = text.scrollToText(A⁰, A¹)
	B = text.scrollToText(B⁰, B¹)
	sel.start(A⁰, A¹)
	sel.end(B⁰, B¹)
	⚫lineClipboard ⬊(text.getSelText(sel))
	⌥ (lineClipboard ↥ > 20) lineClipboard.shift()

	sym = A¹
	text.deleteText(sel)
	sel.clear()
	scrollToView()
	getDesktop().display.caretReset()
	$ ⦿
}}

TEdit.can.deleteSelected = ➮ {
	∇ A = ⚫sel.get()
	⌥ (A) A = A.a ⦙ ⎇ $
	⚫text.deleteText(⚫sel)
	⚫sel.clear()
	⚫para = A.y
	⚫sym = A.x
	⚫updateTargetX()
}

TEdit.can.commandDelete = ➮ {
	⌥ (⚫sel.clean()) {
		⚫sel.start(⚫para, ⚫sym)
		⚫moveCursor('right')
		⚫sel.end(⚫para, ⚫sym)
		⌥ (⚫sel.clean()) $ ⦿
	}
	⚫deleteSelected()
	⚫scrollToView()
	⚫getDesktop().display.caretReset()
	$ ⦿
}

TEdit.can.deleteTo = ➮(arg) {
	⌥ (⚫sel.clean()) {
		⚫sel.start(⚫para, ⚫sym)
		⌥ (arg ≟ 'wordright') {
			∇ i ⊜, s = '', spaceCount, prevLength ⊜, startType
			∞ {
				⚫moveCursor('right')
				⚫sel.end(⚫para, ⚫sym)
				s = ⚫text.getSelText(⚫sel)
				⌥ (prevLength ≟ s ↥) @
				⌥ (s ↥ ≟ 1) startType = ⚫text.lexer.charType(s⁰)
				⎇ {
					⌥ (⚫text.lexer.charType(s[s ↥ - 1]) ≠ startType) {
						⚫moveCursor('left')
						⚫sel.end(⚫para, ⚫sym)
						s = ⚫text.getSelText(⚫sel)
						@
					}
				}
				prevLength = s ↥
			}
			⌥ (s≀('\n') >= 0) {
				$ ⚫insertText(' ')
			}
		} ⎇ {
			⚫moveCursor(arg)
			⚫sel.end(⚫para, ⚫sym)
		}
		⌥ (⚫sel.clean()) $ ⦿
	}
	s = ⚫text.getSelText(⚫sel)
	⚫deleteSelected()
	⚫scrollToView()
	⚫getDesktop().display.caretReset()
	$ ⦿
}

TEdit.can.commandDeleteBack = ➮{
	$ ⚫deleteTo('left')
}

TEdit.can.commandDeleteWord = ➮{
	$ ⚫deleteTo('wordright')
}

TEdit.can.commandDeleteWordBack = ➮{
	$ ⚫deleteTo('wordleft')
}

TEdit.can.lineScroll = ➮(arg) {
	⌥ (⚫multiLine ≠ ⦿) $ ⦾
	∇ H = ⚫text.getHeight(), me = ⚪
	∇ oldDelta = me.delta
	me.delta += arg
	⌥ (me.delta > H - me.h + 3) me.delta = H - me.h + 3
	⌥ (me.delta < 0) me.delta ⊜
	⌥ (me.delta ≠ oldDelta) {
		⌥ (arg < 0) ⚫moveCursor('up') ⦙ ⎇ ⚫moveCursor('down')
	}
	⚫getDesktop().display.caretReset()
	$ ⦿
}

TEdit.can.onKey = ➮(hand) {
	⌥ (hand.key ≟ keycode.LEFT_CONTROL) {
		⚫curLineHilite = hand.down
		⚫repaint()
	}
	∇ R = dnaof(⚪, hand)
	⌥ (!R && hand.char ≠ ∅ && hand.key ≠ keycode.ESCAPE) {
		⌥ (hand.mod.control ≟ ⦾ && hand.mod.alt ≟ ⦾) {
			⌥ (!⚫sel.clean()) ⚫deleteSelected()
			∇ A = ⚫text.insertTextAt(hand.char, ⚫para, ⚫sym)
			⚫para = A.para, ⚫sym = A.sym
			⚫updateTargetX()
			⚫scrollToView()
			⚫getDesktop().display.caretReset()
			$ ⦿
		}
	}
	$ R
}

TEdit.can.commandEnter = ➮ {
	∇ i ⊜, s = ⚫text.L[⚫para], t = ''
	∇ n = ⚫sym
	⧖ (n < s ↥ && (sⁿ ≟ ' ' || sⁿ ≟ '\t')) n++
	n -= ⚫sym
	i += n
	⧖ (i < s ↥ && sⁱ ≟ '\t' || sⁱ ≟ ' ') t += s[i++]
	$ ⚫insertText('\n' + t)
}

TEdit.can.insertText = ➮ (txt) {
	⌥ (⚫multiLine ≟ ⦾ && txt≀('\n') >= 0) $ ⦿
	⌥ (!⚫sel.clean()) ⚫deleteSelected()
	∇ A = ⚫text.insertTextAt(txt, ⚫para, ⚫sym)
	⚫para = A.para, ⚫sym = A.sym
	⚫updateTargetX()
	⚫scrollToView()
	⚫repaint()
	⚫getDesktop().display.caretReset()
	$ ⦿
}

TEdit.can.userCopy = ➮{
	∇ s = ⚫text.getSelText(⚫sel)
	⌥ (s ↥ > 0) clipboardSet(s)
	$ ⦿
}

TEdit.can.userPaste = ➮{
	∇ me = ⚪
	➮ onPaste text { 
		⌥ (me.multiLine ≟ ⦾) {
			text = text⌶('\n')⫴(' ')
		}
		me.insertText(text)
	}
	clipboardGet(onPaste)
	$ ⦿
}

TEdit.can.userCut = ➮{
	clipboardSet(⚫text.getSelText(⚫sel))
	⚫deleteSelected()
	⚫scrollToView()
	⚫getDesktop().display.caretReset()
	$ ⦿
}

TEdit.can.dragScroll = ➮(arg, hand) {
	⌥ (arg ≟ 'start') {
		∇ G = ⚫getGlobal()
		⚫drawScrollActive = { d: ⚫delta, y: hand.Y + hand.h * G.y, H: ⚫text.getHeight() }
		⚫getDesktop().display.setCursor(2)
	} ⥹ (arg ≟ 'end') {
		⏀ ⚫drawScrollActive
		⚫getDesktop().display.setCursor(1)
	} ⎇ {
		∇ S = ⚫drawScrollActive
		∇ D = S.d + (S.y - hand.Y)
		⌥ (D < 0) {
			D ⊜
		}
		⌥ (D > S.H - ⚫h + 3) {
			D = S.H - ⚫h + 3
			// каааак это сделать та?
		}
		⌥ (D ≠ 	⚫delta) {
			⚫delta = D
			$ ⦿
		}
	}
}

TEdit.can.onCapture = ➮(hand) {
	⌥ (⚫drawScrollActive) {
		⌥ (hand.button ≟ 1 && hand.down ≟ ⦾) {
			⚫dragScroll('end', hand)
			⏀ ⚫getDesktop().mouseCapture
			$ ⦿
		}
		$ ⚫dragScroll('move', hand)
	}
}

➮ extendSelWord sel {
	sel.a.x = wordLeft(⚫L[sel.a.y], sel.a.x)
	sel.b.x = wordRight(⚫L[sel.b.y], sel.b.x)
	$ sel
}

TEdit.can.mouseSelect = ➮(hand, noGlobal) {
	⌥ (noGlobal ≠ ⦿) {
		∇ G = ⚫getGlobal()
		hand.x -= G.x, hand.y -= G.y
	}
	⌥ (hand.button ≟ 10) {
		⚫sel.clear()
		⚫sel.start(⚫para, ⚫sym, extendSelWord.bind(⚫text))
		⚫sel.end(⚫para, ⚫sym)
//		var ax = wordLeft(this.text.L[this.para], this.sym)
		∇ bx = wordRight(⚫text.L[⚫para], ⚫sym)
		⚫sym = bx
		⚫mouseSelecting = ⦿
		$ ⦿
	}
	⌥ (hand.button ≠ ∅) {
		//if ((hand.X % hand.w) - (hand.w>>1) > 0) hand.x++
		∇ A = ⚫text.scrollToText(⚫delta + hand.y, hand.x)
		⌥ (hand.down) {
			⌥ (A) ⚫para = A⁰, ⚫sym = A¹, ⚫targetX = hand.x
			⎇ ⚫moveCursor('bottom')
			⚫sel.clear()
			⚫sel.start(⚫para, ⚫sym)
			⚫mouseSelecting = ⦿
		} ⎇ {
			⌥ (⚫scrollTimer) ⌿⌚(⚫scrollTimer)
			⌥ (⚫mouseSelecting ≟ ⦿) ⚫mouseSelecting = ⦾
			⏀ ⚫getDesktop().mouseCapture
		}
		⚫getDesktop().display.caretReset()
		$ ⦿
	} ⎇ {
		⌥ (⚫mouseSelecting ≟ ⦿) {
			⌥ (⚫cacheMouse && ⚫cacheMouse.x ≟ hand.x && ⚫cacheMouse.y ≟ hand.y) $
			⚫cacheMouse = { x: hand.x, y: hand.y }

			∇ overScroll ⊜, me= ⚪
			⌥ (hand.y < 0) overScroll = -1
			⥹ (hand.y >= ⚫h) overScroll = 1
			∇ Y = hand.y, X = hand.x
			⌥ (overScroll ≟-1) Y ⊜
			⌥ (overScroll ≟ 1) Y = me.h - 1
			
			⌥ (overScroll ≟ 0) {
				⌿⌚(⚫scrollTimer), ⚫scrollTimer = ∅
			}
			⎇ { // Timer induced scrolling
				me.lineScroll(overScroll)
				⌥ (⚫scrollTimer) ⌿⌚(⚫scrollTimer)
				⚫scrollTimer = ⌚(➮{
					me.lineScroll(overScroll)
					∇ A = me.text.scrollToText(me.delta + Y, X)
					⌥ (A) me.para = A⁰, me.sym = A¹, me.targetX = X
					me.sel.end(me.para, me.sym)
					me.repaint()
				}, 50)
			}
			
			∇ A = ⚫text.scrollToText(⚫delta + Y, X)
			⌥ (A) ⚫para = A⁰, ⚫sym = A¹, ⚫targetX = X
			⚫sel.end(⚫para, ⚫sym)
				
			$ ⦿
		}
	}
}

TEdit.can.onCursor = ➮(hand) {
//	if ((hand.X % hand.w) - (hand.w>>1) > 0) hand.x++
	⚫getDesktop().display.setCursor(1)
}

TEdit.can.onMouse = ➮(hand) {
//	if ((hand.X % hand.w) - (hand.w>>1) > 0) hand.x++
	⌥ (hand.button ≟ 0) {
		⌥ (hand.down) {
			⚫getDesktop().mouseCapture = ⚫mouseSelect.bind(⚪)
			⚫mouseSelect(hand, ⦿)
		}
	}
	
	⥹ (hand.button ≟ 1) {
		⌥ (hand.down && ⚫multiLine ≟ ⦿) {
			⚫getDesktop().mouseCapture = ⚫onCapture.bind(⚪)
			$ ⚫dragScroll('start', hand)
		}
	}
	
	⥹ (hand.button ≟ 3 && ⚫multiLine ≟ ⦿) { 
		∇ H = ⚫text.getHeight(), me = ⚪
		⚫wheelSpeed = 3
		⧗ (∇ i ⊜ ⦙ i < ⚫wheelSpeed ⦙ i++) ⌛(➮{
			⌥ (hand.down) me.delta ++ ⦙ ⎇ me.delta -- ⦙
			⌥ (me.delta > H - me.h + 3) me.delta = H - me.h + 3
			⌥ (me.delta < 0) me.delta ⊜
			⌥ (me.mouseSelecting ≟ ⦿) me.onCursor(hand)
			me.getDesktop().display.forceRepaint()
		}, i * 100)
	}
	// TODO: dabl klik selekt
	$ ⦿
}

TEdit.can.commandUndo = ➮(arg) {
	⚫sel.clear()
	⌥ (arg ≟ 'undo') ∇ A = ⚫text.undo() ⦙ ⎇ A = ⚫text.redo()
	⌥ (A) {
		⚫para = A⁰
		⚫sym = A¹
		⚫updateTargetX()
		⚫scrollToView()
		⚫getDesktop().display.caretReset()
		$ ⦿
	}
}

TEdit.can.track = ➮{
	$ { size: ⚫text.getHeight() - ⚫h + 3, position: ⚫delta }
}

TEdit.can.indentWith = ➮(sub) {
	∇ S = ⚫sel.get(), Y = S.b.y
	⚫text.undoBegin()
	⌥ (S.b.x ≟ 0) Y--
	⧗ (∇ y = S.a.y ⦙ y <= Y ⦙ y++) {
		⚫text.insertTextAt(sub, y, 0)
	}
	∇ mova ⊜, movb ⊜
	⌥ (S.a.x > 0) mova = sub ↥
	⌥ (S.b.x > 0) movb = sub ↥
	⚫sel.start(S.a.y, S.a.x + mova)
	⚫sel.end(S.b.y, S.b.x + movb)
	⚫text.undoEnd()
}

TEdit.can.unindentWith = ➮(sub) {
	∇ a, b
	⌥ (⚫sel.clean()) {
		a = ⚫para, b = a
	} ⎇ {
		∇ S = ⚫sel.get()
		a = S.a.y, b = S.b.y
		⌥ (S.b.x ≟ 0) b--
	}
	∇ L = ⚫text.L
	⚫text.undoBegin()
	∇ T = TSelection.create(), mova ⊜, movb ⊜
	⧗ (∇ y = a ⦙ y <= b ⦙ y++) {
		⌥ (Lʸ⩪(0, sub ↥) ≟ sub) {
			⌥ (y ≟ a) mova = sub ↥
			⌥ (y ≟ b) movb = sub ↥
			T.start(y, 0), T.end(y, sub ↥)
			⚫text.deleteText(T)
		}
	}
	⚫text.undoEnd()
	⌥ (S) {
		⌥ (S.a.x < mova) mova ⊜
		⌥ (S.b.x < movb) movb ⊜
		⚫sel.start(S.a.y, S.a.x - mova)
		⚫sel.end(S.b.y, S.b.x - movb)
	}
}

TEdit.can.commandComment = ➮(arg) {
	//TODO: сделать '//' переменной настроек
	∇ REM = ⚫text.lexer.lineComment
	⌥ (arg ≟ 'comment') {
		⌥ (⚫sel.clean()) {
			∇ last = ⚫text.L ↥ - 1
			⌥ (⚫para ≠ last || ⚫text.L[last]⩪(0, 2) ≠ REM)
			⚫text.insertTextAt(REM, ⚫para, 0)
			⌥ (⚫para ≠ last) ⚫moveCursor('down')
		} ⎇
			⚫indentWith(REM)
	}
	⌥ (arg ≟ 'uncomment') ⚫unindentWith(REM)
	⚫getDesktop().display.caretReset()
	$ ⦿
}

TEdit.can.convertSpacesToTab = ➮{
	⌥ (⚫sel.clean()) $
	∇ S = ⚫sel.get()
	∇ a = S.a.y, b = S.b.y
	⌥ (S.b.x ≟ 0) b--
	∇ steps = {}
	⧗ (∇ y = a ⦙ y <= b ⦙ y++) {
		∇ s = ⚫text.Lʸ.replace('\t', '   ')
		∇ spaces ⊜
		i ⬌ s ⌥ (sⁱ ≟ ' ') spaces++ ⦙ ⎇ @
		steps[spaces] = ⦿
	}
	∇ sorted = Object.keys(steps)❄(➮(a,b){$ a-b})
	i ⬌ sorted steps[sortedⁱ] = i
	
	⚫text.undoBegin()
	⧗ (∇ y = a ⦙ y <= b ⦙ y++) ⚫text.changeLine(y, ➮(s) {
		s = s.replace('\t', '   ')
		∇ spaces ⊜
		i ⬌ s ⌥ (sⁱ ≟ ' ') spaces++ ⦙ ⎇ @
		s = s⩪(spaces, s ↥)
		⧗ (∇ i ⊜ ⦙ i < steps[spaces] ⦙ i++) s = '\t'+s
		ロs
		$ s
	})
	⚫text.undoEnd()
}

TEdit.can.tabCompletion = ➮{
	⌥ (!⚫sel.clean()) $
	∇ a = ⚫para, b = ⚫sym
	∇ s = ⚫text.Lᵃ, t = ''
	⧖ (--b >= 0) {
		∇ c = sᵇ, 
			ok = (c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') 
			|| (c >= 'A' && c <= 'Z') || c ≟ '.'
		⌥ (ok) t = c + t ⦙ ⎇ @
		⌥ (c ≟ '.') @
	}
	⌥ (t ≟ '') $
//	var cfg = require('path').dirname(require.main.filename) 
//		+ '/tabsnippets.js'

	∇ cfg = expandPath('~/.deodar/tabsnippets.js')
	⌥ (fs.existsSync(cfg) ≟ ⦾) $ ⦾

	cfg = ≣(cfg)
	ok = cfgᵗ
	⌥ (!ok && t⁰ ≟ '.') {
		t = t⩪(1)
	}
	⌥ (cfgᵗ) {
		∇ snip = cfgᵗ
		T = TSelection.create()
		T.start(⚫para, ⚫sym)
		T.end(⚫para, ⚫sym - t ↥)
		⚫text.deleteText(T)
		⚫text.insertTextAt(snip, ⚫para, ⚫sym - t ↥)
		⚫sym = ⚫sym - t ↥ + snip ↥
		$ ⦿
	}
}

TEdit.can.commandTab = ➮(arg) {
	⌥ (⚫tabCompletion()) $ ⦿
	⌥ (arg ≟ 'convert') {
		ロ'spaceToTab conversion'
		⚫convertSpacesToTab()
	}
	⌥ (arg ≟ 'indent') {
		⌥ (⚫sel.clean()) {
			⚫insertText('\t')
			$ ⦿
		}
		⚫indentWith('\t')
	}
	⌥ (arg ≟ 'unindent') ⚫unindentWith('\t')
	⚫getDesktop().display.caretReset()
	$ ⦿
}

TEdit.can.getText = ➮ {
	$ ⚫text.getText()
}

TEdit.can.setText = ➮(s) {
	⚫text.setText(s)
	⚫sel.clear()
	⚫para ⊜
	⚫sym ⊜
	⌥ (⚫text.L ↥ ≟ 1) {
		⚫shiftSel('all')
		⚫sym = s ↥
	} ⎇ {
		⚫moveCursor('bottom')//will it work in TEdit.create(text)?
		⚫moveCursor('end')
	}
}

TEdit.can.commandGoToLine = ➮{
	∇ me = ⚪
	∇ win = TInputBox.create(45, 'Переход', 'Номер строки', ➮(text) {
		me.para = ★(text - 1)
		⌥ (me.para > me.text.L ↥ - 1) me.para = me.text.L ↥ - 1
		me.sym ⊜
		me.scrollToView()
	})
	⚫getDesktop().showModal(win)
	$ ⦿
}

TEdit.can.commandFindPrev = ➮{
	∇ me = ⚪
	∇ t = me.text.L, c = t ↥, match
	⧗ (∇ p = me.para - 1 ⦙ p >= 0 ⦙ p--) {
		∇ sym = tᵖ≀(me.textToFind)
		⌥ (sym >= 0) {
			match = { para:p, sym: sym }
			@
		}
	}
	⌥ (match ≟ ∅) ⧗ (∇ p = c - 1 ⦙ p >= me.para ⦙ p--) {
		∇ sym = tᵖ≀(me.textToFind)
		⌥ (sym >= 0) {
			match = { para:p, sym: sym }
			@
		}
	}
	⌥ (match) {
		me.para = match.para, me.sym = match.sym
		me.sel.start(me.para, me.sym)
		me.sel.end(me.para, me.sym + me.textToFind ↥)
		me.scrollToView()
		⚫getDesktop().display.caretReset()
	}
	$ ⦿
}

TEdit.can.commandFind = ➮{
ロ'comand Find'
	∇ me = ⚪, query = ''
	∇ win = TInputBox.create(45, 'Поиск', 'Искомое', ➮(text) {
		⌥ (handyContext ≟ ∅) handyContext = {}
		handyContext.lastSearchQuery = text
		me.textToFind = text
		me.replace = ∅
		me.commandFindNext()
	})
	win.ok.title = 'Искать'
	⌥ (⚫sel.clean() ≠ ⦿) { 
		ロ'query from selection'
		query = ⚫text.getSelText(⚫sel)
	}
	⥹ (handyContext && handyContext.lastSearchQuery) {
		ロ'query from handy context'
		query = handyContext.lastSearchQuery
	} ⥹ (me.textToFind) { 
		query = me.textToFind 
		ロ'query from textToFind'
	}
	win.input.setText(query)
	⚫getDesktop().showModal(win)
	$ ⦿
}


TEdit.can.commandFindNext = ➮(next) {
//TODO: F3 in edit box = enter
	∇ me = ⚪
	⌥ (me.textToFind ≟ ∅) $ ⦿
	⌥ (next && me.replace ≠ ∅) {
		∇ cur = me.text.getSelText(me.sel)
		⌥ (cur ≟ me.textToFind) {
			me.text.deleteText(me.sel)
			∇ S = me.sel.get()
			me.sel.clear()
			me.text.insertTextAt(me.replace, S.a.y, S.a.x)
		}
	}
	∇ t = me.text.L, c = t ↥, match, S = me.sel.get()
	⌥ (S) { me.sym = S.b.x }
	∇ sym = t[me.para]≀(me.textToFind, me.sym)
	⌥ (sym >= 0) match = { para:me.para, sym: sym }
	⌥ (match ≟ ∅) ⧗ (∇ p = me.para + 1 ⦙ p < c ⦙ p++) {
		∇ sym = tᵖ≀(me.textToFind)
		⌥ (sym >= 0) {
			match = { para:p, sym: sym }
			@
		}
	}
	⌥ (match ≟ ∅) ⧗ (∇ p ⊜ ⦙ p <= me.para ⦙ p++) {
		∇ sym = tᵖ≀(me.textToFind)
		⌥ (sym >= 0) {
			match = { para:p, sym: sym }
			@
		}
	}
	⌥ (match) {
		me.para = match.para, me.sym = match.sym
		me.sel.start(me.para, me.sym)
		me.sel.end(me.para, me.sym + me.textToFind ↥)
		me.scrollToView()
		⚫getDesktop().display.caretReset()
	}
	$ ⦿
}

TEdit.can.commandReplace = ➮{
	∇ me = ⚪, query = ''
	∇ win = TReplaceBox.create(45, 'Замена', 'Искать', 'Заменить на',
	➮(find, repl) {
		⌥ (handyContext ≟ ∅) handyContext = {}
		handyContext.lastSearchQuery = find
		handyContext.lastReplaceString = repl
		//TODO: move me.textToFind/me.replace to handyContext
		me.replace = repl
		me.textToFind = find
		me.commandFindNext()
	})
	win.ok.title = 'Искать(F3)'
	⌥ (⚫sel.clean() ≠ ⦿) { 
		query = ⚫text.getSelText(⚫sel)
	}
	⥹ (handyContext && handyContext.lastSearchQuery) {
		query = handyContext.lastSearchQuery
		me.replace = handyContext.lastReplaceString
	} ⥹ (me.textToFind) { query = me.textToFind }
	win.search.setText(query)
	⌥ (me.replace) win.replace.setText(me.replace)
	⚫getDesktop().showModal(win)
	$ ⦿
}
