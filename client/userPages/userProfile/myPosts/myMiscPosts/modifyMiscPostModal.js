import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';

if(Meteor.isClient){


  Template.modifyMiscPostModal.onCreated( () => {
    Meteor.subscribe('getMiscPosts');
  });

  Template.modifyMiscPostModal.helpers({
    subject: function(){
      var subject = Session.get('subject');
      return subject;
    },
    content: function(){
      var itemId = Session.get('id');
      var miscItem = MiscellaneousPosts.findOne({_id: itemId});
      var content = miscItem && miscItem.content;
      content = content && content.replace(/\<br \/>/g, '\r\n');

      return content;
    }
  });

  Template.modifyMiscPostModal.events({
    'submit form':function(){
      event.preventDefault();

      var miscContent = $('#miscContent').val();
      miscContent = miscContent.replace(/\r?\n/g, '<br />');

      //Get userId for createdBy parameter
      var userId = Meteor.userId();

      let eventItem = {
        _id: Session.get('id'),
        subject: $('#miscTitle').val(),
        date: Session.get('date'),
        content: miscContent,
        createdBy: userId
      };

      Meteor.call('editMiscPost', eventItem, function(error,result){
        if(error){
          Bert.alert(error.reason,'danger');
        }else{
          Bert.alert('Post edited!', 'success');
        }
      });

      //Delete all the session.keys after use
      Session.keys = {};

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
