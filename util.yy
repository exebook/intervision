// 
ALIAS = [{pattern: /^ls\b/, replace: 'ls --color '}]
s = 'ls /'
alias = ➮(t) {
	i ⬌ ALIAS {
		t = t.replace(ALIASⁱ.pattern, ALIASⁱ.replace)
	}
	$ t
}

HOME = process.env.HOME//glxwin.native_sh("env|grep ^HOME").split('\n')[0].split('=')[1]

➮ curdir { $ process.cwd() }//return glxwin.native_sh('pwd').split('\n')[0] }

expandPath = ➮(s) {
	⌥ (s ≟ '.') $ curdir()
	s = s.replace(/^\.\//, curdir() + '/')
	$ s.replace(/^~/, HOME)
}

compressFileName = ➮(s, w) {
	⌥ (s ↥ <= w) $ s
	s = s⩪(s ↥ - w, w)
	$ s
}

pathCompress = ➮(s, w) {
	⌥ (s ↥ <= w) $ s
	∇ x = s ↥, L = []
	s = s⌶('/')
	i ⬌ s L ⬊(sⁱ ↥)
	⧖ (x > w) {
		∇ long ⊜, lid = -1
		i ⬌ s ⌥ (Lⁱ >= long) long = Lⁱ, lid = i
		L[lid]--, x--
	}
	i ⬌ s {
		∇ q = sⁱ ↥ ≠ Lⁱ
		⌥ (q) {
			sⁱ = '~' + sⁱ⩪(sⁱ ↥ - Lⁱ + 1, w)
		}
	}
	$ s⫴('/')
}
//var s = 'abcdef'
//s = '~' + s.substr(s.length - 3 + 1, 6)
//log(s)
//
//process.exit()

readableSize = ➮(x, bytes) {
	∇ kb = ['',' Кб',' Мб',' Гб',' Тб']
	⌥ (bytes ≠ ∅) kb⁰ = bytes
	⧖ (kb ↥ > 0) {
		⌥ (x < 100000) $ ⍽(x) + kb⁰
		x /= 1024 ⦙ kb.shift()
	}
	$ '???'
}

wrapString = ➮(s, w) {
	∇ x ⊜, R = []
	∞ {
		∇ t = s⩪(x, w)
		⌥ (t ↥ > 0) R ⬊(t)
		x += w
		⌥ (x > s ↥) @
	}
	$ R
}

wrapLines = ➮(L, w) {
	∇ R = []
	i ⬌ L {
		R = Rꗚ(wrapString(Lⁱ, w))
	}
	$ R
}

numDeclension = ➮(sklon, rod, num, word) {
	//1 файл 2 3 4 файла 5 6 7 8 9 10 файлов 21 файл
	//1 файле 2 3 4 5 файлах 21 файле
	⌥ ((num % 10) ≟ 1) $ 'файле'
	$ 'файлах'
}

dump = ➮(x, level) {
	⌥ (level ≟ ∅) level = ''
	∇ aname = '*' ⦙ ⌥ (x.parent ≠ ∅) aname = x.parent.name
	∇ actor = '' ⦙ ⌥ (x.parent ≠ ∅) ⌥ (x.parent.actor ≟ x) actor = 'actor'
	log(level, x.name, x.x, x.y, x.w, x.h, x.visible()?'visible':'hidden', actor)
	⌥ (x.items ≟ ∅ || x.name≀('List') >= 0) ⦙ ⎇ {
		⌥ (x.items ↥ > 0) {
			log(level, '[')
			i ⬌ x.items {
				dump(x.itemsⁱ, level + '  ', x)
			}
			log(level, ']')
		}
	}
}

backtrace = ➮{
	try { i.dont.exist += 0 } catch (e) {
		∇ S = e.stack⌶('\n')
		//process.stdout.write(e.stack + '\n')
		log('--- backtrace ---')
		⧗ (∇ i = 2 ⦙ i < S ↥ ⦙ i++) {
			⌥ (Sⁱ≀('deodar') < 0) ♻
			log(Sⁱ)
		}
		log('---    end   ---')
	}
}

blend = ➮(color, level, back) { // 0 - full color, 0xf - full back
	∇ R = (color & 0xf)
	∇ G = (color & 0xf0) >> 4
	∇ B = (color & 0xf00) >> 8
	∇ r = (back & 0xf)
	∇ g = (back & 0xf0) >> 4
	∇ b = (back & 0xf00) >> 8
	➮ lvl B A level {
		⌥ (A < B) $ Math.ceil(((B - A) / 16) * level) + A
		4,15,1
		$ Math.ceil(A - ((A - B) / 16) * (15 - level))
	}
	R = lvl(R, r, level)
	G = lvl(G, g, level)
	B = lvl(B, b, level)
//	log(color.toString(16), back.toString(16), R, G, B)
	$ ⍽((R + (G << 4) + (B << 8)))
}

loadDriveMenuShortcuts = ➮ loadDriveMenuShortcuts {
	⌥ (fs.existsSync(expandPath('~/.deodar/driveMenu.js'))) {
		js ∆ expandPath('~/.deodar/driveMenu.js')
		try {
			∇ src = fs.readFileSync(js)≂
			list = eval(src)
		}
		catch (em) {
			return
		}
		L = []
		m ► list {
			⌥ typeof m.path != 'string' ♻
			title ∆ m.title.split('^').join('')
			path ∆ m.path.split(process.env.HOME).join('~')
			⌥ path↥ > title↥ {
				L ⬊ (
					{
						title: title,
						path: path
					}
				)
			}
		}
		L ❄ (➮ {
			$ b.path↥ - a.path↥
		})
	}
	$ L
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

