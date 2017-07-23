import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';
import {Roles} from 'meteor/nicolaslopezj:roles'

if(Meteor.isClient){

  Template.myAnnouncements.onCreated( () => {
    Meteor.subscribe('getAnnouncements');
  });


  Template.myAnnouncements.helpers({
    userHasPermission: function(){
      var checkPermission = Roles.userHasPermission(Meteor.userId(),'announcements.insert','announcements.update','announcements.remove');
      return checkPermission;
    },

    ann_items: function(){
      var getAnnouncements = Announcements.find({createdBy: Meteor.userId()},{sort: { date: -1}});
      return getAnnouncements;
    }
  });


  Template.myAnnouncements.events({

    'click #editAnnouncement':function(event){
      event.preventDefault();
        //var itemId = event.currentTarget.value;
        var ItemId = $('#editAnnouncement').val();
        var getItem = Announcements.findOne({_id:itemId});
        var title = getItem && getItem.title;
        var date = getItem && getItem.date;

        //Set into Session variable to carry value over to another template
        Session.set({
          id: itemId,
          title: title,
          date: date
        });


        $( '#modify-announcement-modal' ).modal( 'show' );
    },

    'click #removeAnnouncement':function(event){
      event.preventDefault();
      var itemId = event.currentTarget.value;
      var annItem = Announcements.findOne({_id: itemId});

      if ( confirm( 'Are you sure you want to delete this announcement? All data will be permanently removed.' ) ) {
        Meteor.call( 'removeAnnouncement', annItem, ( error ) => {
          if ( error ) {
            Bert.alert( error.reason, 'danger' );
          } else {
            Bert.alert( 'Announcement deleted!', 'success' );
          }
        });
      }
            $('#modify-miscPost-modal').on('hidden.bs.modal', function (e) {
              $(this)
                .find("input,textarea,select")
                   .val('')
                   .end()
                .find("input[type=checkbox], input[type=radio]")
                   .prop("checked", "")
                   .end();
            });
          $( '#modify-announcement-modal' ).modal( 'hide' );
    }

  });
}
