var app = app || {};

(function ($) {
  'use strict';

  app.ListProjectView = Backbone.View.extend({
    menuTemp: JST["backbone/templates/menu"],
    view: JST["backbone/templates/listProject"],
    template: '',
    initialize: function() {
      this.render();
      this.listUser();
    },

    render: function() {
      this.$el.append(this.menuTemp);
      this.$el.append(this.view);
    },

    cleanup: function() {
        this.undelegateEvents();
        $(this.el).empty();
    },

    listUser: function() {
      $.ajax({
        type: "GET",
        url: "api/v1/projects/",
        success: function(xhr) {
          this.createTdEle(xhr);
          this.setColorStt();
        },
        error: function () {
        },
        createTdEle: function(xhr) {
          var tdEle = "";
          for(var i=0, len=xhr.length; i<len; i++) {
            var id = i+1;

            tdEle +=  "<tr>" +
                          "<td>" + id + "</td>"+
                          "<td><a href='#project/" + xhr[i]._id["$oid"] + "'>" + xhr[i].name + "</a></td>"+
                          "<td>" + xhr[i].description + "</td>"+
                          "<td>" + xhr[i].startDate + "</td>"+
                          "<td>" + xhr[i].dueDate + "</td>"+
                          "<td class='status'>" + xhr[i].status + "</td>"+
                      "</tr>";
          }
          $(".bodyTb").html(tdEle);

        },
        setColorStt:function() {
          $(".status").each(function() {
            if($(this).text() === "working") {
              $(this).css("color", "#cbd007");
            }else if($(this).text() === "done") {
              $(this).css("color", "green");
            }
          });
        }
      });
    }
  });
})(jQuery);
