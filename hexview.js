THexView = kindof(TView)

THexView.can.init = function(fileName) {
	dnaof(this)
	this.fileName = fileName
	this.symWidth = 3
	this.base = 16
	this.bytes = 1
	this.setMode('double')
	this.lines = []
	this.name = 'THexView'
	this.delta = 0
	this.react(0, keycode.UP, this.moveCursor, {arg:'up'})
	this.react(0, keycode.DOWN, this.moveCursor, {arg:'down'})
//	this.react(0, keycode.HOME, this.moveCursor, {arg:'home'})
//	this.react(0, keycode.END, this.moveCursor, {arg:'end'})
	this.react(0, keycode.PAGE_UP, this.moveCursor, {arg:'pageup'})
	this.react(0, keycode.PAGE_DOWN, this.moveCursor, {arg:'pagedown'})
//	this.react(0, keycode.LEFT, this.moveCursor, {arg:'left'})
//	this.react(0, keycode.RIGHT, this.moveCursor, {arg:'right'})
	this.react(0, keycode['1'], this.setBase, {arg:16})
	this.react(0, keycode['2'], this.setBase, {arg:10})
	this.react(0, keycode['3'], this.setBase, {arg:8})
	this.react(0, keycode['r'], this.setMode, {arg:'overlay'})
	this.react(0, keycode['e'], this.setMode, {arg:'double'})
	this.react(0, keycode['q'], this.setMode, {arg:'number'})
	this.react(0, keycode['w'], this.setMode, {arg:'text'})
}

THexView.can.size = function(w, h) {
	this.dna(w, h)
	this.loadBuf()
}

THexView.can.setBase = function(arg) {
	this.base = arg
	this.symWidth = 1
	if (arg == 10) this.symWidth = 4
	if (arg == 16) this.symWidth = 3
	if (arg == 8) this.symWidth = 4
	this.loadBuf()
	return true
}

THexView.can.setMode = function(arg) {
	this.mode = arg
	if (arg == 'number') this.rows = 1, this.setBase(this.base)
	if (arg == 'text') this.rows = 1, this.symWidth = 1
	if (arg == 'double') this.rows = 2, this.setBase(this.base)
	if (arg == 'overlay') this.rows = 1, this.setBase(this.base)
	this.loadBuf()
	return true
}

THexView.can.track = function() {
	return { size: this.fileSize, pos: this.delta }
}

THexView.can.loadBuf = function() {
	if (this.w == undefined) return
	try {
		this.fileSize = fs.lstatSync(this.fileName).size
		var f = fs.openSync(this.fileName, 'r'), N = Math.floor(this.w / this.symWidth) * this.h
		N /= this.rows
		this.buf = new Buffer(N)
		this.bytesRead = fs.readSync(f, this.buf, 0, N, this.delta)
		fs.closeSync(f)
	} catch (e) { 
		if (f) fs.closeSync(f)
		log(e)
	}
}

THexView.can.draw = function() {
	var charList = '`~1!2@3#4$5%6^7&8*9(0)-_=+QWERTYUIOP{}qwertyuiop[]azsxdcfvgbhnjmk,l.;/\'AZSXDCFVGBHNJMK<L>:?" '
	dnaof(this)
	log(this.bytes)
	var x = 0, y = 0, w = this.symWidth
	var ch, num, F, C1 = this.pal[0], C2 = this.pal[2]
	for (var i = 0; i < this.bytesRead; i++) {
		num = undefined, ch = undefined, F = C1
		var n = this.buf[i]
		if (this.mode == 'text' || this.mode == 'double' || 
			(this.mode == 'overlay' && charList.indexOf(String.fromCharCode(n)) >= 0))
				ch = String.fromCharCode(n)
		n = n.toString(this.base)
		if (this.mode == 'overlay' && ch) n = ch, F = C2
		else if (this.mode == 'text') n = ch
		else {
			n = n.toUpperCase()
			while (n.length < (this.bytes << 1)) n = '0' + n
		}
		this.print(x, y, n, F)
		if (this.rows == 2) {
			this.print(x, y + 1, ch, C2)
		}
		x += w; if ((x + w) >= this.w) x = 0, y += this.rows
	}
}

THexView.can.moveCursor = function(arg) { with (this) {
	var N = Math.floor(w / symWidth), H = (N * h) / rows
 	if (arg == 'up') {
		delta -= N
		if (delta < 0) delta = 0
	} else if (arg == 'down') {
		if (delta < fileSize - N) delta += N
	} else if (arg == 'home') {
//		delta = 0
//		x = 0
	} else if (arg == 'end') {
//		delta = lines.length - h + 1
//		if (delta < 0) delta = 0
	} else if (arg == 'pageup') {
		delta -= H
		if (delta < 0) delta = 0
	} else if (arg == 'pagedown') {
		if (delta < fileSize - H) delta += H
	} else if (arg == 'left') {
//		navx -= 5
//		if (navx < 0) navx = 0
	} else if (arg == 'right') {
//		navx += 5
	}
	this.loadBuf()
	this.repaint()
	return true
}}

THexView.can.scrollToBottom = function() {
	this.d = this.lines.length - this.h
	if (this.d < 0) this.d = 0
}
