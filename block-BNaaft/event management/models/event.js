var mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.Promise = global.Promise;
// var Schema = mongoose.Schema;

var eventSchema = new Schema({
    title: { type: String, required: true },
    summary: String,
    host: String,
    start_date: Date,
    end_date: Date,
    event_category: [ String ],
    location: String,
    "cover_image": String,
    likes: { type: Number, default: 0 },
    remarksId: [
        { type: Schema.Types.ObjectId, 
            ref: "Remark" } 
    ]
}, { timestamps: true } );

module.exports = mongoose.model( "Event", eventSchema );
