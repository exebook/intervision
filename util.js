
ALIAS = [{pattern: /^ls\b/, replace: 'ls --color '}]
s = 'ls /'
alias = function(t) {
	for (var i = 0; i < ALIAS.length; i++) {
		t = t.replace(ALIAS[i].pattern, ALIAS[i].replace)
	}
	return t
}

HOME = glxwin.native_sh("env|grep ^HOME").split('\n')[0].split('=')[1]

function curdir() { return native_sh('pwd').split('\n')[0] }

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

dump = function(x, level) {
	if (level == undefined) level = ''
	var aname = '*'; if (x.parent != undefined) aname = x.parent.name
	var actor = ''; if (x.parent != undefined) if (x.parent.actor == x) actor = 'actor'
	log(level, x.name, x.x, x.y, x.w, x.h, x.visible()?'visible':'hidden', actor)
	if (x.items == undefined || x.name == 'TList'); else {
		if (x.items.length > 0) {
			log(level, '[')
			for (var i = 0; i < x.items.length; i++) {
				dump(x.items[i], level + '  ', x)
			}
			log(level, ']')
		}
	}
}
