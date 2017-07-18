import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';

if(Meteor.isClient){


  Template.addAnnouncementModal.onCreated( () => {
    Meteor.subscribe('getAnnouncements');
  });


  Template.addAnnouncementModal.events({
    'submit form':function(){
      event.preventDefault();

      //Set the date to be of today
      var date = new Date();
      var today = moment(date).format("YYYY-MM-DD");

      //Search and replace newline for retrieval and display in announcement view page
      var annContent = $('#annContent').val();
      annContent = annContent.replace(/\r?\n/g, '<br />');

      var getUser = Meteor.user();
      var email = getUser && getUser.emails && getUser.emails[0].address;

      let eventItem = {
        title: $('#annTitle').val(),
        date: today,
        content: annContent,
        createdBy: email
      };

      Meteor.call('addAnnouncement', eventItem, function(error,result){
        if(error){
          Bert.alert(error.reason,'danger');
        }else{
          Bert.alert('Announcement added!', 'success');
        }
      });

        $( '#add-announcement-modal' ).modal( 'hide' );
    }
  });
}
