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
    categoriesId: [ { type: Schema.Types.ObjectId, ref: "Category" } ],
    location: String,
    image: { type: String, default: '1649268221245-119269732-wp7488244-corporate-event-wallpapers.jpg' },
    likes: { type: Number, default: 0 },
    remarksId: [
        { type: Schema.Types.ObjectId, 
            ref: "Remark" } 
    ]
}, { timestamps: true } );

eventSchema.pre( "save", function( next ){
    this.start_date = String( new Date( Date.parse(this.start_date) )).split(" ").splice(1,3).join("/");
    next();
} )

module.exports = mongoose.model( "Event", eventSchema );
