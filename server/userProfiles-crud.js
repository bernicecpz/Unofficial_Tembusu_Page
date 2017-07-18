Meteor.methods({
    addUserProfile(event){
      check(event, {
        email: String,
        nameOfUser: String,
        yearOfStudy: String,
        house: String
      });

      try{
        return UserProfiles.insert(event);
      }catch(exception){
        throw new Meteor.Error( '500', `${ exception }` );
      }

    },

    removeUserProfile(event){
      check(event, String);

      try{
        return UserProfiles.remove( event );
      } catch(exception){
        throw new Meteor.Error( '500', `${ exception }` );
      }

    },

    editUserProfile(event){
      check(event,{
        _id: String,
        email: String,
        nameOfUser: Match.Optional( String ),
        yearOfStudy: Match.Optional( String ),
        house: Match.Optional( String )
      });

      try {
        return UserProfiles.update( event._id, {
          $set: event
        });
      } catch ( exception ) {
        throw new Meteor.Error( '500', `${ exception }` );
      }

    }


});
