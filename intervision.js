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
require('./viewer')
require('./text')
require('./edit')
require('./dialog')
require('./util')
require('./tool')
