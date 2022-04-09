const mongoose = require("mongoose");
var Event = require("../models/Event");

mongoose.connect( 'mongodb://localhost/eventmanagement', ( err ) => {
  console.log( err ? err : "connected to database" );
} );

var events = [ new Event( {
    title:"Birthday Event",
    summary:"Some parties are held in honor of a specific person, day, or event, such as a birthday party, a Super Bowl party, or a St. Patrick's Day party. Parties of this kind are often called celebrations. A party is not necessarily a private occasion.",
    host: "zehan",
    start_date: 12/03/2012,
    end_date: 20/04/2012,
    event_category: ["party"],
    location: "udaipur",
    image: "",
    likes: 0,
} ),
new Event( {
    title:"Seminar",
    summary:"Some parties are held in honor of a specific person, day, or event, such as a birthday party, a Super Bowl party, or a St. Patrick's Day party. Parties of this kind are often called celebrations. A party is not necessarily a private occasion.",
    host: "zehan",
    start_date: 22/04/2020,
    end_date: 24/04/2022,
    event_category: ["tech","sifi"],
    location: "dharmshala",
    image: "",
    likes: 0,
} ),
];



var done = 0;
for ( var i = 0 ; i < events.length ; i++ ) {
    events[i].save( function( err, result ) {
        done++;
        console.log("yeah")
        if ( done === events.length ) {
            exit();
        }
    } );
}

function exit(  ) {
    mongoose.disconnect(  );
};

mongoose.disconnect();