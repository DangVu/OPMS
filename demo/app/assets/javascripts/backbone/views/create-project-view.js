var app = app || {};
(function ($) {
  // 'use strict';
  app.CreateProjectView = Backbone.View.extend ({
    template: JST["backbone/templates/createProject"],
    menuTemp: JST["backbone/templates/menu"],

    initialize: function() {
      this.render();
      Backbone.Validation.bind(this);
    },

    render: function() {
      this.$el.append(this.template);
      this.$el.append(this.menuTemp);
      $('#startDate').datepicker({
        format: "yyyy-mm-dd"
      });

      $('#dueDate').datepicker({
          format: "yyyy-mm-dd"
      });
    },

    cleanup: function() {
        this.undelegateEvents();
        $(this.el).empty();
    },

    events: {
      "click #createProjectBt": function (e) {
        e.preventDefault();
        this.createProject();
      },
      "change #startDate": function () {
        this.checkStartDateInput();
      },
      "change #dueDate": function () {
        this.checkDueDateInput();
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

    checkDueDateInput: function() {
      var startDate = new Date($('#startDate').val());
      var dueDate = new Date($('#dueDate').val());
      if (startDate > dueDate) {
        $('#startDate').val($('#dueDate').val());
      }
    },

    createProject: function() {
      this.model.set('name', $('#name').val().trim());
      this.model.set('startDate', $('#startDate').val());
      this.model.set('dueDate', $('#dueDate').val());
      var project = {
        "name": $('#name').val().trim(),
        "description": $('#description').val().trim(),
        "startDate": $('#startDate').val(),
        "dueDate": $('#dueDate').val(),
        "status": $('select').val()
      };
      // console.log(project);
      if(this.model.isValid(true)) {
        this.sendRequest(project);
      }
    },

    sendRequest: function (project) {
      $.ajax({
        type: "POST",
        url: "/api/v1/projects",
        data: JSON.stringify({ project }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function() {
          this.createLink();
        },
        error: function (error) {
          if (JSON.parse(error['responseText'])['errors'][0]['code'] === 432) {
            $('#nameEr').html("Name is already taken").removeClass('hidden');
          }
        },
        createLink: function() {
          var linkShow = "<a href='#listproject' id='showPrFrLg'>show</a>";
          $(".create_project").append(linkShow);
          $("#showPrFrLg")[0].click();
        }
      });
    }
  });
})(jQuery);
