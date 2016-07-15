➮ tokenizeUnderline {
	// '123 456-789 --qwe' -> [ '123', '456 789', '-qwe' ]
	R ∆ a ⌶ ' '
	r ► R
		r = repl(repl(repl(r, '--', '\u0001'), '-', ' '), '\u0001', '-')
	$ R
}

➮ jgirl2json_basic {
	❰⬤a ≠ 'string'❱ a = a ⫴ ' '
	R ∆ {args:[]}
	L ∆ tokenizeUnderline(a)
	l ► L {
		⌥ l ≀ '=' > 0 {
			l = l ⌶ '='
			name ∆ l ⬉
			R[name] = l ⫴ '='
		}
		⎇ {
			R.args ⬊ l
		}
	}
	❰R.args↥ ≟ 0❱ ⏀ R.args
	$ R
}

➮ json2jgirl {
	❰a.map ≟ [].map❱ a = {args:a}
	R ∆ []
	k ∆ ⚷a
	i ► k {
		s ∆ (i + '=' + aⁱ)
		⌥ i ≟ 'args' {
			j ► aⁱ {
				s = repl(repl(j, '-', '--'), ' ', '-')
				R ⬊ s
			}
			♻
		}
		s = repl(repl(s, '-', '--'), ' ', '-')
		R ⬊ s
	}
	$ R ⫴ ' '
}

➮ shortcuts_parse info order {
	/*
		must convert ({u:'name', po:888, p:'zzz'}, ['user', 'password', 'port'])
		to { user: 'name', port: 888, password: 'zzz' }
		if shortcut is imbigous - use the first match from order.
	*/
	➮ closest {
		m ∆ []
		u ► order {
			❰u ≀ a ≟ 0❱ m ⬊ u
		}
		$ m
	}
	K ∆ ⚷ info
	R ∆ {}
	k ► K {
		long ∆ closest(k)
		⌥ long↥ == 0 {
			Rᵏ = infoᵏ
			♻
		}
		del ∆ order ≀ (long⁰)
		order ⨄ (del, 1)
		R[long⁰] = infoᵏ
	}
	$ R
}

➮ jgirl2json args order {
	info ∆ jgirl2json_basic(args)
	❰!order❱ $ info
	❰⬤order ≟ 'string'❱ order = order ⌶ ' '
	info = shortcuts_parse(info, order)
	del ∆ 0
	i ► order {
		⌥ info.args && info.args↥ > 0 {
			info[i] ≜ info.args ⬉
			del ++
		}
	}
	order ⨄ (0, del)
	⌥ info.args && info.args↥ ≟ 0 { ⏀ info.args }
	$ info
}

module.exports.from = jgirl2json
module.exports.to = json2jgirl


