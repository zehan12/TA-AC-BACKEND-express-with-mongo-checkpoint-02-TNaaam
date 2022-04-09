var express = require('express');
var router = express.Router();
var Event = require('../models/Event');
var Category = require('../models/Category');
const Remark = require('../models/Remark');

var util = require('../utilities/util');

const multer  = require('multer')
const path = require('path');
const { read, rmSync } = require('fs');
var uploadPath = path.join( __dirname, '../', 'public/uploads' );

//! custom multer disk storage 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb( null, uploadPath );
    },
    filename: function (req, file, cb) {
        console.log(file);
     //* it will create a random suffix for image
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname )
    }
});

const upload = multer({ storage: storage });

//! handel error by redirect on same page



//! handle route on get /new  and render form page
router.get( '/new', ( req, res ) => {
    res.render( 'event/new' );
} );

//! handle route on post /new with form date and store in database and redirect to all events page
router.post( '/new', upload.single('image'),  async ( req, res, next ) => {
    if ( !req.body.image ){
        // req.body.image = '1649268221245-119269732-wp7488244-corporate-event-wallpapers.jpg'
        req.body.image = "https://unsplash.it/900/900/?random"
    } else {
        req.body.image = req.file.fieldname;
    }
    console.log(req.body.start_date,"before");
    req.body.event_category = req.body.event_category.trim().split(" ");
    let categories = req.body.event_category;
    console.log(req.body,"before create");
    try {
        const events = await Event.create( req.body );
        console.log(events.start_date,"after");
        var eventId = events._id;
        ( async () => {
            for await ( const category of categories ){
            const categoryFound = await Category.findOne( { name: category } );
                    if ( !categoryFound ) {
                        const categoryCreated = await Category.create( { name: category } );
                        var { _id } = categoryCreated;
                        await Category.findByIdAndUpdate( _id, { $push: { eventsId: eventId } } );
                        await Event.findByIdAndUpdate( eventId, { $push: { categoriesId: _id } } );
                    } else {
                        const findCategory = await Category.findOne( { name: category } );
                        var { _id } = findCategory;
                        await Category.findByIdAndUpdate( _id, { $push: { eventsId: eventId } } );
                        await Event.findByIdAndUpdate( eventId, { $push: { categoriesId: _id } } );
                    }
            }
        })();
        res.redirect( '/event/index' );
    } catch ( err ) {
        return next( err );
    }
} );

// router.get( '/index', ( req, res, next ) => {
//     Event.find( {}, ( err, events ) => {
//         if ( err ) return next( err );
//         res.render( 'event/index', { events } );
//     } );
// } );

//! uncomment it 
// router.get( '/index', async ( req, res, next ) => {
//     try {
//         const events = await Event.find( {} )
//         const categories = await Category.find( {} );
//         res.render( 'event/index', { events, categories } );
//     } catch ( err ) {
//         return next( err );
//     }
// } )

// router.get( '/:id/detail', ( req, res, next ) => {
//     var id = req.params.id;
//     Event.findById( id, ( err, events ) => {
//         if ( err ) return next( err );
//         Remark.find( { eventId: id }, ( err, remarks  )=>{
//             if ( err ) return next( err );
//         console.log( events,remarks,"afterupdate" ); 
//         res.render( 'detailEvent', { events, remarks } );
//         } );
//     } );
// } ); 

router.get( '/:id/show', ( req, res, next ) => {
    var id = req.params.id;
    Event.findById( id ).populate( 'remarksId' ).exec( ( err, events )=>{
        if ( err ) return next( err );
        res.render( 'event/show', { events } );
    } );
} );


// router.get( '/:id/show', async ( req, res, next ) => {
//     var id = req.params.id;
//     try {
//         // var events = await Event.findById( id ).populate( 'remarksId' ).populate( 'categoriesId' );
//         var events = await Event.findById( id ).populate( 'remarksId' )
//         console.log(events);
//             res.render( 'event/show', { events } );
//     } catch ( err ) {
//         return next( err );
//     }
// } );

router.get( '/:id/update', ( req, res, next ) => {
    var id = req.params.id;
    Event.findById( id, ( err, events ) => {
        if ( err ) return next( err );
        res.render( 'event/update', { events } );
    } )
} );

