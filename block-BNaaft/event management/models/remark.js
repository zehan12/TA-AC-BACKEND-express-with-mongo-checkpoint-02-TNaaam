var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var remarkSchema = new Schema({
    content: { type: String, trim: true, requierd: true },
    eventsId: 
        { type: Schema.Types.ObjectId,
            ref: "Event"
        }
});

module.exports = mongoose.model( "Remark", remarkSchema );