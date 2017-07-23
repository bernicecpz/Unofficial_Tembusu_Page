Meteor.methods({
    addAnnouncement(event){
      check(event, {
        title: String,
        date: String,
        content: String,
        createdBy: String
      });

      try{
        return Announcements.insert(event);
      }catch(exception){
        throw new Meteor.Error( '500', `${ exception }` );
      }

    },

    removeAnnouncement(event){
      check(event, Object);

      try{
        return Announcements.remove( event );
      } catch(exception){
        throw new Meteor.Error( '500', `${ exception }` );
      }

    },

    editAnnouncement(event){
      check(event,{
        _id: String,
        title:  Match.Optional( String ),
        date: String,
        content: Match.Optional( String ),
        createdBy: String
      });

      try {
        return Announcements.update( event._id, {
          $set: event
        });
      } catch ( exception ) {
        throw new Meteor.Error( '500', `${ exception }` );
      }

    }


});
