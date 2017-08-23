import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {Roles} from 'meteor/nicolaslopezj:roles';
import  {AdminUserRole} from '../both/lib/roles.js';


Announcements = new Mongo.Collection('announcements');

//Use the action
Announcements.allow({
  insert: function(userId, doc, fields, modifier){
    return Roles.allow(userId, 'announcements.insert', userId, doc, fields, modifier);
  },
  update:function(userId, doc, fields, modifier){
    return Roles.allow(userId, 'announcements.update', userId, doc, fields, modifier);
  },
  remove: function(userId, doc, fields, modifier){
    return Roles.allow(userId, 'announcements.remove', userId, doc, fields, modifier);
  }
});

Announcements.deny({
  insert: function(userId, doc, fields, modifier){
    return Roles.deny(userId, 'announcements.insert', userId, doc, fields, modifier);
  },
  update:function(userId, doc, fields, modifier){
    return Roles.deny(userId, 'announcements.update', userId, doc, fields, modifier);
  },
  remove: function(userId, doc, fields, modifier){
    return Roles.deny(userId, 'announcements.remove', userId, doc, fields, modifier);
  }
});

//Create a new role

Announcements.attachRoles('admin-user');

//Setting the allow/deny rules
AdminUserRole.allow('announcements.insert',function(userId, doc, fields, modifier){
  return true; //Allowed to edit his own posts.
});


AdminUserRole.allow('announcements.update',function(userId, doc, fields, modifier){
  return doc.userId === userId; //Allowed to edit his own posts.
});

AdminUserRole.allow('announcements.remove',function(userId, doc, fields, modifier){
  return doc.userId === userId; //Allowed to remmove his own posts.
});


AdminUserRole.deny('announcements.updateId',function(userId, doc, fields, modifier){
  return !_.contains(fields, 'userId'); // Can't update userId field.
});

let EventsSchema = new SimpleSchema({
  'title': {
    type: String,
    label: 'The title of the announcement.'
  },
  'date': {
    type: String,
    label: 'When the announcement is being made.'
  },
  'content': {
    type: String,
    label: 'Content of the announcement'
  },
  'createdBy':{
    type: String,
    label: 'Email of user to identify who made the announcement'
  }
});

Announcements.attachSchema( EventsSchema );
