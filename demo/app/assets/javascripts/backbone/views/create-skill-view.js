var app = app || {};
(function ($) {
  // 'use strict';
  app.CreateSkillView = Backbone.View.extend ({
    menuTemp: JST["backbone/templates/menu"],
    template: JST["backbone/templates/createSkill"],

    initialize: function() {
      this.render();
      Backbone.Validation.bind(this);
    },

    render: function() {
      this.$el.append(this.menuTemp);
      this.$el.append(this.template);
    },

    cleanup: function() {
        this.undelegateEvents();
        $(this.el).empty();
    },

    events: {
      "click #createSkillBt": function (e) {
        e.preventDefault();
        this.createSkill();
      },
      "click #addFWBt": function(e) {
        var temp = _.template($('#frameWorkTemp').html());
        $('div.input_info').append(temp);
      },
      "click #removeFWBt": function(e) {
        var $div = $($(e.currentTarget).parent());
        $div.remove();
      }
    },

    createSkill: function () {
      this.model.set('name', $('#name').val().trim());
      var skill_level1;
      var skillLevel2Arr = [];
      $('.frameWork').each(function() {
        var $this = $(this);
        if($this.val().length > 0) {
          skillLevel2Arr.push($this.val());
        }
      });
      skill_level1 = {
          "skill": $('#name').val().trim(),
          "skill_level2s": skillLevel2Arr
      };
      // console.log(skill);
      if(this.model.isValid(true)) {
        this.sendRequest(skill_level1);
      }
    },

    sendRequest: function (skill_level1) {
      $.ajax({
        type: "POST",
        url: "/api/v1/skill_level1s",
        data: JSON.stringify({ skill_level1 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function() {
          // this.createLink();
          alert("successfully");
        },
        error: function (error) {
          console.log(error);
          if (JSON.parse(error["responseText"])["errors"][0]["code"] === 451) {
            $('#nameEr').html("Skill is already taken").removeClass('hidden');
          }
          if (JSON.parse(error["responseText"])["errors"][0]["code"] === 450) {
            $('#nameEr').html("Skill can't be blank").removeClass('hidden');
          }
        },
        createLink: function() {
          var linkShow = "<a href='#listuser' id='showUsFrLg'>show</a>";
          $(".create_skill").append(linkShow);
          $("#showUsFrLg")[0].click();
        }
      });
    }
  });
})(jQuery);
