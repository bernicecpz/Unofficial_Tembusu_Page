import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Events = new Mongo.Collection( 'events' );

/* For Search feature */
if ( Meteor.isServer ) {
  Events._ensureIndex( { title: 1, location: 1, start: 1, end: 1, type: 1, description: 1, guests: 1 } );
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
    label: 'The title of this event.'
  },
  'location': {
    type: String,
    label: 'The location of this event.'
  },
  'start': {
    type: String,
    label: 'When this event will start.'
  },
  'end': {
    type: String,
    label: 'When this event will end.'
  },
  'type': {
    type: String,
    label: 'What type of event is this?',
    allowedValues: [ 'Interest Groups', 'Workshops', 'Forums' ]
  },
  'description': {
    type: String,
    label: 'More information about this event.'
  },
  'guests': {
    type: Number,
    label: 'The number of guests expected at this event.'
  }
});

Events.attachSchema( EventsSchema );
