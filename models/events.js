import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {Roles} from 'meteor/nicolaslopezj:roles';
import  {AdminUserRole, NormalUserRole } from '../both/lib/roles.js';

Events = new Mongo.Collection( 'events' );

/* For Search feature */
if ( Meteor.isServer ) {
  Events._ensureIndex( { title: 1, location: 1, start: 1, end: 1, type: 1, description: 1} );
}

Events.allow({
  insert: function(userId, doc, fields, modifier){
    return Roles.allow(userId, 'events.insert', userId, doc, fields, modifier);
  },
  update:function(userId, doc, fields, modifier){
    return Roles.allow(userId, 'events.update', userId, doc, fields, modifier);
  },
  remove: function(userId, doc, fields, modifier){
    return Roles.allow(userId, 'events.remove', userId, doc, fields, modifier);
  }
});

Events.deny({
  insert: function(userId, doc, fields, modifier){
    return Roles.deny(userId, 'events.insert', userId, doc, fields, modifier);
  },
  update:function(userId, doc, fields, modifier){
    return Roles.deny(userId, 'events.update', userId, doc, fields, modifier);
  },
  remove: function(userId, doc, fields, modifier){
    return Roles.deny(userId, 'events.remove', userId, doc, fields, modifier);
  }
});


Events.attachRoles('admin-user');
Events.attachRoles('normal-user');


//Setting the allow/deny rules
AdminUserRole.allow('events.insert',function(userId, doc, fields, modifier){
  return true; //Allowed to edit his own posts.
});


AdminUserRole.allow('events.update',function(userId, doc, fields, modifier){
  return doc == true && doc.userId === userId; //Allowed to edit his own posts.
});

AdminUserRole.allow('events.remove',function(userId, doc, fields, modifier){
  return doc.userId === userId; //Allowed to remmove his own posts.
});


AdminUserRole.deny('events.updateId',function(userId, doc, fields, modifier){
  return !_.contains(fields, 'userId'); // Can't update userId field.
});


NormalUserRole.allow('events.insert',function(userId, doc, fields, modifier){
  return true; //Allowed to edit his own posts.
});


NormalUserRole.allow('events.update',function(userId, doc, fields, modifier){
  return doc == true && doc.userId === userId; //Allowed to edit his own posts.
});

NormalUserRole.allow('events.remove',function(userId, doc, fields, modifier){
  return doc == true && doc.userId === userId; //Allowed to remmove his own posts.
});


NormalUserRole.deny('events.updateId',function(userId, doc, fields, modifier){
  return !_.contains(fields, 'userId'); // Can't update userId field.
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
  },
  'createdBy':{
    type: String,
    label: 'The event owner'
  }
});

Events.attachSchema( EventsSchema );
