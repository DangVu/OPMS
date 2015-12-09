var app = app || {};

(function (){
  'use strict';
  app.Project = Backbone.Model.extend({
    validation: {
      name: {
        required: true,
        msg: 'Input project name'
      },
      startDate: {
        required: true
      },
      dueDate: {
        required: true
      }
    }
  });
})();
