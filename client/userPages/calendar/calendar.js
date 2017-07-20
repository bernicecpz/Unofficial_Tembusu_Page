import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';

let isPast = ( date ) => {
  let today = moment().format();
  return moment( today ).isAfter( date );
};

Template.calendar.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'calendar' );
  Meteor.subscribe('getEvents');
});

Template.calendar.onRendered( () => {

  $( '#events-calendar' ).fullCalendar({
    height: "parent",
    allDay: false,
    timeFormat: 'hh:mm a',
    timezone: "local",
    ignoreTimezone: false,
    header: {
      left: 'agendaDay, agendaWeek, month',
      center: 'title',
      right: 'today prev,next'
    }, //close 'header'

    events: function(start, end, timezone, callback) {
      callback(Events.find().fetch());
    }, //close 'events'

    eventRender: function(event, element) {
      element.find( '.fc-content' ).html(
        `<h4>${ event.title }</h4>
         <p>${ moment(event.start.toISOString()).format("hh:mm a") } - ${ moment(event.end.toISOString()).format("hh:mm a") }</p>
         <p class="type-${ event.type }">#${ event.type }</p>
        `
      );
    }, //close 'eventRender'

    eventDrop( event, delta, revert ) {
      let date = event.start.format();
      if ( !isPast( date ) ) {
        let update = {
          _id: event._id,
          start: date,
          end: date
        };
        Meteor.call( 'editEvent', update, ( error ) => {
          if ( error ) {
            Bert.alert( error.reason, 'danger' );
          }
        });
      } else {
        revert();
        Bert.alert( 'Sorry, you can\'t move items to the past!', 'danger' );
      }
    }, //close 'eventDrop'

    dayClick: function(date) {
      if(!isPast(date)){
        Session.set( 'eventModal', { type: 'add', date: $('input[name="start"]').data('daterangepicker').setStartDate(date)});
        Session.set( 'eventModal', { type: 'add', date: $('input[name="end"]').data('daterangepicker').setStartDate(date)});
        $( '#add-edit-event-modal' ).modal( 'show' );
      } else {
        Bert.alert( 'Sorry, you can\'t add items to the past!', 'danger' );
      }
    },

    eventClick: function(event) {
      Session.set( 'eventModal', { type: 'edit', event: event._id} );
      $( '#add-edit-event-modal' ).modal( 'show' );
    },

    eventMouseover: function(calEvent, jsEvent) {
      var tooltip =
        '<div class="tooltipevent panel-body" style="border-radius:10px;background:#5A7B5E;position:absolute;z-index:10001">' +
        '<p class="tool">' + calEvent.title + '</p>' +
        '<p class="tool">' + calEvent.location + '</p>' +
        '<p class="tool">' + calEvent.description + '</p>' + '</div>';
      $("body").append(tooltip);
      $(this).mouseover(function(e) {
          $(this).css('z-index', 10000);
          $('.tooltipevent').fadeIn('500');
          $('.tooltipevent').fadeTo('10', 1.9);
      }).mousemove(function(e) {
          $('.tooltipevent').css('top', e.pageY + 10);
          $('.tooltipevent').css('left', e.pageX + 20);
      });
  },

  eventMouseout: function(calEvent, jsEvent) {
       $(this).css('z-index', 8);
       $('.tooltipevent').remove();
     }
  });

  Tracker.autorun( () => {
    Events.find().fetch();
    $( '#events-calendar' ).fullCalendar( 'refetchEvents' );
  });

});
