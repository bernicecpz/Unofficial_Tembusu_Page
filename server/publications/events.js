/* For search feature */

Meteor.publish( 'events', function( search ) {
  check( search, Match.OneOf( String, null, undefined ) );
  console.log("Inside Search: After check()");
  let query      = {},
      projection = { limit: 10, sort: { title: 1 } };

  if ( search ) {
    let regex = new RegExp( search, 'i' );

    query = {
      $or: [
        { title: regex },
        { location: regex },
        { type: regex },
        { description: regex }
      ]
    };

    projection.limit = 100;
  }
  console.log("Inside Search: After regex matching");

  var retrieve = Events.find( query, projection );

  console.log("Check values: " + retrieve);

    return retrieve;

});
