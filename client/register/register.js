import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Emails } from '/models/emails.js';
import { Accounts } from 'meteor/accounts-base';
import validator from 'validator';


if (Meteor.isClient) {

var option; //For the dropdown menu

  Template.register.onCreated( () => {
    Meteor.subscribe('getEmails');
  });


    Template.register.helpers({
      function () {
        return Session.equals('done', true);
      },

      options: function(){
        return ["student","staff"]
      },

    });



  Template.register.onRendered(function(){

    $('#registerForm').validate({
        errorPlacement: function(error, element) {
            error.insertAfter(element); // <- the default
        },
        rules: {
            rEmail: {
                required: true,
                email: true
            }

        }
    });

  });

  Template.register.events({

      //Click back to go back to main page
      "click #back":function(btn){
        event.preventDefault();
        Router.go('/');
      },

      "change #dropdown": function(event,template){
         option = $(event.currentTarget).val();
      },

      'submit form':function (event) {
          event.preventDefault();
          //Retrieve inputs
          var rEmail = (event.target.rEmail.value).toLowerCase();

            /*First Validation: Check if the email belongs to the current list of Tembusu members
            1) If email exist, the variable will store an object, else it would be undefined.
            2) Check if user status is selected correctly.
            */

            //Queries from DB
            var hasEmail = Emails.findOne({email : rEmail});
            var getUserStatus = Emails.findOne({email: rEmail},{userStatus: option});
            var getAccType = Emails.findOne({email: rEmail,userStatus: option},{getAccType:1});

            //Retrieving specific attributes
            if(getUserStatus && getAccType){
              var compareUserStatus = getUserStatus.userStatus;
              var accType = getAccType.accType;
            }

            //If the email does belong to the current list of Tembusu Members
              if(hasEmail && compareUserStatus != option){
                Bert.alert("Please check if you have selected your role (student/staff) in NUS correctly.",'danger');
              }else if(hasEmail && compareUserStatus == option){
                  //Perform the method to send the enrollmentEmail

                  /*Second Validation: Check if this email already has an user account tied to it.
                  The  callback to handle the response from the server*/
                  Meteor.call('findUserByEmail',rEmail,find_by_username_callback);

                    function find_by_username_callback(error,user){
                       if(user){
                         //console.log("Client: User Exists");
                         Router.go('/preEnrollmentError');
                       }else{

                         Meteor.call('enrollNewUser', rEmail,accType);
                         Session.set('done',true);

                         //Redirect to page that will inform user that an enrollment mail has been sent.
                         Router.go('/preEnrollmentSuccess');

                       }
                    }

              }else{
                //Redirect to page that will inform user that the Web App is exclusively for members of Tembusu College
                Router.go('/preEnrollmentFail');

              }
      }

  });



}// ENd of Meteor.isClient
