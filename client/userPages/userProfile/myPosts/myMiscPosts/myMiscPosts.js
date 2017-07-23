import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';
import {Roles} from 'meteor/nicolaslopezj:roles'

if(Meteor.isClient){

  Template.myMiscPosts.onCreated( () => {
    Meteor.subscribe('getMiscPosts');
  });


  Template.myMiscPosts.helpers({
    userHasPermission: function(){
      var checkPermission = Roles.userHasPermission(Meteor.userId(),'miscPosts.insert','miscPosts.update','miscPosts.remove');
      return checkPermission;
    },

    misc_items: function(){
      var getMiscPosts = MiscellaneousPosts.find({createdBy: Meteor.userId()},{sort: { date: -1, _id: -1}});
      return getMiscPosts;
    }
  });


  Template.myMiscPosts.events({

    'click #editMiscPost':function(event){
      event.preventDefault();
        //var itemId = event.currentTarget.value;
        var itemId = event.currentTarget.value;
        var getItem = MiscellaneousPosts.findOne({_id:itemId});
        var subject = getItem && getItem.subject;
        var date = getItem && getItem.date;

        //Set into Session variable to carry value over to another template
        Session.set({
          id: itemId,
          subject: subject,
          date: date
        });


        $( '#modify-miscPost-modal' ).modal( 'show' );
    },

    'click #removeMiscPost':function(event){
      event.preventDefault();
      var itemId = event.currentTarget.value;
      var annItem = Announcements.findOne({_id: itemId});

      if ( confirm( 'Are you sure you want to delete this announcement? All data will be permanently removed.' ) ) {
        Meteor.call( 'removeMiscPost', annItem, ( error ) => {
          if ( error ) {
            Bert.alert( error.reason, 'danger' );
          } else {
            Bert.alert( 'Post deleted!', 'success' );
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
          $( '#modify-miscPost-modal' ).modal( 'hide' );
    }

  });
}
