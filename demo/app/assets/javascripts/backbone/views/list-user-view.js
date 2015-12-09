var app = app || {};

(function ($) {
  'use strict';

  app.ListUserView = Backbone.View.extend({
    menuTemp: JST["backbone/templates/menu"],
    view: JST["backbone/templates/listUsers"],

    initialize: function() {
      this.render();
      var ajax = {
        "type": "GET",
        "url": "api/v1/users/"
      }
      this.searchUserAjax(ajax);
    },

    render: function() {
      this.$el.append(this.menuTemp);
      this.$el.append(this.view);
      this.listLangugeAjax();
    },

    cleanup: function() {
        this.undelegateEvents();
        $(this.el).empty();
    },

    events: {
      "click #searchUserBt": function(e){
        e.preventDefault();
        this.searchUser();
      }
    },

    searchUser: function() {
      var ajax = {
        "type": "POST",
        "url": "api/v1/search"
      }
      var searchInfo = {
        "name":  $(".ipSearchVal").val(),
        "department": $(".slDepartment").val(),
        "language": $(".slLang").val(),
        // "status": $(".slStatus").val(),
        "exp": $(".slExp").val()
      };
      // console.log(ajax);
      this.searchUserAjax(ajax, searchInfo);
    },

    searchUserAjax: function(ajax, searchInfo) {
      $.ajax({
        type: ajax["type"],
        url: ajax["url"],
        data: JSON.stringify({ searchInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(xhr) {
          if(xhr.length === 0) {
            alert("User doesn't exist");
            console.log(xhr);
          }
          for(var i=0, len=xhr.length; i<len; i++) {
            var id = i+1;
            var tdEle;
            tdEle +=  "<tr>"+
                          "<td>"+ id + "</td>"+
                          "<td><a href='#user/"+xhr[i]._id["$oid"]+"'>"+ xhr[i].name + "</a></td>"+
                          "<td>"+ xhr[i].department + "</td>"+
                          "<td>"+ xhr[i].skills + "</td>"+
                          "<td>"+ xhr[i].startDate + "</td>"+
                      "</tr>";
          }
          $(".bodyTb").html(tdEle);
        },
        error: function(error) {
        }
      });
    },

    listLangugeAjax: function() {
      $.ajax({
        type: "GET",
        url: "api/v1/skill_level1s/",
        success: function(xhr) {
          var temp = _.template($('#languages').html());
          var languageArr = [];
          for(var i=0, len=xhr.length; i<len; i++) {
            $('.slLang').append(temp);
            languageArr.push(xhr[i]["skill"]);
          }
          $('.languageOption').each(function(index){
            var $this = $(this);
            $this.html(languageArr[index]);
            $this.attr("value", languageArr[index]);
          })
        },
        error: function () {
        }
      });
    }
  });
})(jQuery);
