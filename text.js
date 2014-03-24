TSelection = kindof(TObject)
TSelection.can.init = function() {
	var data = undefined
	this._data = data// for debug
	function sort() { with (data) {
		if ((a.y > b.y) || (a.y == b.y && a.x > b.x))
			s = { a: { x: data.b.x, y: data.b.y}, b: {x: data.a.x, y: data.a.y} }
		else s = { b: { x: data.b.x, y: data.b.y}, a: {x: data.a.x, y: data.a.y} }
		return s
	}}
	this.get = function() {
		if (this.clean()) return undefined
		if (this.ender) {
			var ext = this.ender(sort())
			if (ext.a.x == ext.b.x && ext.a.y == ext.b.y) return
			return ext
		}
		return sort()
	}
	this.clear = function() {
		data = undefined
	}
	this.clean = function() {
		if (data == undefined || data.b == undefined) return true
		if (this.ender) {
			var ext = this.ender(sort())
			return (ext.a.x == ext.b.x && ext.a.y == ext.b.y)
		}
		if (data.a.x == data.b.x && data.a.y == data.b.y) return true
		return false
	}
	this.start = function(y, x, ender) {
		this.ender = ender
		data = { a: { x:x, y:y }}
		this._data = data
	}
	this.end = function(y, x) {
		if (data == undefined) return
		data.b = { x:x, y:y }
	}
}

insertString = function(str, sub, at) {
	return str.substr(0, at) + sub + str.substr(at, str.length - at)
}

deleteString = function(str, from, to) {
	return str.substr(0, from) + str.substr(to, str.length)
}

function charType(ch) {
	var type = 0
//	if ((' \t').indexOf(ch) >= 0) type = 1
	if ((' \t`~!@#$%^&*()_-+={[}]|\"\':;?/>.<,').indexOf(ch) >= 0) type = 2
	if (('0123456789').indexOf(ch) >= 0) type = 3
	return type
}

wordLeft = function(s, X) {
	var x = X - 1, type = charType(s[x])
	if (x == 0) return 0
	x--
	while (true) {
		if (x <= 0) {
			if (type == 0 && charType(s[0]) != 0) return 1
			return 0
		}
		var t = charType(s[x])
		if (t != type) {
			//if (X - x < 4) { type = charType(s[--x]); continue }
			return x + 1
		}
		x--
	}
	return x
}

wordRight = function(s, X) {
	var x = X, type = charType(s[x])
	x++
	while (true) {
		if (x >= s.length) return s.length
		 var t = charType(s[x])
		 if (t != type) {
			//if (x - X < 3) { type = charType(s[++x]); continue }
			return x
		}
		x++
	}
	return x
}
var idCharHash = {}
var idChars = 'qazwsxedcrfvtgbyhnujmikolpQAZWSXEDCRFVTG'
	+'BYHNUJMIKOLP1234567890йцукен'
	+'гшщзхъёфывапролджэячсмить'
	+'бюЁЙЦУКЕНГШЩЗХЪФЫВАПР'
	+'ОЛДЖЭЯЧСМИТЬБЮ';
for (var i = 0; i < idChars.length; i++) idCharHash[idChars[i]] = true

function idChar(char) {
	return idCharHash[char] == true
}

function breakPara(s, W, tab) { // str: '12345+abcdef+hello', width: 10, result: [ 6, 7, 5 ]
	var L = [], w = 0, n = 0
	for (var i = 0; i < s.length; i++) {
		if (w >= W) {
			var maxback = W / 2
			while (maxback-- > 0 && idChar(s[i - 1]) && idChar(s[i])) i--, n--
			L.push(n), w = 0, n = 0
		}
		if (s[i] == '\t') w += tab; else w++
		n++
	}
	L.push(w)
	return L
}

