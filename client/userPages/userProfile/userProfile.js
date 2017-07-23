import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Accounts } from 'meteor/accounts-base';
import validator from 'validator';
import {Roles} from 'meteor/nicolaslopezj:roles'

var yosOption, hseOption;

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

  Template.userprofile.onCreated( () => {
    Meteor.subscribe('getUserProfiles');
    Meteor.subscribe('getAnnouncements');
    Meteor.subscribe('getMiscPosts');
  });

  Template.registerHelper('equals',function(a,b){
    return a === b;
  });

  Template.registerHelper('isMoreThan',function(a,b){
    if(a > b){
      return true;
    }else{
      return false;
    }
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
    },


    userHasAnnPermission: function(){
      var checkPermission = Roles.userHasPermission(Meteor.userId(),'announcements.insert','announcements.update','announcements.remove');
      return checkPermission;
    },

    userHasMiscPermission: function(){
      var checkPermission = Roles.userHasPermission(Meteor.userId(),'miscPosts.insert','miscPosts.update','miscPosts.remove');
      return checkPermission;
    },

    ann_items: function(){
      var getAnnouncements = Announcements.find({createdBy: Meteor.userId()}, {limit: 3},{sort: { date: -1, _id: -1}});
      return getAnnouncements;
    },

    misc_items: function(){
      var getMiscPosts = MiscellaneousPosts.find({createdBy: Meteor.userId()}, {limit: 3},{sort: { date: -1, _id: -1}});
      return getMiscPosts;
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

    'submit #changePassword-form': function(){
      event.preventDefault();
      var getOldPwd = event.target.oldPassword.value;
      var getNewPwd = event.target.npassword.value;
      var confirmNewPwd = event.target.confirmPassword.value;
      list = schema.validate(getNewPwd,{list:true});
      Meteor.call('pwdValidationMsg',list, result_callback);

      function result_callback(error,element){
        if(element){
          //Means there is error
          Bert.alert("Password is not accepted. Reason: " + element,'danger');
        }else{
            Accounts.changePassword(getOldPwd,getNewPwd, function(err){
              if(err){
                Bert.alert("Password is not changed successfully. Invalid password", 'danger');
              }else{
                Bert.alert("Password is changed successfully.", 'success');
              }
            });
        }
      }
    },

    'click #seeMoreAnn': function(){
      event.preventDefault();
      Router.go("/myAnnouncements");
    },

    'click #seeMoreMisc': function(){
      event.preventDefault();
      Router.go("/myMiscPosts");
    },

    'click #editAnnouncement':function(event){
      event.preventDefault();
        var itemId = event.currentTarget.value;
        var getItem = Announcements.findOne({_id:itemId});
        var title = getItem && getItem.title;
        var date = getItem && getItem.date;

        //Set into Session variable to carry value over to another template
        Session.set({
          id: itemId,
          title: title,
          date: date
        });


        $( '#modify-announcement-modal' ).modal( 'show' );
    },

    'click #removeAnnouncement':function(event){
      event.preventDefault();
      var itemId = event.currentTarget.value;
      var annItem = Announcements.findOne({_id: itemId});

      if ( confirm( 'Are you sure you want to delete this announcement? All data will be permanently removed.' ) ) {
        Meteor.call( 'removeAnnouncement', annItem, ( error ) => {
          if ( error ) {
            Bert.alert( error.reason, 'danger' );
          } else {
            Bert.alert( 'Announcement deleted!', 'success' );
          }
        });
      }

        $('#modify-announcement-modal').on('hidden.bs.modal', function (e) {
          $(this)
            .find("input,textarea,select")
               .val('')
               .end()
            .find("input[type=checkbox], input[type=radio]")
               .prop("checked", "")
               .end();
        });
          $( '#modify-announcement-modal' ).modal( 'hide' );
    },

    'click #editMiscPost':function(event){
          event.preventDefault();
            var itemId = event.currentTarget.value;
            var getItem = MiscellaneousPosts.findOne({_id:itemId});
            var subject = getItem && getItem.subject;
            var date = getItem && getItem.date;

            //Set into Session variable to carry value over to another template
            Session.set({
              id: itemId,
              subject: subject,
              date: date
            });

              $('#modify-miscPost-modal').modal('show');
          //  $( '#modify-miscPost-modal' ).modal( 'show' );
        },

        'click #removeMiscPost':function(event){
          event.preventDefault();
          var itemId = event.currentTarget.value;
          var annItem = MiscellaneousPosts.findOne({_id: itemId});

          if ( confirm( 'Are you sure you want to delete this post? All data will be permanently removed.' ) ) {
            Meteor.call( 'removeMiscPost', annItem, ( error ) => {
              if ( error ) {
                Bert.alert( error.reason, 'danger' );
              } else {
                Bert.alert( 'Announcement deleted!', 'success' );
              }
            });
          }

            $('#modify-miscPost-modal').on('hidden.bs.modal', function (e) {
              $(this)
                .find("input,textarea,select")
                   .val('')
                   .end()
                .find("input[type=checkbox], input[type=radio]")
                   .prop("checked", "")
                   .end();
            });
              $( '#modify-miscPost-modal' ).modal( 'hide' );
        }

  });

}
