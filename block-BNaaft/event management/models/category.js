const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name : {
        type : String,
        unique: true
    },
    eventsId : [{
        type : Schema.Types.ObjectId,
        ref : 'Event'
    }]
}, { timestamps: true });

const Category  = mongoose.model( 'Category', categorySchema );

module.exports = Category;