function zz(N,t) {
	var x = 0
	var L = breakPara(t, N, 3)
	for (var i = 0; i < L.length; i++) {
		var s = t.substr(x, L[i])
		while (s.length < N) s += ' '//'░'
		x += L[i]
		log('|'+s.replace(/\t/g, '░')+'|')
	}
}

getParts = function(s, C, L) {
	var R ={ s: [], c: [], w:[] }, x = 0
	for (var i = 0; i < L.length; i++) {
		var t = s.substr(x, L[i])
		x += L[i]
		R.s.push(t)
		R.c.push(C.splice(0, L[i]))
	}
	return R
}

getWidths = function(s, tab) {
	var W = [], q = 0
	for (var r = 0; r < s.length; r++) {
		var w = 1
		if (s[r] == '\t') w = tab
		W.push(q)
		q += w
	}
	W.push(q) // end line marker
	return W
}

TText = kindof(TObject)
TText.can.init = function() {
	dnaof(this)
	this.L = ['']//'\tabc', '123']
	this.w = 0, this.h = 0
	this.tab = 3
	this.undoClear()
	this.modified = false
	this.colored = true
}

TText.can.size =function(w, h) {
	this.w = w, this.h = h
}

TText.can.getHeight = function() {
	var h = 0
	for (var i = 0; i < this.L.length; i++) {
		var P = breakPara(this.L[i], this.w, this.tab)
		h += P.length
	}
	return h
}

TText.can.getLines = function(y, count) {
	var h = 0, R = []
	for (var i = 0; i < this.L.length; i++) {
		var s = this.L[i]
		var B = breakPara(s, this.w, this.tab)
		if (h + B.length > y) {
			var C = []
			if (this.colored == true) C = colorizeString(s)
			var P = getParts(s, C, B)
		}
		var x = 0
		for (var b = 0; b < B.length; b++) {
			if (h >= y) {
				var W = getWidths(P.s[b], this.tab)
				R.push({ para:i, part: b, s: P.s[b], c: P.c[b], w: W, p: P, 
					l: this.L[i] , length: B[b], last: b == B.length - 1, startSym: x })
				if (R.length == count) return R
			}
			if (C) x += P.s[b].length
			h++
		}
	}
	return R
}

TText.can.scrollToText = function(lineNum, position) { // line:column -> para:pos
	var line = this.getLines(lineNum, 1)[0]
	if (line == undefined) return
	var X = 0
	for (var i = 0; i < line.s.length; i++) {
		if (line.w[i] >= position) return [line.para, line.startSym + i]
	}
	X = line.startSym + i - 1
	if (line.last) X++
	return [line.para, X]
}

TText.can.textToScroll = function(para, pos) {
	var galley = this.L, y = 0
	if (para >= galley.length) return
	for (var l = 0; l < para; l++) {
		var P = breakPara(galley[l], this.w, this.tab)
		y += P.length
	}	
	var P = breakPara(galley[para], this.w, this.tab)
	var x = 0, p = 0
	while (true) {
		if (x + P[p] > pos) break
		if (p == P.length - 1) break
		y++, x += P[p++]
	}
	var line = this.getLines(y, 1)[0]
	return [y, line.w[pos - x]]
}

TText.can.deleteText = function (sel) {
	var A = sel.get()
	if (A == undefined) return
	this.modified = true
	var B = A.b
	A = A.a
	A = [A.y, A.x], B = [B.y, B.x]

	var L = this.undoList, continueTyping = false
	if (A[0] == B[0] && L.length > 0) {
		var U = L[L.length - 1]
		if (U.action == '=' && U.para == A[0]) continueTyping = true
	 }
	if (!continueTyping) this.undoNext()

	//if (!continueTyping) 
	this.undoAdd({
		action: '=', para: A[0], 
		text:  this.L[A[0]],
		before: [B[0], B[1]], after: [A[0], A[1]],
	})

	if (A[0] == B[0]) {
		this.L[A[0]] = deleteString(this.L[A[0]], A[1], B[1])
	} else {
		this.L[A[0]] = deleteString(this.L[A[0]], A[1], this.L[A[0]].length) + deleteString(this.L[B[0]], 0, B[1])
		this.undoAdd({
			action: '+', para: A[0] + 1, 
			items:  this.L.slice(A[0] + 1, B[0] + 1),
			before: [A[0], A[1]], after: [B[0], B[1]],
		})
		this.L.splice(A[0] + 1, B[0] - A[0])
	}
	return A
}

