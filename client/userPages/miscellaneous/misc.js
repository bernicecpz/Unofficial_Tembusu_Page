import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';


if(Meteor.isClient){


  Template.misc.onCreated( () => {
    Meteor.subscribe('getMiscPosts');
  });


  Template.misc.helpers({
    //Display all the annoucnements showing the latest announcements
    misc_items: function(){
      // Sorting parameters: -1 for descending order, 1 for ascending order, limit allows us to control the number of records to show
      var sortByDates = MiscellaneousPosts.find({}, {sort: { start: -1}});
      return  sortByDates;
    },
  });


  Template.misc.events({
    //Rendering the modal
    'click #add':function(){
      event.preventDefault();
      $( '#add-misc-post-modal').modal( 'show' );
    },

  });
}
