import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Events = new Mongo.Collection( 'events' );

/* For Search feature */
if ( Meteor.isServer ) {
  Events._ensureIndex( { title: 1, location: 1, start: 1, end: 1, type: 1, description: 1} );
}

Events.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Events.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let EventsSchema = new SimpleSchema({
  'title': {
    type: String,
    label: 'The title of this event '
  },
  'location': {
    type: String,
    label: 'The location of this event '
  },
  'start': {
    type: String,
    label: 'Start time of thie event '
  },
  'end': {
    type: String,
    label: 'End time of this event '
  },
  'type': {
    type: String,
    label: 'The type of event ',
    allowedValues: [ 'Interest Groups', 'Workshops', 'Forums' ]
  },
  'description': {
    type: String,
    label: 'More information about this event '
  }
});

Events.attachSchema( EventsSchema );
