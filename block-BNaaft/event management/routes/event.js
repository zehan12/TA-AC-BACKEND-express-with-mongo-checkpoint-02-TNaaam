var express = require('express');
var router = express.Router();
var Event = require('../models/event');
const multer = require('multer');
var path = require('path');
const Remark = require('../models/remark');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'../','public/uploads'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage })

//! handle route on get /new  and render form page
router.get( '/new', ( req, res ) => {
    res.render( 'eventFormPage' );
} );

//! handle route on post /new with form date and store in database and redirect to all events page
router.post( '/new', upload.single('cover_image'),  async ( req, res, next ) => {
    req.body['cover-image'] = req.file.filename;
    req.body.event_category = req.body.event_category.trim().split(" ");
    await Event.create( req.body, ( err, events ) => {
        if ( err ) return next( err );
        res.redirect( '/event/all' );
    } );
} );

router.get( '/all', ( req, res, next ) => {
    Event.find( {}, ( err, events ) => {
        if ( err ) return next( err );
        res.render( 'allEventPage', { events } );
    } );
} );

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

router.get( '/:id/detail', ( req, res, next ) => {
    var id = req.params.id;
    Event.findById( id ).populate( 'remarksId' ).exec( ( err, events )=>{
        console.log( err, events );
        res.render( 'detailEvent', { events } );
    } );
} );

router.get( '/:id/edit', ( req, res, next ) => {
    var id = req.params.id;
    Event.findById( id, ( err, events ) => {
        if ( err ) return next( err );
        // console.log( events );
        res.render( 'editFormPage', { events } );
    } )
} );

router.post( '/:id/update', ( req, res, next ) => {
    var id = req.params.id;
    Event.findByIdAndUpdate( id, req.body, ( err, updatedEvent ) => {
        if ( err ) return next( err );
        // console.log( updatedEvent,"update" );
        res.redirect( '/event/' + id + '/detail' );
    } );
} );

router.get( '/:id/delete', ( req, res, next ) => {
    var id = req.params.id;
} );



// like logic
router.get( '/:id/like', (req,res,next)=>{
    var id = req.params.id;
    var like = req.body.likes
    var counter = like === 'likes' ? 1 : +1;
    Event.findByIdAndUpdate( id, {$inc: {likes: counter}}, (err, events)=>{
        if (err) return next(err);
        res.redirect('/blogs/'+id+'/detail');
    }  )
});

//! dislike logic
router.get( '/:id/dislike', (req,res,next)=>{
    var id = req.params.id;
    var likes = req.body.likes
    Event.findById( id, ( err, event )=>{
        if ( err ) return next(err);
        if ( event.likes === 0 ){
            Event.findByIdAndUpdate( id, { likes: 0 }, (err,event)=>{
                if ( err ) return next(err);
                res.redirect('/event/'+id+'/detail');
            } )
        } else {
        Event.findByIdAndUpdate( id, {$inc: {likes: -1}}, (err,event)=>{
            if (err) return next(err);
            res.redirect('/event/'+id+'/detail');
            } );
        }
    } );
});


router.post( '/:id/remarks', async ( req, res, next ) => {
    var id = req.params.id;
    req.body.eventId = id;
    await Remark.create( req.body, ( err, remark ) => {
        if ( err ) return next( err );
        Event.findByIdAndUpdate( id, { $push: { remarksId: remark.id } }, ( err, updateEvent ) => {
            if ( err ) return next( err );
            console.log(updateEvent,"updateEvent")
            res.redirect( '/event/' + id + '/detail' );
        } );
    } );
} );

module.exports = router;