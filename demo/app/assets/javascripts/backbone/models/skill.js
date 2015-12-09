var app = app || {};

(function (){
  'use strict';
  app.Skill = Backbone.Model.extend({
    validation: {
      name: {
        required: true,
        msg: 'Input name'
      }
    }
  });
})();
