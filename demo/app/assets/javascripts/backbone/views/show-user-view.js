var app = app || {};
(function($) {
  // 'use strict';
  app.ShowUser = Backbone.View.extend ({
    menuTemp: JST["backbone/templates/menu"],
    template: JST["backbone/templates/showUser"],

    initialize: function() {
      this.render();
      this.show();
    },

    render: function() {
      this.$el.append(this.menuTemp);
      this.$el.append(this.template);
      $('#startDate').datepicker({
        format: "yyyy-mm-dd"
      });
      this.listLangugeAjax();
    },

    cleanup: function() {
        this.undelegateEvents();
        $(this.el).empty();
    },

    events: {
      "click #updateUserBt": function(e) {
        e.preventDefault();
        this.update();
      },
      "change #startDate": function () {
        this.checkStartDateInput();
      },
      "click #btEdit": function() {
        var temp = _.template($('#slcLanguage').html());
        $('#lang').append(temp);
      },
      "click #ipLang": function(e) {
        // if(e.which === 13) {
          $("#ipLang").addClass("hidden");
          $(".cbLanguages").removeClass("hidden");
        // }
      },
      "click #btRemove": function(e) {
        $(e.currentTarget).closest('div').remove();
      }
    },

    checkStartDateInput: function() {
      var startDate = new Date($('#startDate').val());
      var dueDate = new Date($('#dueDate').val());
      if ($('#dueDate').val() !== "") {
        if (startDate > dueDate) {
          $('#startDate').val($('#dueDate').val());
        }
      }
    },

    listLangugeAjax: function() {
      $.ajax({
        type: "GET",
        url: "api/v1/languages/",
        success: function(xhr) {
          var temp = _.template($('#language').html());
          var languageArr = [];
          for(var i=0, len=xhr.length; i<len; i++) {
            $('.cbLanguages').append(temp);
            languageArr.push(xhr[i].language);
          }
          $('.cbLanguage').each(function(index){
            var $this = $(this);
            $this.attr("id", languageArr[index]);
            $this.attr("value", languageArr[index]);
          });
          $('.lbLanguage').each(function(index){
            var $this = $(this);
            $this.attr("for", languageArr[index]);
            $this.html(languageArr[index]);
          });
        },
        error: function () {
        }
      });
    },

    update:function() {
      this.model.set('name', $('#name').val().trim());
      this.model.set('startDate', $('#startDate').val());
      var objAjax = {
        "type": "POST",
        "function": "update"
      };
      var userID = $("#userId").val();
      var langArr = [];
      $('.cbLanguage').each(function() {
        var $this = $(this);

        if ($this.prop("checked") === true) {
          langArr.push($this.val());
        }
      });
      var user = {
        "name": $("#name").val().trim(),
        "department": $("#department").val().trim(),
        "language": langArr,
        "startDate": $('#startDate').val()
      };
      // console.log($("#ipLang").val());
      // if($('.slLang').val() === "") {
      //   user["language"] = $("#ipLang").val();
      // }
      // console.log(user);
      this.callAjax(objAjax, userID, this.createLink, user);
    },

    createLink: function() {
      var linkShow = "<a href='#listuser' id='showUsFrLg'>show</a>";
      $(".show_user").append(linkShow);
      $("#showUsFrLg")[0].click();
    },

    show: function() {
      var objAjax = {
        "type": "GET",
        "function": "show"
        };
      var userID = "";
      userID = this.id;
      this.callAjax(objAjax,userID);
    },

    callAjax: function(objAjax, userID , createLink, user) {
      $.ajax({
        type: objAjax['type'],
        url: "/api/v1/users/" + userID,
        data: JSON.stringify({ user }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(xhr) {
          if (objAjax["function"] === "show") {
            $('#userId').val(xhr['_id']['$oid']);
            $('#name').val(xhr.name);
            $('#department').val(xhr.department);
            $('#ipLang').val(xhr.language);
            $('#startDate').val(xhr.startDate);
          }else {
            createLink();
          }
        },
        error: function (error) {
          if (JSON.parse(error['responseText'])['errors'][0]['code'] === 432) {
            $('#nameEr').html("Name is already taken").removeClass('hidden');
          }else if (JSON.parse(error['responseText'])['errors'][0]['code'] === 430) {
            $('#nameEr').html("Name can't be blank").removeClass('hidden');
          }
        },
      });
    }

  });
})(jQuery);
