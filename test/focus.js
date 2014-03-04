require('dnaof')
glxwin = require('../../glxwin/glxwin.js')
require('../intervision')
log= console.log
var count = 0

addSplit = function(view, vert, depth) {
	view.L = TWindow.create()
	view.add(view.L)
	view.L.title = count+(vert?'.T':'.L')
	view.L.name = view.L.title

	view.R = TWindow.create()
	view.add(view.R)
	view.R.title = count+(vert?'.B':'.R')
	view.R.name = view.R.title
	if (view.R.name == '12.R') view.R.disabled = true

	count++

	view.actor = view.L
	var fk = function(key, down, physical) { if (dnaof(this, key, down, physical)) return true; if (down) { log (this.title, key, down, physical); return true } }
	view.L.onKey = fk
	view.R.onKey = fk
	if (depth == 3) return
	addSplit(view.L, !vert, depth + 1)
	addSplit(view.R, !vert, depth + 1)
}

fixSize = function(view, x, y, w, h, depth) {
	if ((depth & 1) == 0) {
		var W = (w >> 1)
		view.L.pos(x, y)
		view.L.size(W, h)
		view.R.pos(x + W, y)
		view.R.size(w - W, h)
		if (view.L.L != undefined) {
			fixSize(view.L, 1, 1, W - 2, h - 2, depth + 1)
			fixSize(view.R, 1, 1, (w - W) - 2, h - 2, depth + 1)
		}
	} else  {
		var H = (h >> 1)
		view.L.pos(x, y)
		view.L.size(w, H)
		view.R.pos(x, y + H)
		view.R.size(w, h - H)
		if (view.L.L != undefined) {
			fixSize(view.L, 1, 1, w - 2, H - 2, depth + 1)
			fixSize(view.R, 1, 1, w - 2, (h - H) - 2, depth + 1)
		}
	}
}

var TDeodar = kindof(TGLXVision)
TDeodar.can.init = function() {
	dnaof(this)
	addSplit(this.desktop, false, 0)
}
TDeodar.can.onSize = function(w, h) {
	dnaof(this, w, h)
	fixSize(this.desktop, 0, 0, this.desktop.w, this.desktop.h, 0)
}

var A = TDeodar.create()
A.setXYWH(0, 0, 800, 600)
A.show()
glxwin.mainLoop()

