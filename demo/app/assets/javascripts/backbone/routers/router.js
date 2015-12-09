var app = app || {};

$(function () {
  'use strict';

  var lastView;
  var DemoRouter = Backbone.Router.extend({

    routes: {
      '': 'login',
      'listuser': 'listUser',
      'createuser': 'createUser',
      'user/:id': 'showUser',
      'listproject': 'listProject',
      'createproject': 'createProject',
      'project/:id': 'showProject',
      'project/members/:id': 'addMembers',
      'promembers': 'projectMember',
      'createskill': 'createSkill',
      'projectdetail/:id': 'projectDetail',
      'listlanguage': 'listLanguage',
      'skill/:id': 'editSkill',
      '*other': 'defaultRoute'
    },

    login: function() {
      var appView = new app.LoginView({
        el: 'body',
        model: new app.User()
      });
    },

    listUser: function() {
      this.clean(lastView);
      lastView = new app.ListUserView({
        el: 'body'
      });
    },

    createUser: function() {
      this.clean(lastView);
      lastView = new app.CreateUserView({
        el: 'body',
        model: new app.User()
      });
    },

    showUser: function(id) {
      this.clean(lastView);
      lastView = new app.ShowUser({
        el: 'body',
        id: id,
        model: new app.User()
      });
    },

    listProject: function() {
      this.clean(lastView);
      lastView = new app.ListProjectView({
        el: 'body'
      });
    },

    createProject: function() {
      this.clean(lastView);
      lastView = new app.CreateProjectView({
        el: 'body',
        model: new app.Project()
      });
    },

    showProject: function(id) {
      this.clean(lastView);
      lastView = new app.ShowProject({
        el: 'body',
        model: new app.Project(),
        id
      });
    },

    addMembers: function(id) {
      this.clean(lastView);
      lastView = new app.AddMembers({
        el: 'body',
        model: new app.Member(),
        id
      });
    },

    projectMember: function(id) {
      this.clean(lastView);
      lastView = new app.ProjectMemberView({
        el: 'body'
      });
    },

    createSkill: function() {
      this.clean(lastView);
      lastView = new app.CreateSkillView({
        el: 'body',
        model: new app.Skill(),
      });
    },

    projectDetail:function(id) {
      this.clean(lastView);
      lastView = new app.ProjectDetailView({
        el: 'body',
        id
      });
    },

    listLanguage:function() {
      this.clean(lastView);
      lastView = new app.ListLanguageView({
        el: 'body'
      });
    },

    editSkill:function(id) {
      this.clean(lastView);
      lastView = new app.UpdateSkill({
        el: 'body',
        id
      });
    },

    clean: function(lastView) {
      if (lastView) {
        lastView.cleanup();
      }
    },

    defaultRoute: function(other) {
      alert('Page not found')
    }
  });

  app.DemoRouter = new DemoRouter();
  Backbone.history.start();
});
