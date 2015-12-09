var app = app || {};

(function (){
  'use strict';
  app.Member = Backbone.Model.extend({
    validation: {
      startDate: {
        required: true
      },
      dueDate: {
        required: true
      },
      effort: {
        range: [1, 100]
      }
    }
  });
})();
