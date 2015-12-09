var app = app || {};
(function($) {
  // 'use strict';
  app.ShowProject = Backbone.View.extend ({
    menuTemp: JST["backbone/templates/menu"],
    template: JST["backbone/templates/showProject"],

    initialize: function() {
      this.render();
      Backbone.Validation.bind(this);
      this.show();
    },

    render: function() {
      this.$el.append(this.menuTemp);
      this.$el.append(this.template);
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
      "click #updateProjectBt": function(e){
        e.preventDefault();
        this.update();
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
      var startDate = new Date($('#startDate').val()),
          dueDate = new Date($('#dueDate').val());
      if (startDate > dueDate) {
        $('#startDate').val($('#dueDate').val());
      }
    },

    update:function() {
      this.model.set('name', $('#name').val().trim());
      this.model.set('startDate', $('#startDate').val());
      this.model.set('dueDate', $('#dueDate').val());
      var objAjax = {
        "type": "POST",
        "function": "update"
        },
        projectID = $("#projectId").val(),
        project = {
          "name": $('#name').val().trim(),
          "description": $('#description').val().trim(),
          "startDate": new Date($('#startDate').val()),
          "dueDate": new Date($('#dueDate').val()),
          "status": $('select').val()
        };
      if(this.model.isValid(true)) {
          this.callAjax(objAjax, projectID, this.createLink, project);
      }
    },

    createLink: function() {
      var linkShow = "<a href='#listproject' id='showPrFrLg'>show</a>";
      $(".show_project").append(linkShow);
      $("#showPrFrLg")[0].click();
    },

    show: function() {
      var objAjax = {
        "type": "GET",
        "function": "show"
        },
        projectID = this.id;
      this.callAjax(objAjax,projectID);
    },

    callAjax: function(objAjax, projectID, createLink, project) {
      $.ajax({
        type: objAjax['type'],
        url: "/api/v1/projects/" + projectID,
        data: JSON.stringify({ project }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(xhr) {
          if (objAjax["function"] === "show") {
            $('#projectId').val(xhr['_id']['$oid']);
            $('#name').val(xhr.name);
            $('#description').val(xhr.description);
            $('#startDate').val(xhr.startDate);
            $('#dueDate').val(xhr.dueDate);
            $('#status').val(xhr.status);
            $("#addUserPage").attr("href", "#project/members/"+xhr['_id']['$oid']);
          }else {
            createLink();
          }
        },
        error: function (error) {
          if (JSON.parse(error['responseText'])['errors'][0]['code'] === 432) {
            $('#nameEr').html("Name is already taken").removeClass('hidden');
          }
        },
      });
    }
  });
})(jQuery);
