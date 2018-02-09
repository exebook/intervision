/*
	TList = kindof(TView)
	2 + 2 = 4, ['abc']
	TList.can.init = function() {
		if (true) { if (me) { me = this[123] } }
	}

	applyEnterRules = function(s) {
		for (var i = 0; i < enterRule.length; i++) {
			var e = enterRule[i]
			var x = '.' + e.ext
			var j = s.indexOf(x)
			if (j >= 0 && j == s.length - x.length) {
				if (e.tty) return { tty: e.tty, name: s }
				if (e.spawn) return { spawn: e.spawn, name: s }
				return { name: s }
			}
		}
*/

BACK ∆ 0x022
FRAME ∆ 0x177
FRAME_INACTIVE ∆ 0x045
FRAME_TITLE_SEL ∆ 0x244
LIST_DIVIDER ∆ FRAME
UNKNOWN1 ∆ 0

⏀ require.cache[require.resolve('./palette')]

⏀ getColor

getColor = {
	view:[0xfff,0x700],
//	view:[0xaa0,0x077],
//	window:[0xaa0,0x700,0xff0,0xa44],
	window:[FRAME_INACTIVE,BACK,FRAME,FRAME_TITLE_SEL],
//	window2:[0xff0,0x960,0xff0,0xf52,0x931,0xcb7,0xfb4],
	dialog:[0x555,0xbcd,0x444,0x9ab,0x555,0,0xefe],//	$.bg=,$.frame.fg=0x555,$.frame.fg_focus=0,
//	list:[0xaa0,0x700,0x700,0x880,0x0ff],//0xff0,0x880,0xfff],//,0x00f,0xafa,0x88f],
	list:[0xaa0,0x077,0x077,0x880,0x0ff],//0xff0,0x880,0xfff],//,0x00f,0xafa,0x88f],
//	filelist:[0x700,0xff0,0x880,0xfff,0x00f,0xafa,0x88f],
//	filelist:[0xff0,0x700,0xfff,0xff,0,0,0x880,0,0],
	filelist:[LIST_DIVIDER,BACK,UNKNOWN1,0xfff,0,0,0x880,0,0],
	filelist2:[0xff0,0x960,0xff0,0xf52,0x931,0xcb7,0xfb4],
	label:[0,0xe0e,0xf00,0x0f0],
	button:[0,0x888],
	edit:[0x990,0x500,0xff0],
//	syntaxGreen:[0xff0,0x580,0x400,0xaa0,
//		0x370, // selection
//		0xbb7, //comment
//		0x000, // sym
//		0x0f8, // num
//		0x08f, //str
//		0x433, // id
//		0x0ff, //key 0 function
//		0x0af, // key 1 dnaof
//		0x040, // key 2 console
//		0xf14, // key 3 TView
//		0xa03,  // false this
//	], /* console */
//	syntaxCyan: [0xff0, 0x990, 0x400, 0xaa0,
//		0xc90, // selection
//		0x755, //comment

//		0xdd0, // sym
//		0x0f8, // num
//		0x00e, //str
//		0x211, // id

//		0x0ff, //key 0 function
//		0x0af, // key 1 dnaof
//		0x40c, // key 2 console
//		0xf00, // key 3 TView
//		0xa03,  // false this
//	],
	syntaxWhite:[0x844,0xfff,0xc88,0xfff,0xee4,0x888,0xf00,0x077,0x00f,0x777,
		0xf08,0x26c,0x040,0xf80,0xd09,
	],
	syntaxNoBlue:[0x244,0x2f9,0x288,0x2ff,
		0x2e4,0x288,0x200,0x077,0x00f,0x277, // sel rem sym num str id fun log T ⚫
		0x208,0x26c,0x040,0x280,0x209,
	],
	syntaxBlack:[0x888,0x000,0x334,0x111,
	0x3f3,0x456,
	0xc6c,0x065,0x44f,0xaaa,
	0x2d2,0x08f,0x090,0xf80,0x740,
	0xd0d,0xbb0,0x0ff,0xf88,0x88f,0x8f8,0x08f,0xf80,0xf08,0x80f // extra braces
	],
/*
➮ set_access prime get_see_use_tag list1 list2 {
	⌥ list1 { prime[get_see_use_tag].access1 = list1 }
	⌥ list2 { prime[get_see_use_tag].access2 = list2 }
}

➮ link_from_to a b {
	⌥ a.to ≟ ∅ {
		a.to = {}
	}
	⌥ b.from ≟ ∅ {
		b.from = {}
	}
	a.to[b.id] = b
	b.from[a.id] = a
}

➮ make_prime owner id {
	prime ∆ { id: id }
	set_access (prime, 'get', ['any'])
	set_access (prime, 'use', [owner])
//	set_access (prime, 'tag', ['any'])
	ロ 'ok'
}
➮ main {
	ctx ∆ {}
	srv ∆ createServer(ctx, socket_message, socket_connect, socket_close)
	srv.listen(3999, '127.0.0.1')
	ロ 'started:', ⚡ % 1000
}
*/
 syntaxAtari1: [0xf00,0xffb,0x040,0xe84,
 0xccf,0xcb7,
 0xa0a,0x050,0x00f,0xc55,
 0x088,0x07f,0x040,0xc0b,0xf6f,
 0x080,0x800,0x00f // extra {{}}
 ],
 /*
 log
 ((((((((((((())))))))))))))))))
 {{{{{{{{{{{}}}}}}}}}}}
 */
	syntaxGreen2:[0x202,0x570,0x4b1,0x000,0x000,0xaba,0x0f2,0xfc8,0x7bf,0x233,0x3ee,0x8d3,0xc35,0x8ff,0x255],
	syntaxPink1:[0x000,0x9ad,0x67b,0xabe,0x0dd,0x65c,0xeff,0x077,0x04f,0x005,0x15a,0x02f,0x040,0xf80,0x740],
	syntaxPurple:[0x000,0xa0a,0x9f2,0x000,0x000,0xc4b,0xeef,0x724,0x60f,0x2fb,0xfc3,0x2af,0x4f0,0x118,0xd21],
	syntaxYellow:[0x000,0x2ed,0xb39,0xa28,0x000,0xcba,0x3a5,0xb8d,0x05f,0x838,0xa42,0xe90,0xbe6,0xdff,0x01a],
//	console:[0x777,0x233,0xf00,0xf0f,0x00f],
	console:[0x277,0x233,0x070,0x27f,0x00f],
	syntaxBlue1:[0xfff,0x900,0xb60,0x600,0x840,0x888,0xfdd,0x077,0x04f,0xdc0,0x2df,0x2d2,0xfff,0xf80,0x87a],
// ロ  cons  TView this  (atari spc=762)
	syntaxMilk: [0xf00,0xcdd,0x323,0xbcc,0xfd9,0x989,0x000,0x041,0x008,0x656,0x888,0x912,0x040,0xd28,0x740],
	syntaxGray: [0xffa,0x999,0xfd8,0x777,0x9cc,0x767,0xfff,0x0f9,0x02e,0x320,0x0ff,0x912,0x040,0xd28,0x740],
	syntaxKofe: [0x088,0x233,0x08f,0x088,0x0ce, 0x288,0x0c8,0x28c, 0x04f,0x28a,0x0cc, 0x27f,0x3af,0x2f8,0x08f, 0x8ff, 0xf0f, 0xff0, 0x0f0, 0x88f, 0xf08, 0x882, 0x82f],
	//  frame-off paper frame-on title-bk sel  rem sym num  str id fun log  T ⚫ ( ( ( ( ( ( 
	
	consoleGreen: [0x6a6, 0x021],
	editor: [0x444, 0xfff],
	
			/* function dnaof console TView true
				room.listen('logged in', ➮ (α) {
					ロ 'ACTOR SET', getCreatag(α)
					ⓐ ∆ α.data.actor
				}) */
}
		
