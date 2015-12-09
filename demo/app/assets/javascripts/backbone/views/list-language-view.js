var app = app || {};

(function ($) {
  'use strict';

  app.ListLanguageView = Backbone.View.extend({
    menuTemp: JST["backbone/templates/menu"],
    view: JST["backbone/templates/listLanguage"],
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
        url: "api/v1/list_skill_level2_in_skill_level1s",
        success: function(xhr) {
          this.createTdEle(xhr);
        },
        error: function () {
        },
        createTdEle: function(xhr) {
          var tdEle = "";
          console.log(xhr);
          var skillLv2 = [];
          for(var i=0, len=xhr.length; i<len; i++) {
            var id = i+1;
            for(var j=0, leng=xhr[i]["listSkillLevel2"].length; j<leng;j++){
              skillLv2.push(xhr[i]["listSkillLevel2"][j]['skillLv2Name']);
            }
            tdEle +=  "<tr>" +
                            "<td>" + id + "</td>"+
                            "<td><a href='#skill/" + xhr[i]["skillLv1Id"] + "'>" + xhr[i]["skillLv1"] + "</a></td>"+
                            "<td>" + skillLv2.join("<br>") + "</td>"+
                        "</tr>";
            skillLv2 = [];
          }
          $(".bodyTb").html(tdEle);

        }
      });
    }
  });
})(jQuery);
