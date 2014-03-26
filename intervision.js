var objectID = 0
var tag = 'СНРРССНВРДСВНЕМСС'

TObject = kindof()

TObject.can.init = function() {
	this.name = 'TObject'
	this.id = objectID++
}

require('./key')
require('./view')
require('./group')
require('./display')
require('./window')
require('./list')
require('./qfind')
require('./text')
require('./edit')
require('./viewer')
require('./control')
require('./dialog')
require('./util')
require('./tool')
