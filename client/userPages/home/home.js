import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';


if(Meteor.isClient){

  Template.home.onCreated( () => {
    Meteor.subscribe('getEvents');
    Meteor.subscribe('getAnnouncements');
    Meteor.subscribe('getMiscPosts');
  });


  Template.home.helpers({
    // Sorting parameters: -1 for descending order, 1 for ascending order, limit allows us to control the number of records to show

    all_event_items: function(){
      //Display the upcoming events
      var sortEventsByDates = Events.find({},{limit: 3}, {sort: { start: 1}});
      return sortEventsByDates;
    },

    all_ann_items: function(){
      //Show the top 3 latest announcements
      var sortAnnByDates = Announcements.find({},{limit: 3}, {sort: { start: -1}});
      return sortAnnByDates;
    },

    all_misc_items: function(){
      //Show the top 3 latest misc posts
      var sortMiscByDates = MiscellaneousPosts.find({},{limit: 3}, {sort: { start: -1}});
      return sortMiscByDates;
    },
  });

}
