Meteor.methods({
    addMiscPost(event){
      check(event, {
        subject: String,
        date: String,
        content: String,
        createdBy: String
      });

      try{
        return MiscellaneousPosts.insert(event);
      }catch(exception){
        throw new Meteor.Error( '500', `${ exception }` );
      }

    },

    removeMiscPost(event){
      check(event, Object);

      try{
        return MiscellaneousPosts.remove( event );
      } catch(exception){
        throw new Meteor.Error( '500', `${ exception }` );
      }

    },

    editMiscPost(event){
      check(event,{
        _id: String,
        subject:  Match.Optional( String ),
        date: String,
        content: Match.Optional( String ),
        createdBy: String
      });

      try {
        return MiscellaneousPosts.update( event._id, {
          $set: event
        });
      } catch ( exception ) {
        throw new Meteor.Error( '500', `${ exception }` );
      }

    }


});
