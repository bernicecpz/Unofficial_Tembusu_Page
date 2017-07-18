import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
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
  .is().not().oneOf(['Passw0rd', 'Password123','P@ssword123','password','password123','p@ssword123','password@123','Password@123']) //Black listed passwords


  var doneCallback, token;

  Accounts.onResetPasswordLink(function(token,done){
    Session.set("resetPasswordToken",token);
    doneCallback = done;
  });

  Template.resetPassword.helpers({
    resetPasswordToken: function(){
      return Session.get('resetPasswordToken');
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
  Template.resetPassword.onRendered(function(){

    $('#reset-password-form').validate({
        errorPlacement: function(error, element) {
            error.insertAfter(element); // <- the default
        },
        rules: {
            rpassword: {
                required: true,
                minlength: 8
            },
            rConfirmPassword: {
              required: true,
              minlength: 8,
              passwordMatch:true
            }
        }
    });

  });


  Template.passwordResetReq.events({
    'click #back':function(btn){
      event.preventDefault();
      Router.go('/');
    },

    //Submit the password reset form
    'submit form':function(event){
      event.preventDefault();
      var email = (event.target.email.value).toLowerCase();
      if(validator.isEmail(email)){
        Meteor.call('findUserByEmail',email,status_callBack);

          function status_callBack(error,user){
            //If user can't be found
            //User will return the entire user
            if(user){
              console.log("Found user by email");

              var options = {};
              options.email = email;
              Accounts.forgotPassword(options, function(error){
                if(error){
                  console.log(error);
                }else{
                  Router.go('/passwordResetSuccess');
                }
              });

            }else{
              Bert.alert("Please provide a valid email address.",'warning');
              Router.go('/');
            }
          }
      }


    },
  });

  Template.resetPassword.events({
    'submit #reset-password-form': function(event) {
      event.preventDefault();

        var pwd, confirmPwd, list;
        pwd = event.target.rpassword.value;
        confirmPwd = event.target.rConfirmPassword.value;
        list = schema.validate(pwd,{list:true});

        Meteor.call('pwdValidationMsg',list, result_callback);
        function result_callback(error,element){
          if(element){
            //Means there is error
            Bert.alert(element,'warning');
          }else{
            //Password has been validated
            //console.log("validation pass");

            //Set the password for the user for the first time, user will be logged immediately
            Accounts.resetPassword(Session.get('resetPasswordToken'), pwd, function(error) {
              if (error) {
                  if (error.message === 'Token expired [403]') {
                    Session.set('alert', 'This link has expired.');
                    Bert.alert("This link has expired.",'danger');


                    Router.go('/passwordResetFail');
                  } else {
                    Session.set('alert', 'There was a problem setting your password.');
                    Bert.alert("There was a problem setting your password. Please try again.",'danger');


                    Router.go("/passwordResetFail");
                  }
              } else {
                  Session.set('alert', 'Password has been reset.');  // This doesn't show. Display on next page
                  Bert.alert("Password has been reset.",'success')
                  Session.set('resetPasswordToken', '');

                  // Call done before navigating away from here
                  if (doneCallback) {
                    doneCallback();
                  }

                  Router.go('/');
              }
            });
          }
        }
      }
  });

  Template.passwordResetSuccess.onRendered(function(){
  //console.log("Redirecting to main page");
  Meteor.setTimeout(function(){
  Router.go('/') },3500);
  });

  Template.passwordResetFail.onRendered(function(){
  //console.log("Redirecting to main page");
  Meteor.setTimeout(function(){
  Router.go('/') },3500);
  });

}
