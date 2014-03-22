var objectID = 0

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
require('./text')
require('./edit')
require('./viewer')
require('./dialog')
require('./util')
require('./tool')
