//хранить маркеры в тексте и при каждом изменении просчитывать их новые значения

TSelection = kindof(TObject)
TSelection.can.init = ➮{
	∇ data = ∅
	⚫_data = data// for debug
	➮ sort { ☛ (data) {
		⌥ ((a.y > b.y) || (a.y ≟ b.y && a.x > b.x))
			s = { a: { x: data.b.x, y: data.b.y }, b: { x: data.a.x, y: data.a.y } }
		⎇ s = { b: { x: data.b.x, y: data.b.y }, a: { x: data.a.x, y: data.a.y } }
		$ s
	}}
	⚫get = ➮{
		⌥ (⚫clean()) $ ∅
		⌥ (⚫ender) {
			∇ ext = ⚫ender(sort())
			⌥ (ext.a.x ≟ ext.b.x && ext.a.y ≟ ext.b.y) $
			$ ext
		}
		$ sort()
	}
	⚫clear = ➮{
		data = ∅
	}
	⚫clean = ➮{
		⌥ (data ≟ ∅ || data.b ≟ ∅) $ ⦿
		⌥ (⚫ender) {
			∇ ext = ⚫ender(sort())
			$ (ext.a.x ≟ ext.b.x && ext.a.y ≟ ext.b.y)
		}
		⌥ (data.a.x ≟ data.b.x && data.a.y ≟ data.b.y) $ ⦿
		$ ⦾
	}
	⚫start = ➮(y, x, ender) {
		⚫ender = ender
		data = { a: { x:x, y:y }}
		⚫_data = data
	}
	⚫end = ➮(y, x) {
		⌥ (data ≟ ∅) $
		data.b = { x:x, y:y }
	}
}

insertString = ➮(str, sub, at) {
	$ str⩪(0, at) + sub + str⩪(at, str ↥ - at)
}

deleteString = ➮(str, from, to) {
	$ str⩪(0, from) + str⩪(to, str ↥)
}

➮ charType ch {
	∇ type ⊜
//	if ((' \t').indexOf(ch) >= 0) type = 1
	⌥ ((' \t`~!@#$%^&*()-+={[}]|\"\':;?/>.<,')≀(ch) >= 0) type = 2
	⌥ (('0123456789')≀(ch) >= 0) type = 3
	⌥ (ch.charCodeAt(0) > 0x1200) $ 4
	$ type
}

wordLeft = ➮(s, X) {
	∇ x = X - 1, type = charType(sˣ)
	⌥ (x ≟ 0) $ 0
	x--
	∞ {
		⌥ (x <= 0) {
			⌥ (type ≟ 0 && charType(s⁰) ≠ 0) $ 1
			$ 0
		}
		∇ t = charType(sˣ)
		⌥ (t ≠ type) {
			//if (X - x < 4) { type = charType(s[--x]); continue }
			$ x + 1
		}
		x--
	}
	$ x
}

wordRight = ➮(s, X) {
	∇ x = X, type = charType(sˣ)
	x++
	∞ {
		⌥ (x >= s ↥) $ s ↥
		 ∇ t = charType(sˣ)
		 ⌥ (t ≠ type) {
			//if (x - X < 3) { type = charType(s[++x]); continue }
			$ x
		}
		x++
	}
	$ x
}
∇ idCharHash = {}
∇ idChars = '_qazwsxedcrfvtgbyhnujmikolpQAZWSXEDCRFVTG'
	+'BYHNUJMIKOLP1234567890йцукен'
	+'гшщзхъёфывапролджэячсмить'
	+'бюЁЙЦУКЕНГШЩЗХЪФЫВАПР'
	+'ОЛДЖЭЯЧСМИТЬБЮ' ⦙
i ⬌ idChars idCharHash[idCharsⁱ] = ⦿

➮ idChar char {
	$ idCharHash[char] ≟ ⦿
}

➮ breakPara s W tab { // str: '12345+abcdef+hello', width: 10, result: [ 6, 7, 5 ]
	∇ L = [], w ⊜, n ⊜
	i ⬌ s {
		⌥ (w >= W) {
			∇ maxback = W / 2
			⧖ (maxback-- > 0 && idChar(s[i - 1]) && idChar(sⁱ)) i--, n--
			L ⬊(n), w ⊜, n ⊜
		}
		⌥ (sⁱ ≟ '\t') w += tab ⦙ ⎇ w++
		n++
	}
	L ⬊(w)
	$ L
}

➮ zz N t {
	∇ x ⊜
	∇ L = breakPara(t, N, 3)
	i ⬌ L {
		∇ s = t⩪(x, Lⁱ)
		⧖ (s ↥ < N) s += ' '//'░'
		x += Lⁱ
		log('|'+s.replace(/\t/g, '░')+'|')
	}
}

