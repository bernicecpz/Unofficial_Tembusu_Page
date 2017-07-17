import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';


//Include anything for _appHeader and _appFooter here under appLayout since they are both parth of it.

if(Meteor.isClient){

  Template._appHeader.events({
    "click .logout":function(){
      event.preventDefault();
      Meteor.logout(function(){
        Router.go('/');
      });
    }
  });

}
