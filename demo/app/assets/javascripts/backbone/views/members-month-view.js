var app = app || {};

(function($) {
  app.MembersMonthView = Backbone.View.extend({
    template: JST["backbone/templates/membersMonth"],

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template);
      console.log(this.id.slice(0,24));

      var projectEffortsId = this.id.slice(0,24);
      var time = this.id.slice(24)
      console.log(projectEffortsId+"-"+time);
      this.showMonthMemAjax(projectEffortsId, time);
    },

    cleanup: function() {
      this.undelegateEvents();
      $(this.el).empty();
    },

    events: {
    },

    showMonthMemAjax: function(projectEffortsId, time) {
      $.ajax({
        type: "GET",
        url: "/api/v1/project_efforts/"+projectEffortsId+"/month/"+time,
        success: function(xhr) {
          console.log(xhr);
        },
        error:function(error) {
          console.log(error);
        }
      });
    }
  });
})(jQuery);