∇ fileListNorton = {
	text: 0xff0, back: 0x700, dir: 0xfff, textHint: 0x88f, backHint: 0x00f,
	textHintFocused: 0, backHintFocused: 0, focused: 0x880,
	textExec: 0x0f0, textSelected: 0x0ff,
	hilite: [
		{ name: 'c', ext: ['.cpp','.c','.h'], text: 0xb1c },
		{ name: 'js', ext: ['.js'], text: 0xf3e },
		{ name: 'go', ext: ['.go'], text: 0xe3f },
		{ name: 'yy', ext: ['.yy'], text: 0x18c },
		{ name: 'asm', ext: ['.asm', '.inc'], text: 0x80f },
	]
	
}

∇ fileListNoBlue = {

	text: 0x070, back: BACK, dir: 0x2f2, textHint: 0x28f, backHint: 0x00f,
	textHintFocused: 0, backHintFocused: 0, focused: 0x280,
	textExec: 0x080, textSelected: 0x0ff,
	hilite: [
		{ name: 'c', ext: ['.cpp','.c','.h'], text: 0x1ac },
		{ name: 'js', ext: ['.js'], text: 0x18e },
		{ name: 'go', ext: ['.go'], text: 0x16c },
		{ name: 'yy', ext: ['.yy'], text: 0x18a },
		{ name: 'asm', ext: ['.asm', '.inc'], text: 0x16c },
	]
	
}
               //cursor spc   ==   title  sel  rem   sym   num   str   id    ➮
// ロ  cons  TView this  (atari spc=762)
//syntaxAtari1: [0xff0,0x960,0xff0,0xf52,0x931,0xcb7,0xfb4,0x5e7,0x99f,0xff8,0xffe,0x0ff,0x0ff,0xcfb,0xfbf], //good:0xfc8
/*
a ∆ getColor.syntaxAtari1
//a ∆ getColor.syntaxBlack
getColor.window = a
getColor.filelist = a
getColor.filelist⁰ = a²
getColor.filelist² = a⁹
∇ fileListAtari = {
	text: a⁹, back: a¹, dir: a[10], textHint: 0x88f, backHint: 0x00f,
	textHintFocused: 0, backHintFocused: 0, focused: a⁴,
	textExec: a⁷, textSelected: a[11],
	hilite: [
		{ name: 'c', ext: ['.cpp','.c','.h'], text: a[13] },
		{ name: 'js', ext: ['.js'], text: a⁸ },
		{ name: 'yy', ext: ['.yy'], text: a[14] },
		{ name: 'asm', ext: ['.asm', '.inc'], text: a⁸ },
	]
}
*/
getColor.fileList = fileListNoBlue

