import { Meteor } from 'meteor/meteor';
import { IronRouter } from 'meteor/iron:router';

if (Meteor.isClient) {
  Template.main.events({
    //Click onto submit button
     "click #login":function(btn){
      event.preventDefault();
      Router.go('/login');
    },

    "click #register":function(btn){
      event.preventDefault();
      Router.go('/register');
    }
  });


}
