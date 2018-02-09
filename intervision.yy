∇ objectID ⊜
∇ tag = 'CHPCCHBPД3CBHEMCC'

TObject = kindof()

TObject.can.init = ➮{
	⚫name = 'TObject'
	⚫id = objectID++
}

≣('./key')
≣('./view')
≣('./group')
≣('./display')
≣('./window')
≣('./list')
≣('./qfind')
⌥(⬤ NEWEDIT != 'undefined') ≣ './text/flow'
⎇ ≣('./text')
≣('./edit')
≣('./viewer')
≣('./control')
≣('./dialog')
≣('./util')
≣('./tool')
≣('./textview')
≣('./hexview')
≣('./palette-dialog')

handyContext = {
	lastSearchTerm: ''
}

