let closeModal = () => {
  $( '#add-edit-event-modal' ).modal( 'hide' );
  $( '.modal-backdrop' ).fadeOut();
};

Template.addEditEventModal.helpers({
  modalType( type ) {
    let eventModal = Session.get( 'eventModal' );
    if ( eventModal ) {
      return eventModal.type === type;
    }
  },
  modalLabel() {
    let eventModal = Session.get( 'eventModal' );

    if ( eventModal ) {
      return {
        button: eventModal.type === 'edit' ? 'Edit' : 'Add',
        label: eventModal.type === 'edit' ? 'Edit' : 'Add an'
      };
    }
  },
  selected( v1, v2 ) {
    return v1 === v2;
  },
  event() {
    let eventModal = Session.get( 'eventModal' );

    if ( eventModal ) {
      return eventModal.type === 'edit' ? Events.findOne( eventModal.event ) : {
        start: eventModal.date,
        end: eventModal.date
      };
    }
  }
});

//Single Date Picker, standardized the format as stored inside the datebase
Template.addEditEventModal.rendered = function(){

  $('#start').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    timePicker: true,
    locale: {
        format: 'YYYY-MM-DD hh:mm a'
    }
  });

  $('#end').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    timePicker: true,
    locale: {
        format: 'YYYY-MM-DD hh:mm a'
    }
  });

  /*$('input[name="end"]').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    locale: {
        format: 'YYYY-MM-DD',
    }
  });*/
  /*$('input[name="end"]').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    autoUpdateInput: false
    }, function(chosen_date) {
    $('input[name="end"]').val(chosen_date.format('YYYY-MM-DD'));
  });*/
};


Template.addEditEventModal.events({
  'submit form' ( event, template ) {
    event.preventDefault();
    let eventModal = Session.get( 'eventModal' ),
        submitType = eventModal.type === 'edit' ? 'editEvent' : 'addEvent',
        eventItem  = {
          title: template.find( '[name="title"]' ).value,
          location: template.find( '[name="location"]' ).value,
          start: template.find( '[name="start"]' ).value,
          end: template.find( '[name="end"]' ).value,
          type: template.find( '[name="type"] option:selected' ).value,
          description: template.find( '[name="description"]' ).value,
          guests: parseInt( template.find( '[name="guests"]' ).value, 10 )
        };

    if ( submitType === 'editEvent' ) {
      eventItem._id   = eventModal.event;
    }

    Meteor.call( submitType, eventItem, ( error ) => {
      if ( error ) {
        Bert.alert( error.reason, 'danger' ); //added package
      } else {
        Bert.alert( `Event ${ eventModal.type }ed!`, 'success' );
        closeModal();
      }
    });
  }, //close 'submit form'
  'click .delete-event' ( event, template ) {
    let eventModal = Session.get( 'eventModal' );

    if ( confirm( 'Are you sure? This is permanent.' ) ) {
      Meteor.call( 'removeEvent', eventModal.event, ( error ) => {
        if ( error ) {
          Bert.alert( error.reason, 'danger' );
        }else {
          Bert.alert( 'Event deleted!', 'success' );
          closeModal();
        }
      });
    }
  } //close 'click .delete-event'
});
