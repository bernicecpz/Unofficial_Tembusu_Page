import { Router } from 'meteor/iron:router';
import { Meteor } from 'meteor/meteor';

//Declare all the routes here
/*
Note to self: Router.map seems to be depreciated methods
*/

//Main Page
Router.route('/',function(){
  this.render('main')
});

//Login Related
Router.route('/login',function(){
  this.render('login')
});

Router.route('/passwordResetReq',function(){
  this.render('passwordResetReq')
});

Router.route('/passwordResetSuccess',function(){
  this.render('passwordResetSuccess')
});


//Registration and Enrollment Related
Router.route('/register',function(){
  this.render('register')
});

Router.route('/preEnrollmentError',function(){
  this.render('preEnrollmentError')
});

Router.route('/preEnrollmentFail',function(){
  this.render('preEnrollmentFail')
});

Router.route('/preEnrollmentSuccess',function(){
  this.render('preEnrollmentSuccess')
});

Router.route('/enrollmentFail',function(){
  this.render('enrollmentFail')
});

Router.route('/enrollmentSuccess',function(){
  this.render('enrollmentSuccess')
});

Router.route('/enrollmentResend',function(){
  this.render('enrollmentResend')
});

Router.route('/passwordResetFail',function(){
  this.render('passwordResetFail')
});


//Inclusion of token for enrollment and setting of password
Router.route('/enrollment',{
    path:'/enroll-account/:token',
    template:'enrollment',

    onBeforeAction: function(){
      Meteor.logout();
      Session.set('enrollAccountToken',  this.params.token);
       this.subscribe('enrolledUser', this.params.token).wait();
       this.next();
    },

    data: function() {
         if(this.ready()){
             return {
                 enrolledUser: Meteor.users.findOne()
             }
         }
     }

});

Router.route('/resetPassword',{
    path:'/reset-password/:token',
    template:'resetPassword',

    onBeforeAction: function(){
      Meteor.logout();
      Session.set('resetPasswordToken',  this.params.token);
       this.subscribe('resetPassword', this.params.token).wait();
       this.next();
    },

    data: function() {
         if(this.ready()){
             return {
                 resetPassword: Meteor.users.findOne()
             }
         }
     }

});

/*
Note to Self:
1) Use Hooks to control how the routes are redirected;
Source: http://meteortips.com/second-meteor-tutorial/iron-router-part-3/
*/

//When the user has logged in, then they can access the following pages
Router.route('/home',{
    name:'home',
    template:'home',
    yieldTemplates: {
      '_appHeader': {to: 'header'},
      '_appFooter': {to: 'footer'}
    },
    data: function(){
      var currentUser = Meteor.userId();
    },
    onRun: function(){
      this.next();
    },
    onBeforeAction: function(){
      var currentUser = Meteor.userId();
      if(currentUser){
        this.layout('appLayout');
        this.next();
      }else{
        this.render('main');
      }
    }
  }
);

Router.route('/announcement',{
    name:'announcement',
    template:'announcement',
    yieldTemplates: {
      '_appHeader': {to: 'header'},
      '_appFooter': {to: 'footer'}
    },
    data: function(){
      var currentUser = Meteor.userId();
    },
    onRun: function(){
      this.next();
    },
    onBeforeAction: function(){
      var currentUser = Meteor.userId();
      if(currentUser){
        this.layout('appLayout');
        this.next();
      }else{
        this.render('main');
      }
    }
  }
);

Router.route('/misc',{
    name:'misc',
    template:'misc',
    yieldTemplates: {
      '_appHeader': {to: 'header'},
      '_appFooter': {to: 'footer'}
    },
    data: function(){
      var currentUser = Meteor.userId();
    },
    onRun: function(){
      this.next();
    },
    onBeforeAction: function(){
      var currentUser = Meteor.userId();
      if(currentUser){
        this.layout('appLayout');
        this.next();
      }else{
        this.render('main');
      }
    }
});


Router.route('/calendar',{
    name:'calendar',
    template:'calendar',
    yieldTemplates: {
      '_appHeader': {to: 'header'},
      '_appFooter': {to: 'footer'}
    },
    data: function(){
      var currentUser = Meteor.userId();
    },
    onRun: function(){
      this.next();
    },
    onBeforeAction: function(){
      var currentUser = Meteor.userId();
      if(currentUser){
        this.layout('appLayout');
        this.next();
      }else{
        this.render('main');
      }
    }
});

Router.route('/userprofile',{
    name:'userprofile',
    template:'userprofile',
    yieldTemplates: {
      '_appHeader': {to: 'header'},
      '_appFooter': {to: 'footer'}
    },
    data: function(){
      var currentUser = Meteor.userId();
    },
    onRun: function(){
      this.next();
    },
    onBeforeAction: function(){
      var currentUser = Meteor.userId();
      if(currentUser){
        this.layout('appLayout');
        this.next();
      }else{
        this.render('main');
      }
    }
});


Router.route('/myAnnouncements',{
    name:'myAnnouncements',
    template:'myAnnouncements',
    yieldTemplates: {
      '_appHeader': {to: 'header'},
      '_appFooter': {to: 'footer'}
    },
    data: function(){
      var currentUser = Meteor.userId();
    },
    onRun: function(){
      this.next();
    },
    onBeforeAction: function(){
      var currentUser = Meteor.userId();
      if(currentUser){
        this.layout('appLayout');
        this.next();
      }else{
        this.render('main');
      }
    }
});

Router.route('/myMiscPosts',{
    name:'myMiscPosts',
    template:'myMiscPosts',
    yieldTemplates: {
      '_appHeader': {to: 'header'},
      '_appFooter': {to: 'footer'}
    },
    data: function(){
      var currentUser = Meteor.userId();
    },
    onRun: function(){
      this.next();
    },
    onBeforeAction: function(){
      var currentUser = Meteor.userId();
      if(currentUser){
        this.layout('appLayout');
        this.next();
      }else{
        this.render('main');
      }
    }
});

Router.route('/search',{
    name:'search',
    template:'search',
    yieldTemplates: {
      '_appHeader': {to: 'header'},
      '_appFooter': {to: 'footer'}
    },
    data: function(){
      var currentUser = Meteor.userId();
    },
    onRun: function(){
      this.next();
    },
    onBeforeAction: function(){
      var currentUser = Meteor.userId();
      if(currentUser){
        this.layout('appLayout');
        this.next();
      }else{
        this.render('main');
      }
    },
    waitOn: function(){
      return Meteor.subscribe('getEvents');
    },
    fastRender: true
});