getParts = ➮(s, C, L) {
	∇ R ={ s: [], c: [], w:[] }, x ⊜
	i ⬌ L {
		∇ t = s⩪(x, Lⁱ)
		x += Lⁱ
		R.s ⬊(t)
		R.c ⬊(C⨄(0, Lⁱ))
	}
	$ R
}

getWidths = ➮(s, tab) {
	∇ W = [], q ⊜
	r ⬌ s {
		∇ w = 1
		⌥ (sʳ ≟ '\t') w = tab
		W ⬊(q)
		q += w
	}
	W ⬊(q) // end line marker
	$ W
}

TText = kindof(TObject)
TText.can.init = ➮{
	dnaof(⚪)
	⚫L = ['']//'\tabc', '123']
	⚫w ⊜, ⚫h ⊜
	⚫tab = 3
	⚫undoClear()
	⚫modified = ⦾
	⚫colored = ⦿
	⚫lexer = JSLexer
}

TText.can.size =➮(w, h) {
	⚫w = w, ⚫h = h
}

TText.can.getHeight = ➮{
	∇ h ⊜
	i ⬌ this.L {
		∇ P = breakPara(⚫Lⁱ, ⚫w, ⚫tab)
		h += P ↥
	}
	$ h
}

TText.can.getLines = ➮(y, count) {
	∇ h ⊜, R = []
	i ⬌ this.L {
		∇ s = ⚫Lⁱ
		∇ B = breakPara(s, ⚫w, ⚫tab)
		⌥ (h + B ↥ > y) {
			∇ C = []
			⌥ (⚫colored ≟ ⦿) C = ⚫lexer.colorizeString(s)
			∇ P = getParts(s, C, B)
		}
		∇ x ⊜
		b ⬌ B {
			⌥ (h >= y) {
				∇ W = getWidths(P.sᵇ, ⚫tab)
				R ⬊({ para:i, part: b, s: P.sᵇ, c: P.cᵇ, w: W, p: P, 
					l: ⚫Lⁱ , length: Bᵇ, last: b ≟ B ↥ - 1, startSym: x })
				⌥ (R ↥ ≟ count) $ R
			}
			⌥ (C) x += P.sᵇ ↥
			h++
		}
	}
	$ R
}

TText.can.scrollToText = ➮(lineNum, position) { // line:column -> para:pos
	∇ line = ⚫getLines(lineNum, 1)⁰
	⌥ (line ≟ ∅) $
	∇ X ⊜
	i ⬌ line.s {
		⌥ (line.wⁱ >= position) $ [line.para, line.startSym + i]
	}
	X = line.startSym + i - 1
	⌥ (line.last) X++
	$ [line.para, X]
}

TText.can.textToScroll = ➮(para, pos) {
	∇ galley = ⚫L, y ⊜
	⌥ (para >= galley ↥) $
	⧗ (∇ l ⊜ ⦙ l < para ⦙ l++) {
		∇ P = breakPara(galleyˡ, ⚫w, ⚫tab)
		y += P ↥
	}	
	∇ P = breakPara(galley[para], ⚫w, ⚫tab)
	∇ x ⊜, p ⊜
	∞ {
		⌥ (x + Pᵖ > pos) @
		⌥ (p ≟ P ↥ - 1) @
		y++, x += P[p++]
	}
	∇ line = ⚫getLines(y, 1)⁰
	$ [y, line.w[pos - x]]
}

TText.can.deleteText = ➮ (sel) {
	∇ A = sel.get()
	⌥ (A ≟ ∅) $
	⚫alertChange()
	⚫modified = ⦿
	∇ B = A.b
	A = A.a
	A = [A.y, A.x], B = [B.y, B.x]

	∇ L = ⚫undoList, continueTyping = ⦾
	⌥ (A⁰ ≟ B⁰ && L ↥ > 0) {
		∇ U = L[L ↥ - 1]
		⌥ (U.action ≟ '=' && U.para ≟ A⁰) continueTyping = ⦿
	 }
	⌥ (!continueTyping) ⚫undoNext()

	//if (!continueTyping) 
	⚫undoAdd({
		action: '=', para: A⁰, 
		text:  ⚫L[A⁰],
		before: [B⁰, B¹], after: [A⁰, A¹],
	})

	⌥ (A⁰ ≟ B⁰) {
		⚫L[A⁰] = deleteString(⚫L[A⁰], A¹, B¹)
	} ⎇ {
		⚫L[A⁰] = deleteString(⚫L[A⁰], A¹, ⚫L[A⁰] ↥) + deleteString(⚫L[B⁰], 0, B¹)
		⚫undoAdd({
			action: '+', para: A⁰ + 1, 
			items:  ⚫L⋃(A⁰ + 1, B⁰ + 1),
			before: [A⁰, A¹], after: [B⁰, B¹],
		})
		⚫L⨄(A⁰ + 1, B⁰ - A⁰)
	}
	$ A
}

