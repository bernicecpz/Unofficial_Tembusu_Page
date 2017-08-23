import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';
import { Accounts } from 'meteor/accounts-base';

//Include anything for _appHeader and _appFooter here under appLayout since they are both parth of it.

if(Meteor.isClient){
  Template._appHeader.onCreated( () => {
    Meteor.subscribe('getUserProfiles');
  });

  Template._appHeader.helpers({
    getUserProfile: function(){
      var getUser = Meteor.user();
      var email = getUser && getUser.emails && getUser.emails[0].address;
      var getUserProfile = UserProfiles.findOne({email:email});
      return getUserProfile;
    }
  });


  Template._appHeader.events({
    'click .logout':function(){
      event.preventDefault();
      Meteor.logout(function(){
        Router.go('/');
      });
    },

  });



}
