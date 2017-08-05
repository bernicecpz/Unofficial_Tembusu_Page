import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import validator from 'validator';



if(Meteor.isClient){
  //Password rules
  var pwdValidator = require('password-validator');

  var schema = new pwdValidator();

  schema
  .is().min(8)  //Minimum Length
  .is().max(30) //Maximum Length
  .is().uppercase(1)  //Must have 1 uppercase
  .is().lowercase(1)  //Must have 1 lowercase
  .has().letters()
  .has().digits()     //Must have digits
  .has().not().spaces() //Should not have space
  .is().not().oneOf(['Passw0rd','paSSw0rd','Password123','P@ssword123','pAssword123','password','password123',
  'p@ssword123','password@123','Password@123']) //Black listed passwords


  //Set a variabe to pass
  var doneCallback, token;

  //TO-DO: Currently the tokens are not being checked and can be faked.
  Accounts.onEnrollmentLink(function (token, done) {
    //Retrieve the token & put it into a session variable
    Session.set("enrollAccountToken", token);
    //Assigning to variable
    doneCallback = done;
  });

  Template.enrollment.helpers({
    enrollAccountToken: function(){
      return Session.get('enrollAccountToken');
    },
  });

  //Source: https://gist.github.com/grayghostvisuals/6984561
  //Values are modified to fulfill the needs for enrollment form
  jQuery.validator.addMethod( 'passwordMatch', function(value, element) {

      // The two password inputs
      var password = $("#npassword").val();
      var confirmPassword = $("#confirmPassword").val();

      // Check for equality with the password inputs
      if (password != confirmPassword ) {
          return false;
      } else {
          return true;
      }

  }, "Your Passwords Must Match");

  //ClientInput Validation
  //When updating the user, check on the server side too
  Template.enrollment.onRendered(function(){

    $('#set-password-form').validate({
        errorPlacement: function(error, element) {
            error.insertAfter(element); // <- the default
        },
        rules: {
            npassword: {
                required: true,
                minlength: 8
            },
            confirmPassword: {
              required: true,
              minlength: 8,
              passwordMatch:true
            }
        }
    });

  });




  Template.preEnrollmentSuccess.onRendered(function(){
  //console.log("Redirecting to main page");
  Meteor.setTimeout(function(){
  Router.go('/') },3500);
  });


  Template.preEnrollmentFail.onRendered(function(){
  //console.log("Redirecting to main page");
  Meteor.setTimeout(function(){
  Router.go('/register') },3500);
  });

  Template.preEnrollmentError.onRendered(function(){
  //console.log("Redirecting to main page");
  Meteor.setTimeout(function(){
  Router.go('/') },100000);
  });

  Template.enrollmentSuccess.onRendered(function(){
  //console.log("Redirecting to main page");
  Meteor.setTimeout(function(){
  Router.go('/') },3500);
  });

  Template.enrollmentResend.events({
    "click #back":function(btn){
      event.preventDefault();
      Router.go('/');
    },
  });


  Template.enrollment.events({
    'submit #set-password-form': function(event) {
      event.preventDefault();

        var pwd, confirmPwd, list;
        pwd = event.target.npassword.value;
        confirmPwd = event.target.confirmPassword.value;
        list = schema.validate(pwd,{list:true});

        Meteor.call('pwdValidationMsg',list, result_callback);
        function result_callback(error,element){
          if(element){
            //Means there is error
            Bert.alert(element);
          }else{
            //Password has been validated
            //console.log("validation pass");

            //Set the password for the user for the first time, user will be logged immediately
            Accounts.resetPassword(Session.get('enrollAccountToken'), pwd, function(error) {
              if (error) {
                  if (error.message === 'Token expired [403]') {

                    Session.set('alert', 'This link has expired.');
                    Bert.alert("This link has expired.",'danger');
                    Router.go('/enrollmentFail');

                  } else {
                    //Session.set('alert', 'There was a problem setting your password.');
                    Bert.alert("There was a problem setting your password.",'danger');
                    Router.go("/enrollmentFail");
                  }
              } else {
                //  Session.set('alert', 'Your password has been changed.');  // This doesn't show. Display on next page
                  Bert.alert("Your password has been changed.",'success');
                  Session.set('enrollAccountToken', '');
                  Router.go('/enrollmentSuccess');

                  // Call done before navigating away from here
                  if (doneCallback) {
                    doneCallback();
                  }

              }
            });


          }
        }
      }
  });

  Template.enrollmentResend.events({
    'submit form':function (event) {
        event.preventDefault();
        var email = (event.target.email.value).toLowerCase();
        Meteor.call('resendEnrollmentLink',email,status_callBack);

        //Anything related to user, in the callBack , use "user" for the 2nd arg
        function status_callBack(error,user){
          if(user){ //The user arg will return a boolean value
            console.log("Enrollment link has been resent.");
            Router.go('/preEnrollmentSuccess');

          }else{
            Bert.alert("This email is not registered. Please register your NUS email if you have not done so.",'warning');
            Router.go('/');
          }
        }

      }
  });

}
