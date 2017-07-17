import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';

if(Meteor.isClient){


  Template.addMiscPostModal.onCreated( () => {
    Meteor.subscribe('getMiscPosts');
  });


  Template.addMiscPostModal.events({
    'submit form':function(){
      event.preventDefault();

      //Set the date to be of today
      var date = new Date();
      var today = moment(date).format("YYYY-MM-DD");

      //Search and replace newline for retrieval and display in announcement view page
      var miscContent = $('#miscContent').val();
      miscContent = miscContent.replace(/\r?\n/g, '<br />');

      //Get userId for createdBy parameter
      var getUser = Meteor.user('getUserId');
      var userId = getUser._id;

      let eventItem = {
        subject: $('#miscTitle').val(),
        date: today,
        content: miscContent,
        createdBy: userId
      };

      Meteor.call('addMiscPost', eventItem, function(error,result){
        if(error){
          Bert.alert(error.reason,'danger');
        }else{
          Bert.alert('Post added!', 'success');
        }
      });

      $( '#add-misc-post-modal' ).modal( 'hide' );
    }
  });
}