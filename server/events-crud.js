Meteor.methods({
  addEvent( event ) {
    check( event, {
      title: String,
      location: String,
      start: String,
      end: String,
      type: String,
      description: String,
    });

    try {
      return Events.insert( event );
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  },

  removeEvent( event ) {
    check( event, String );

    try {
      return Events.remove( event );
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  },
  editEvent( event ) {
    check( event, {
      _id: String,
      title: Match.Optional( String ),
      location: Match.Optional( String ),
      start: String,
      end: String,
      type: Match.Optional( String ),
      description: Match.Optional( String ),
    });

    try {
      return Events.update( event._id, {
        $set: event
      });
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  }
});
