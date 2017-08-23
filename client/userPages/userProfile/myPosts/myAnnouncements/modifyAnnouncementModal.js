import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';

if(Meteor.isClient){


  Template.modifyAnnouncementModal.onCreated( () => {
    Meteor.subscribe('getAnnouncements');
  });

  Template.modifyAnnouncementModal.helpers({
    title: function(){
      var title = Session.get('title');
      return title;
    },
    content: function(){
      var itemId = Session.get('id');
      var annItem = Announcements.findOne({_id: itemId});
      var content = annItem && annItem.content;
      content = content && content.replace(/\<br \/>/g, '\r\n');

      return content;
    }
  });

  Template.modifyAnnouncementModal.events({
    'submit form':function(){
      event.preventDefault();

      var annContent = $('#annContent').val();
      annContent = annContent.replace(/\r?\n/g, '<br />');

      //Get userId for createdBy parameter
      var userId = Meteor.userId();

      let eventItem = {
        _id: Session.get('id'),
        title: $('#annTitle').val(),
        date: Session.get('date'),
        content: annContent,
        createdBy: userId
      };

      Meteor.call('editAnnouncement', eventItem, function(error,result){
        if(error){
          Bert.alert(error.reason,'danger');
        }else{
          Bert.alert('Announcement edited!', 'success');
        }
      });

      //Delete all the session.keys after use
      Session.keys = {};

        $( '#modify-announcement-modal' ).modal( 'hide' );
    }
  });
}
