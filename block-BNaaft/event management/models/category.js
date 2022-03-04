const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category : {
        type : String,
    },
    events : [{
        type : Schema.Types.ObjectId,
        ref : 'Event'
    }]

})

const Category  = mongoose.model( 'Category', categorySchema );