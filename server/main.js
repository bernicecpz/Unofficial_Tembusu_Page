import { Meteor } from 'meteor/meteor';
import { Emails } from "../models/emails.js";
import { Accounts } from 'meteor/accounts-base';
import validator from 'validator';
import {Roles} from 'meteor/nicolaslopezj:roles';

/*Users is already a built-in collection, hence no need to publish or subscribe like emails collection that I created.
 If customization of the default publish is required, refer to https://guide.meteor.com/accounts.html#publish-custom-data */

Meteor.startup(() => {

  //Connect to SMTP provider Mailgun
  process.env.MAIL_URL ="smtp://postmaster%40sandboxc2e4ac085a614018b45c9188467e4bda.mailgun.org:unofficialTembusu@smtp.mailgun.org:587";

  // Code to run on server at startup
  Meteor.publish('getEmails',function(){
    return Emails.find({});
  });

  Meteor.publish('getEvents',function(){
    return Events.find({});
  });

  Meteor.publish('getAnnouncements',function(){
    return Announcements.find({});
  });

  Meteor.publish('getMiscPosts',function(){
    return MiscellaneousPosts.find({});
  });

  Meteor.publish('getUserProfiles',function(){
    return UserProfiles.find({});
  });

  //Find the token linked to the enrolled user
  Meteor.publish('enrolledUser',function(token){
    return Meteor.users.find({"services.password.reset.token": token});
  });

  //For enrollment link
  Accounts.urls.enrollAccount = function (token) {
    return Meteor.absoluteUrl('enroll-account/' + token);
  };

  //Find the token linked to the user who wants to reset password
  Meteor.publish('resetPassword',function(token){
    return Meteor.users.find({"services.password.reset.token": token});
  });

  //For reset password link
  Accounts.urls.resetPassword = function(token){
    return Meteor.absoluteUrl('reset-password/' + token);
  }

});

if(Meteor.isServer) {
  Meteor.methods({
    //Check if this email already has an user account tied to it.
    //DO NOT communicate with the users database directly, var emailEnrolled = users.findOne({email: rEmail});

    //Accounts
    findUserByEmail : function(email){
      const userEmail = Accounts.findUserByEmail(email);
      return userEmail;
    },

    //Create a user tied to the email & send enrollment email to set their password
    enrollNewUser: function(email,accType){
      if(validator.isEmail(email)){
        //if(!Meteor.users.findOne()){ //Will only create a user if there are none in the users collection
        //^I.e. only 1 user inside the db, which is not correct

          //Generate randomPassword that is unique
          var randomPassword = Random.id();
          const userId = Accounts.createUser({email: email, password: randomPassword});

          //Create a role for user based on their pre-assignment
          Roles.addUserToRoles(userId, accType);

          //Then create an user profile for the following account
          let userProfile = {
            email: email,
            nameOfUser: "New User", //Default value till user change
            yearOfStudy: "Undergraduate", //Default value till user change
            house: "Not Set" //Default value till user change
          };


          Meteor.call('addUserProfile',userProfile, function(error,result){
            if(error){
              console.log("Server: User Profile is not created successfully.");
              console.log("Reason of Error: " + error.reason);
            }else{
              console.log("Server: User Profile is created successfully.");
            }
          });


          Accounts.sendEnrollmentEmail(userId);
          console.log("Server: User Creation Success");
      }else{
          console.log("Server: User Creation Fail");
      }

    },

    /*In the case where the user accidentally lost the previous enrollment link,
    can request for a new enrollment link.*/
    resendEnrollmentLink: function(email){
      if(validator.isEmail(email)){
        const user = Accounts.findUserByEmail(email);
        if(user){
          //Find the user tied to the email
          Accounts.sendEnrollmentEmail(user);
          console.log("Server: Enrollment Link has been resend.");
          return true;
        }else{
          console.log("Server: Email does not exist. User should register.");
          return false;
        }
      }
    },


    //Check that the password fulfill the password rules, will return error message if any
    pwdValidationMsg: function(list){
      var error, string=""; //Append to errors together
      if(list.length == 0){
        //Empty, all password rules met
        console.log("All password conditions are met.");
      }else{
        for (var index = 0; index < list.length; index++){
            switch(list[index]){
              case "min":
                error = "Password of minimum length is not met.";
                break;
              case "uppercase":
                error = "At least 1 uppercase is required.";
                break;
              case "lowercase":
                error = "At least 1 lowercase is required.";
                break;
              case "digits":
                error = "At least 1 digit is required.";
                break;
              case "oneOf":
                error = "This password is blacklisted. Please use a more secure password.";
                break;
              case "letters":
                error = "At least 1 letter is required.";
                break;
            }//End of switch statement

            //Formating of string
            if (string == ""){
              string = error;
            }else{
              string += "\n" + error;
            }
        }
      }

      return string;
    },

  }); //End of Meteor.methods Braces


//Customizing Email Templates
Accounts.emailTemplates.siteName ='The Unofficial Tembusu Page';
Accounts.emailTemplates.from ='UTP Admin <admin@UTP.com>';

//Enrollment Email Format
Accounts.emailTemplates.enrollAccount.subject = (user) =>{
    return 'The Unofficial Tembusu Page Enrollment';
};

Accounts.emailTemplates.enrollAccount.text = (user, url) => {

  return 'Hello!\n\n' + 'Welcome to The Unofficial Tembusu Page!\n\n'
    + ' To activate your account, simply click the link below:\n\n'
    + url + '\n\nThank you\n\n' + 'Kind Regards,\n\nUTP Admin';
};

//Password Reset Email Format
Accounts.emailTemplates.resetPassword.from = () =>{
    return 'The Unofficial Tembusu Page <no-reply@UTP.com>'
};



} //End of Meteor.isServer Braces
