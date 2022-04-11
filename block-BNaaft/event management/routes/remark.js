var express = require('express');
var router = express.Router( {mergeParams:true} );

var Event = require('../models/Event');
var Remark = require('../models/Remark');

//! add the remarks as well as linked both IDs
router.post( '/new', async ( req, res, next ) => {
    var eventsId = req.params.eventsId;
    req.body.eventsId = eventsId;
    try {
        const createRemarks = await Remark.create( req.body );
        await Event.findByIdAndUpdate( eventsId, { $push: { remarksId: createRemarks._id } } );
        res.redirect( '/event/'+eventsId+'/show' );
    } catch ( err ) {
        return next( err );
    }
});

//! delete each remarks as well as removed both IDs
router.get( '/:remarkId/delete', async ( req, res, next ) => {
    var eventsId = req.params.eventsId;
    var remarkId = req.params.remarkId;
    req.body.eventsId = req.params.eventsId;
    try {
        const deleteRemarks = await Remark.findByIdAndDelete( remarkId );
        var { eventsId } = deleteRemarks;
        const removeRemarksId = await Event.findByIdAndUpdate( eventsId, { $pull: { remarksId: remarkId } } );
        res.redirect( '/event/'+eventsId+"/show" );
    } catch ( err ){
        return next( err );
    }
} );

//! get request on update comment
router.get( "/:remarkId/update", async ( req, res, next ) => {
    var remarkId = req.params.remarkId;
    try {
        var remark = await Remark.findById( remarkId );
        console.log(remark.content,"remarksID");
        res.render( 'event/remark/update', { remark } );
    } catch ( err ) {
        return next( err );
    }
} )


//! post req on update comment
router.post( "/:remarkId/update", async ( req, res, next ) => {
    var remarkId = req.params.remarkId;
    var eventsId = req.params.eventsId;
    try {
        const remarkUpdate = await Remark.findByIdAndUpdate( remarkId, { content: req.body.content } );
        res.redirect( '/event/'+eventsId+'/show' );
    } catch ( err ) {
        return next( err );
    }
} );

//! like

//! dislike


module.exports = router;