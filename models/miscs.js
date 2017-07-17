import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

MiscellaneousPosts = new Mongo.Collection('miscPosts');

MiscellaneousPosts.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

MiscellaneousPosts.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
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
    label:'Id of user to identify who made the miscellaneous postt'
  }
});

MiscellaneousPosts.attachSchema( EventsSchema );