router.post( '/:id/update', ( req, res, next ) => {
    var id = req.params.id;
    console.log(req.body, "raw date brfor update");
    Event.findByIdAndUpdate( id, req.body, ( err, updatedEvent ) => {
        if ( err ) return next( err );
        console.log(updatedEvent,"after update")
        res.redirect( '/event/' + id + '/show' );
    } );
} );

router.get( '/:id/delete', async ( req, res, next ) => {
    var id = req.params.id;
    try {
        const deleteEvent = await Event.findByIdAndDelete( id );
        const deleteMultiple = await Remark.deleteMany( { eventsId: id });
        console.log(deleteMultiple,"deleted")
        res.redirect('/event/index');
    } catch ( err ) {
        return next( err );
    }
} );



// like logic
router.get( '/:id/like', (req,res,next)=>{
    var id = req.params.id;
    Event.findByIdAndUpdate( id, {$inc: {likes: +1}}, (err, events)=>{
        if (err) return next(err);
        res.redirect( '/event/' + id + '/show' );
    }  );
} );

//! dislike logic
router.get( '/:id/dislike', (req,res,next)=>{
    var id = req.params.id;
    var likes = req.body.likes
    Event.findById( id, ( err, event )=>{
        if ( err ) return next(err);
        if ( event.likes === 0 ){
            Event.findByIdAndUpdate( id, { likes: 0 }, (err,event)=>{
                if ( err ) return next(err);
                res.redirect('/event/'+id+'/show');
            } )
        } else {
        Event.findByIdAndUpdate( id, {$inc: {likes: -1}}, (err,event)=>{
            if (err) return next(err);
            res.redirect('/event/'+id+'/show');
            } );
        }
    } );
});


// router.post( '/:id/remarks', async ( req, res, next ) => {
//     var id = req.params.id;
//     req.body.eventId = id;
//     await Remark.create( req.body, ( err, remark ) => {
//         if ( err ) return next( err );
//         Event.findByIdAndUpdate( id, { $push: { remarksId: remark.id } }, ( err, updateEvent ) => {
//             if ( err ) return next( err );
//             console.log(updateEvent,"updateEvent")
//             res.redirect( '/event/' + id + '/detail' );
//         } );
//     } );
// } );

router.get( '/index', async ( req, res, next ) => {
    try {
        const data = await Event.find( {} )
        var location = util.unique(data.map(e=>e.location))
        const categoryIndex = await Category.find( {} );
        res.render( 'event/index', { data, categoryIndex, location } );
    } catch ( err ) {
        return next( err );
    }
} )

router.get( '/category/:category', async ( req, res, next ) => {
    var category = req.params.category;
    try {
        const categoryIndex = await Category.find( {} );
        const locationdata = await Event.find( {} )
        var location = util.unique(locationdata.map(e=>e.location))
        const categories  = await Category.find( { name : category } ).populate( 'eventsId' );
        const categoriesdata = categories.map((e,i)=> e.eventsId);
        const data = categoriesdata[0];
        res.render('event/index',{ data, categoryIndex, location });
    } catch ( err ) {
        return next( err );
    }
} );

router.get( '/location/:location', async ( req, res, next ) => {
    var location = req.params.location;
    try {
        const data = await Event.find( { location: location } );
        const locationdata = await Event.find( {} )
        var location = util.unique(locationdata.map(e=>e.location))
        const categoryIndex = await Category.find( {} );
        res.render( 'event/index', { data, categoryIndex, location } );
    } catch {
        return next( err );
    }
} );

router.get( '/date/latest', async ( req, res, next ) => {
    try {
        const locationdata = await Event.find( {} )
        var location = util.unique(locationdata.map(e=>e.location))
        const categoryIndex = await Category.find( {} );
            const data = await Event.find().sort( {start_date:1} )
            res.render( 'event/index', { data, categoryIndex, location } );
    } catch ( err ) {
        return next ( err );
    }
} );

router.get( '/date/oldest', async ( req, res, next ) => {
    try {
        const locationdata = await Event.find( {} )
        var location = util.unique(locationdata.map(e=>e.location))
        const categoryIndex = await Category.find( {} );
            const data = await Event.find().sort( {start_date:-1} )
            res.render( 'event/index', { data, categoryIndex, location } );
    } catch ( err ) {
        return next ( err );
    }
} )


module.exports = router;