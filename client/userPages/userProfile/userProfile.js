import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Accounts } from 'meteor/accounts-base';
import validator from 'validator';

var yosOption, hseOption;

if(Meteor.isClient){

  Template.userprofile.onCreated( () => {
    Meteor.subscribe('getUserProfiles');
  });

  Template.registerHelper('equals',function(a,b){
    return a === b;
  });

  Template.userprofile.helpers({
    yearOfStudyOptions: function(){
      return ["Year 1","Year 2","Year 3","Year 4","Graduate"];
    },
    houseOptions: function(){
      return ["Gaja","Ora","Ponya","Shan","Tancho"];
    },

    getUserProfile: function(){
      var getUser = Meteor.user();
      var email = getUser && getUser.emails && getUser.emails[0].address;
      var getUserProfile = UserProfiles.findOne({email:email});
      return getUserProfile;
    }

  });

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

  Template.userprofile.onRendered(function(){

    $('#changePassword-form').validate({
        errorPlacement: function(error, element) {
            error.insertAfter(element); // <- the default
        },
        rules: {
            oldPassword: {
              required: true,
            },
            newPassword: {
                required: true,
                minlength: 8
            },
            confirmNewPassword: {
              required: true,
              minlength: 8,
              passwordMatch:true
            }
        }
    });

  });


  Template.userprofile.events({

    'click #dropdown-yos': function(event,template){
      yosOption = $(event.currentTarget).val();
    },

    'click #dropdown-hse': function(event,template){
      hseOption = $(event.currentTarget).val();
    },


    'submit #aboutMe-form' :function(){
      event.preventDefault();
      var getName = event.target.userName.value;

      //Getting email
      var getUser = Meteor.user();
      var email = getUser && getUser.emails && getUser.emails[0].address;

      //Getting the id for the userProfile
      var getUserProfile = UserProfiles.findOne({email:email});
      var userProfileId = getUserProfile._id;

      //Create the item
      let userProfile = {
        _id: userProfileId,
        email: email,
        nameOfUser: getName,
        yearOfStudy: yosOption,
        house: hseOption
      };

      Meteor.call('editUserProfile', userProfile, function(error,result){
        if(error){
          Bert.alert(error.reason,'danger');
        }else{
          Bert.alert('User profile updated!', 'success');
        }
      });

    },

    'submit #changePassword=form': function(){
      event.preventDefault();
      var getOldPwd = event.target.oldPassword.value;
      var getNewPwd = event.target.newPassword.value;
      var confirmNewPwd = event.target.confirmNewPassword.value;

      if(getNewPwd == confirmNewPwd){
          Accounts.changePassword(getOldPwd,getNewPwd, function(err){
            if(err){
              Bert.alert("Password is not changed successfully", 'danger');
            }else{
              Bert.alert("Password is changed successfully", 'success');
            }
          });
      }


    }

  });

}
