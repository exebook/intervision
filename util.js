// 
ALIAS = [{pattern: /^ls\b/, replace: 'ls --color '}]
s = 'ls /'
alias = function(t) {
	for (var i = 0; i < ALIAS.length; i++) {
		t = t.replace(ALIAS[i].pattern, ALIAS[i].replace)
	}
	return t
}

HOME = process.env.HOME//glxwin.native_sh("env|grep ^HOME").split('\n')[0].split('=')[1]

function curdir() { return process.cwd() }//return glxwin.native_sh('pwd').split('\n')[0] }

expandPath = function(s) {
	if (s == '.') return curdir()
	s = s.replace(/^\.\//, curdir() + '/')
	return s.replace(/^~/, HOME)
}

compressFileName = function(s, w) {
	if (s.length <= w) return s
	s = s.substr(s.length - w, w)
	return s
}

pathCompress = function(s, w) {
	if (s.length <= w) return s
	var x = s.length, L = []
	s = s.split('/')
	for (var i = 0; i < s.length; i++) L.push(s[i].length)
	while (x > w) {
		var long = 0, lid = -1
		for (var i = 0; i < s.length; i++) if (L[i] >= long) long = L[i], lid = i
		L[lid]--, x--
	}
	for (var i = 0; i < s.length; i++) {
		var q = s[i].length != L[i]
		if (q) {
			s[i] = '~' + s[i].substr(s[i].length - L[i] + 1, w)
		}
	}
	return s.join('/')
}
//var s = 'abcdef'
//s = '~' + s.substr(s.length - 3 + 1, 6)
//log(s)
//
//process.exit()

readableSize = function(x, bytes) {
	var kb = ['',' Кб',' Мб',' Гб',' Тб']
	if (bytes != undefined) kb[0] = bytes
	while (kb.length > 0) {
		if (x < 100000) return Math.floor(x) + kb[0]
		x /= 1024; kb.shift()
	}
	return '???'
}

wrapString = function(s, w) {
	var x = 0, R = []
	while (true) {
		var t = s.substr(x, w)
		if (t.length > 0) R.push(t)
		x += w
		if (x > s.length) break
	}
	return R
}

wrapLines = function(L, w) {
	var R = []
	for (var i = 0; i < L.length; i++) {
		R = R.concat(wrapString(L[i], w))
	}
	return R
}

numDeclension = function(sklon, rod, num, word) {
	//1 файл 2 3 4 файла 5 6 7 8 9 10 файлов 21 файл
	//1 файле 2 3 4 5 файлах 21 файле
	if ((num % 10) == 1) return 'файле'
	return 'файлах'
}

dump = function(x, level) {
	if (level == undefined) level = ''
	var aname = '*'; if (x.parent != undefined) aname = x.parent.name
	var actor = ''; if (x.parent != undefined) if (x.parent.actor == x) actor = 'actor'
	log(level, x.name, x.x, x.y, x.w, x.h, x.visible()?'visible':'hidden', actor)
	if (x.items == undefined || x.name.indexOf('List') >= 0); else {
		if (x.items.length > 0) {
			log(level, '[')
			for (var i = 0; i < x.items.length; i++) {
				dump(x.items[i], level + '  ', x)
			}
			log(level, ']')
		}
	}
}

backtrace = function() {
	try { i.dont.exist += 0 } catch (e) {
		var S = e.stack.split('\n')
		//process.stdout.write(e.stack + '\n')
		log('--- backtrace ---')
		for (var i = 2; i < S.length; i++) {
			if (S[i].indexOf('deodar') < 0) continue
			log(S[i])
		}
		log('---    end   ---')
	}
}

blend = function(color, level, back) { // 0 - full color, 0xf - full back
	var R = (color & 0xf)
	var G = (color & 0xf0) >> 4
	var B = (color & 0xf00) >> 8
	var r = (back & 0xf)
	var g = (back & 0xf0) >> 4
	var b = (back & 0xf00) >> 8
	function lvl(B, A, level) {
		if (A < B) return Math.ceil(((B - A) / 16) * level) + A
		4,15,1
		return Math.ceil(A - ((A - B) / 16) * (15 - level))
	}
	R = lvl(R, r, level)
	G = lvl(G, g, level)
	B = lvl(B, b, level)
//	log(color.toString(16), back.toString(16), R, G, B)
	return Math.floor((R + (G << 4) + (B << 8)))
}
//console.log(blend(0x433, 0, 0xfff).toString(16))
//console.log(blend(0x433, 1, 0xfff).toString(16))
//console.log(blend(0x433, 2, 0xfff).toString(16))
//console.log(blend(0x433, 3, 0xfff).toString(16))
//console.log(blend(0x433, 4, 0xfff).toString(16))
//console.log(blend(0x433, 5, 0xfff).toString(16))
//console.log(blend(0x433, 6, 0xfff).toString(16))
//console.log(blend(0x433, 7, 0xfff).toString(16))
//console.log(blend(0x433, 8, 0xfff).toString(16))
//console.log(blend(0x433, 9, 0xfff).toString(16))
//console.log(blend(0x433, 10, 0xfff).toString(16))
//console.log(blend(0x433, 11, 0xfff).toString(16))
//console.log(blend(0x433, 12, 0xfff).toString(16))
//console.log(blend(0x433, 13, 0xfff).toString(16))
//console.log(blend(0x433, 14, 0xfff).toString(16))
//console.log(blend(0x433, 15, 0xfff).toString(16))

//function testZZ() {
////	for (var i = 4; i < 15; i++) {
//	var t = '12345+abcdef+hello'
//	t = ''
//	var R = breakPara(t, 10, 3)
//	log(t, 10, R)
//	var L = getParts(t, R, 10)
//	for (var i = 0; i < L.length; i++) {
//		console.log(L[i])
//	}

//		zz(i,'abc+xyz')
//		zz(i,'12345+12345')
//		zz(i,'TEdit.can.getHeight() = function() {')
//	}
//}

//testZZ()
//process.exit()