TText.can.insertTextAt = function(txt, para, sym) {
	this.modified = true
	var L = this.undoList, continueTyping = false
	if (txt.length == 1 && L.length > 0) {
		var U = L[L.length - 1]
		if (U.action == '=' && U.para == para) continueTyping = true
	 }
	if (!continueTyping) this.undoNext()
	var s = this.L[para], a = s.substr(0, sym), b = s.substr(sym, s.length - sym)
	var T = txt.split('\n')
	if (!continueTyping) this.undoAdd({
		action: '=', para: para, 
		text:  this.L[para],
		before: [para, sym], after: [para, sym + txt.length],
	}); else U.after = [para, sym + txt.length]
	if (T.length == 1) {
		this.L[para] = a + T + b
		return { para: para, sym: sym + txt.length}
	}
	var P = { para: para + T.length - 1, sym: T[T.length - 1].length}
	this.undoAdd({
		action: '-', para: para + 1, count: T.length - 1,
		before: [para, sym], after: [P.para, P.sym],
	})
	T[0] = a + T[0]
	T[T.length - 1] += b
	this.L.splice.apply(this.L, [para, 1].concat(T))
	return P
}

TText.can.getSelText = function(selection) {
	if (selection.clean()) return ''
	var sel = selection.get()
	var A = sel.a, B = sel.b, R = []
	for (var i = A.y; i <= B.y; i++) {
		var a = 0, b = this.L[i].length
		if (i == A.y) a = A.x
		if (i == B.y) b = B.x
		R.push(this.L[i].substr(a, b - a))
	}
	return R.join('\n')
}

TText.can.getText = function() {
	return this.L.join('\n')
}

TText.can.setText = function(s) {
	this.L = s.split('\n')
	this.undoClear()
}

TText.can.undoClear = function() {
	this.undoID = 0
	this.undoList = []
	this.redoList = []
}

TText.can.undoNext = function() {
	if (this.undoBatch == true) return
	this.undoID++
}

TText.can.undoBegin = function() {
	this.undoID++
	this.undoBatch = true
}

TText.can.undoEnd = function() {
	this.undoBatch = false
}

TText.can.undoAdd = function(U) {
	U.id = this.undoID
	this.undoList.push(U)
	this.redoList = []
}

TText.can.undo = function() {
	if (this.undoList.length == 1) this.modified = false
	return this.undoAction(this.redoList, this.undoList)
}

TText.can.redo = function() {
	this.modified = true
	return this.undoAction(this.undoList, this.redoList)
}

TText.can.undoAction = function(L, R) {
	var ret
	function swap() { var t = A.before; A.before = A.after; A.after = t}
	if (R.length == 0) return
	var id = R[R.length - 1].id
	while (R.length > 0 && R[R.length - 1].id == id) {
		var A = R.pop(), U
		if (A.action == '=') {
			var s = this.L[A.para]
			this.L[A.para] = A.text
			A.text = s
			L.push(A)
			ret = A.before
			swap()
		} else if (A.action == '-') {
			var D = this.L.splice(A.para, A.count)
			A.items = D
			A.action = '+'
			L.push(A)
			ret = A.before
		} else if (A.action == '+') {
			this.L.splice.apply(this.L, [A.para, 0].concat(A.items))
			A.count = A.items.length
			delete A.items
			A.action = '-'
			L.push(A)
			ret = A.after
		}
	}
	return ret
}
