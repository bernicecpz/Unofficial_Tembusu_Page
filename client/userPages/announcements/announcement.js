import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';


if(Meteor.isClient){

  Template.announcement.onCreated( () => {
    Meteor.subscribe('getAnnouncements');
  });


  Template.announcement.helpers({
    //Display all the annoucnements showing the latest announcements
    ann_items: function(){
      // Sorting parameters: -1 for descending order, 1 for ascending order, limit allows us to control the number of records to show
      var sortByDates = Announcements.find({}, {sort: { start: -1}});
      return  sortByDates;
    },
  });


  Template.announcement.events({
    //Rendering the modal
    'click #add':function(){
      event.preventDefault();
      $( '#add-announcement-modal').modal( 'show' );
    },

  });
}