TText.can.changeLine = ➮(y, f) {
	//this.undoBegin()
	⚫undoAdd({
		action: '=', para: y,
		text:  ⚫Lʸ,
		before: [y, 0], after: [y, 0],
	})
	⚫Lʸ = f(⚫Lʸ)
	//this.undoEnd()
}

TText.can.insertTextAt = ➮(txt, para, sym) {
	⚫modified = ⦿
	∇ L = ⚫undoList, continueTyping = ⦾
	⌥ (txt ↥ ≟ 1 && L ↥ > 0) {
		∇ U = L[L ↥ - 1]
		⌥ (U.action ≟ '=' && U.para ≟ para) continueTyping = ⦿
	 }
	⌥ (!continueTyping) ⚫undoNext()
	∇ s = ⚫L[para], a = s⩪(0, sym), b = s⩪(sym, s ↥ - sym)
	∇ T = txt⌶('\n')
	⌥ (!continueTyping) ⚫undoAdd({
		action: '=', para: para, 
		text:  ⚫L[para],
		before: [para, sym], after: [para, sym + txt ↥],
	}) ⦙ ⎇ U.after = [para, sym + txt ↥]
	⚫alertChange()
	⌥ (T ↥ ≟ 1) {
		⚫L[para] = a + T + b
		$ { para: para, sym: sym + txt ↥}
	}
	∇ P = { para: para + T ↥ - 1, sym: T[T ↥ - 1] ↥}
	⚫undoAdd({
		action: '-', para: para + 1, count: T ↥ - 1,
		before: [para, sym], after: [P.para, P.sym],
	})
	T⁰ = a + T⁰
	T[T ↥ - 1] += b
	⚫L⨄.apply(⚫L, [para, 1]ꗚ(T))
	$ P
}

TText.can.getSelText = ➮(selection) {
	⌥ (selection.clean()) $ ''
	∇ sel = selection.get()
	∇ A = sel.a, B = sel.b, R = []
	⧗ (∇ i = A.y ⦙ i <= B.y ⦙ i++) {
		∇ a ⊜, b = ⚫Lⁱ ↥
		⌥ (i ≟ A.y) a = A.x
		⌥ (i ≟ B.y) b = B.x
		R ⬊(⚫Lⁱ⩪(a, b - a))
	}
	$ R⫴('\n')
}

TText.can.getText = ➮{
	$ ⚫L⫴('\n')
}

TText.can.setText = ➮(s) {
	⌥ (s ≟ ∅) s = ''
	⚫L = s.replace(/\r/g, '')⌶('\n')
	⚫undoClear()
}

TText.can.undoClear = ➮{
	⚫undoID ⊜
	⚫undoList = []
	⚫redoList = []
}

TText.can.undoNext = ➮{
	⌥ (⚫undoBatch ≟ ⦿) $
	⚫undoID++
}

TText.can.undoBegin = ➮{
	⚫undoID++
	⚫undoBatch = ⦿
}

TText.can.undoEnd = ➮{
	⚫undoBatch = ⦾
}

TText.can.undoAdd = ➮(U) {
	U.id = ⚫undoID
	⚫undoList ⬊(U)
	⚫redoList = []
}

TText.can.undo = ➮{
	⌥ (⚫undoList ↥ ≟ 1) ⚫modified = ⦾
	$ ⚫undoAction(⚫redoList, ⚫undoList)
}

TText.can.redo = ➮{
	⚫modified = ⦿
	$ ⚫undoAction(⚫undoList, ⚫redoList)
}

TText.can.undoAction = ➮(L, R) {
	∇ ret
	➮ swap { ∇ t = A.before ⦙ A.before = A.after ⦙ A.after = t}
	⌥ (R ↥ ≟ 0) $
	∇ id = R[R ↥ - 1].id
	⧖ (R ↥ > 0 && R[R ↥ - 1].id ≟ id) {
		∇ A = R.pop(), U
		⌥ (A.action ≟ '=') {
			∇ s = ⚫L[A.para]
			⚫L[A.para] = A.text
			A.text = s
			L ⬊(A)
			ret = A.before
			swap()
		} ⥹ (A.action ≟ '-') {
			∇ D = ⚫L⨄(A.para, A.count)
			A.items = D
			A.action = '+'
			L ⬊(A)
			ret = A.before
		} ⥹ (A.action ≟ '+') {
			⚫L⨄.apply(⚫L, [A.para, 0]ꗚ(A.items))
			A.count = A.items ↥
			⏀ A.items
			A.action = '-'
			L ⬊(A)
			ret = A.after
		}
	}
	⚫alertChange()
	$ ret
}

TText.can.alertChange = ➮{
	⌥ (⚫onChange) {
		⌥ (⚫changeTimeout) ⌿⌛(⚫changeTimeout)
		⚫changeTimeout = ⌛(⚫onChange, 10)
	}
}
