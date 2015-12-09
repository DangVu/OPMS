var app = app || {};

(function () {
  'use strict';

  app.demos = Backbone.Collection.extend({
    model: app.User,
    url: 'api/v1/users',
    parse: function(resp) {
      // console.log("users", resp);
      return resp;
    }
  });
  // app.demos = new Demos();
})();
