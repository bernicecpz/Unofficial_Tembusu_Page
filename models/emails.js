import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

//Retrieve from DB and store into their respective variables
Emails = new Mongo.Collection('emails');

Emails.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Emails.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let EventsSchema = new SimpleSchema({
  'email': {
    type: String,
    label: 'The email address of the individual Tembusu member.'
  },
  'accType':{
    type: String,
    label: 'The type of account the individual is entitled to with certain privileges.'
  },
  'userStatus':{
    type: String,
    label: 'The status of the user, whether a student/staff'
  },
});

Emails.attachSchema( EventsSchema );
