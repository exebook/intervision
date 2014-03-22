
shortcutEnable = function(role, on) {
	for (var i = 0; i < this.length; i++) {
		if (this[i].role.indexOf(role) >= 0 || role == 'all') this[i].enabled = on
	}
}

TKeyInput = kindof(TObject)
TKeyInput.can.init = function() {
	dnaof(this)
	this.name = 'TKeyInput'
	this.shortcuts = []
	this.shortcuts.enable = shortcutEnable
//	this.react(0, keycode['r'], function() { console.log(this.name, this.id) }, { role:['xx'] })
//	this.shortcuts.enable('xx', false)
}

TKeyInput.can.react = function(mod, key, func, opt) {
	var K = { key: key, func: func, mod: mod }
	for (var i in opt) K[i] = opt[i]
	if (K.down == undefined) K.down = true
	if (K.mod == undefined) K.mod = 0
	if (K.enabled == undefined) K.enabled = true
	if (K.role == undefined) K.role = []
	if (K.final == undefined) K.final = true
	if (K.view == undefined) K.view = this
//	if (K.super == undefined) K.super = true
	this.shortcuts.push(K)
	return K
}

TKeyInput.can.onKey = function(K) {
	for (var i = 0; i < this.shortcuts.length; i++) {
		var u = this.shortcuts[i]
		if (u.enabled == true && u.down == K.down) {
			var match = false
			if (typeof u.key === 'string') if (u.key === K.char) match = true
			if (typeof u.key === 'number') if (u.key === K.key) match = true
			if (match) {
				match = false
				if (typeof u.mod === 'number') {
					var m = '' + u.mod; while (m.length < 3)  m= '0' + m
					var ct = m.charAt(0) == '1', al = m.charAt(1) == '1', sh = m.charAt(2) == '1'
					match = ct == K.mod.control && al == K.mod.alt && sh == K.mod.shift
					if (match) {
						return u.func.apply(u.view, [u.arg, { K:K }])
					}
				}
			}
		}
	}
	return false
}
