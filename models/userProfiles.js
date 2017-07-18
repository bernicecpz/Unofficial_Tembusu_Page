//Include the library in oder to communicate with the DB
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

//Retrieve from DB and store into their respective variables
UserProfiles = new Mongo.Collection('UserProfiles');

UserProfiles.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

UserProfiles.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let EventsSchema = new SimpleSchema({
  'email': {
    type: String,
    label: 'The email address of the individual Tembusu member.'
  },
  'nameOfUser':{
    type: String,
    label: 'Name of the individual Tembusu member.'
  },
  'yearOfStudy':{
    type: String,
    label: 'Year of Study in NUS, can be Year 1 ~ 4 or Graduate'
  },
  'house':{
    type: String,
    label: 'The House the individual Tembusu member lives in.'
  },
});

UserProfiles.attachSchema( EventsSchema );
