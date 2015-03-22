
shortcutEnable = ➮(role, on) {
	i ⬌ ⚪ {
		⌥ (⚪ⁱ.role≀(role) >= 0 || role ≟ 'all') ⚪ⁱ.enabled = on
	}
}

TKeyInput = kindof(TObject)
TKeyInput.can.init = ➮{
	dnaof(⚪)
	⚫name = 'TKeyInput'
	⚫shortcuts = []
	⚫shortcuts.enable = shortcutEnable
//	this.react(0, keycode['r'], function() { console.log(this.name, this.id) }, { role:['xx'] })
//	this.shortcuts.enable('xx', false)
}

TKeyInput.can.react = ➮(mod, key, func, opt) {
	∇ K = { key: key, func: func, mod: mod }
	⧗ (∇ i in opt) Kⁱ = optⁱ
	⌥ (K.down ≟ ∅) K.down = ⦿
	⌥ (K.mod ≟ ∅) K.mod ⊜
	⌥ (K.enabled ≟ ∅) K.enabled = ⦿
	⌥ (K.role ≟ ∅) K.role = []
	⌥ (K.final ≟ ∅) K.final = ⦿
	⌥ (K.view ≟ ∅) K.view = ⚪
//	if (K.super == undefined) K.super = true
	⚫shortcuts ⬊(K)
	$ K
}

TKeyInput.can.onKey = ➮(K) {
	i ⬌ this.shortcuts {
		∇ u = ⚫shortcutsⁱ
		⌥ (u.enabled ≟ ⦿ && u.down ≟ K.down) {
			∇ match = ⦾
			⌥ (⬤ u.key === 'string') ⌥ (u.key === K.char) match = ⦿
			⌥ (⬤ u.key === 'number') ⌥ (u.key === K.key) match = ⦿
			⌥ (match) {
				match = ⦾
				⌥ (⬤ u.mod === 'number') {
					∇ m = '' + u.mod ⦙ ⧖ (m ↥ < 3)  m= '0' + m
					∇ ct = m△(0) ≟ '1', al = m△(1) ≟ '1', sh = m△(2) ≟ '1'
					match = ct ≟ K.mod.control && al ≟ K.mod.alt && sh ≟ K.mod.shift
					⌥ (match) {
						⌥ (u.func) $ u.func.apply(u.view, [u.arg, { K:K }])
						$
					}
				}
			}
		}
	}
	$ ⦾
}
