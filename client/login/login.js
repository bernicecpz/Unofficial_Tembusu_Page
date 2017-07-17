import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import validator from 'validator';

  Template.login.onRendered(function(){

    $('#loginForm').validate({
        errorPlacement: function(error, element) {
            error.insertBefore(element).wrap('<p>'); // <- the default
        },
        rules: {
            lEmail: {
                required: true,
                email: true
            },
            password:{
              required: true
            }
        }
    });

  });

  Template.login.events({
    'submit form':function(){
      event.preventDefault();

      //Retrieve inputs
      var lEmail = (event.target.lEmail.value).toLowerCase();
      var lPwd = event.target.lpassword.value
      //Login to dashboard
      Meteor.loginWithPassword(lEmail, lPwd,function(err){
        if(Meteor.user()){
          //Router.go('/dashboard');
          Router.go('/home');
        }else{
          Session.set('alert', 'Invalid email or password.');
          Bert.alert('Invalid email or password.','danger');
        }
      });
    }
  });
