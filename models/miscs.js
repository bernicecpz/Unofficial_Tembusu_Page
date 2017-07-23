import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {Roles} from 'meteor/nicolaslopezj:roles';
import  {AdminUserRole, NormalUserRole } from '../both/lib/roles.js';

MiscellaneousPosts = new Mongo.Collection('miscPosts');

//Use the action
MiscellaneousPosts.allow({
  insert: function(userId, doc, fields, modifier){
    return Roles.allow(userId, 'miscPosts.insert', userId, doc, fields, modifier);
  },
  update:function(userId, doc, fields, modifier){
    return Roles.allow(userId, 'miscPosts.update', userId, doc, fields, modifier);
  },
  remove: function(userId, doc, fields, modifier){
    return Roles.allow(userId, 'miscPosts.remove', userId, doc, fields, modifier);
  }
});

MiscellaneousPosts.deny({
  insert: function(userId, doc, fields, modifier){
    return Roles.deny(userId, 'miscPosts.insert', userId, doc, fields, modifier);
  },
  update:function(userId, doc, fields, modifier){
    return Roles.deny(userId, 'miscPosts.update', userId, doc, fields, modifier);
  },
  remove: function(userId, doc, fields, modifier){
    return Roles.deny(userId, 'miscPosts.remove', userId, doc, fields, modifier);
  }
})

//Create a new role

MiscellaneousPosts.attachRoles('admin-user');
MiscellaneousPosts.attachRoles('normal-user');

//Setting the allow/deny rules
AdminUserRole.allow('miscPosts.insert',function(userId, doc, fields, modifier){
  return true; //Allowed to edit his own posts.
});


AdminUserRole.allow('miscPosts.update',function(userId, doc, fields, modifier){
  return doc == true && doc.userId === userId; //Allowed to edit his own posts.
});

AdminUserRole.allow('miscPosts.remove',function(userId, doc, fields, modifier){
  return doc.userId === userId; //Allowed to remmove his own posts.
});


AdminUserRole.deny('miscPosts.updateId',function(userId, doc, fields, modifier){
  return !_.contains(fields, 'userId'); // Can't update userId field.
});


NormalUserRole.allow('miscPosts.insert',function(userId, doc, fields, modifier){
  return true; //Allowed to edit his own posts.
});


NormalUserRole.allow('miscPosts.update',function(userId, doc, fields, modifier){
  return doc == true && doc.userId === userId; //Allowed to edit his own posts.
});

NormalUserRole.allow('miscPosts.remove',function(userId, doc, fields, modifier){
  return doc == true && doc.userId === userId; //Allowed to remmove his own posts.
});


NormalUserRole.deny('miscPosts.updateId',function(userId, doc, fields, modifier){
  return !_.contains(fields, 'userId'); // Can't update userId field.
});



let EventsSchema = new SimpleSchema({
  'subject': {
    type: String,
    label: 'The subject of the miscellaneous post.'
  },
  'date': {
    type: String,
    label: 'When the miscellaneous post is being made.'
  },
  'content': {
    type: String,
    label: 'Content of the miscellaneous post'
  },
  'createdBy':{
    type: String,
    label:'Email of user to identify who made the miscellaneous postt'
  }
});

MiscellaneousPosts.attachSchema( EventsSchema );
