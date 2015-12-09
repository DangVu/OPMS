var app = app || {};
(function($) {
  // 'use strict';
  app.UpdateSkill = Backbone.View.extend ({
    menuTemp: JST["backbone/templates/menu"],
    template: JST["backbone/templates/updateSkill"],

    initialize: function() {
      this.render();
      // this.show();
    },

    render: function() {
      this.$el.append(this.menuTemp);
      this.$el.append(this.template);
      var skill1Id = this.id;
      this.listLangugeAjax(skill1Id);
    },

    cleanup: function() {
      this.undelegateEvents();
      $(this.el).empty();
    },

    events: {
      'click #addSkillLv2Bt': function(){
        if($($('.skill2').get($('.skill2').length-1)).val() != "") {
          var temp = _.template($('#skill2Temp').html());
          $('#skillLv2').append(temp);
        }
      },
      'click #updateSkillBt': function(){
        this.update();
      },
    },

    listLangugeAjax: function(skill1Id) {
      $.ajax({
        type: "GET",
        url: "api/v1/list_skill_level2_in_skill_level1s/"+skill1Id,
        success: function(xhr) {
          console.log(xhr);
          var temp = _.template($('#skill2Temp').html());
          var skillLv2Arr = [];
          var skillLv2IdArr = [];
          $('#skill1').val(xhr['skillLv1']);
          for(var i=0, len=xhr['listSkillLevel2'].length; i<len; i++){
            $('#skillLv2').append(temp);
            skillLv2Arr.push(xhr['listSkillLevel2'][i]['skillLv2Name']);
            skillLv2IdArr.push(xhr['listSkillLevel2'][i]['skillLv2Id'])
          }
          console.log(skillLv2Arr);
          $('.skill2').each(function(index) {
            var $skill2Name = $(this);
            $skill2Name.val(skillLv2Arr[index]);
            $skill2Name.attr("skill2Id", skillLv2IdArr[index]);
          })
        },
        error: function () {
        },
      });
    },

    update:function() {
      // this.model.set('name', $('#name').val().trim());
      // this.model.set('startDate', $('#startDate').val());
      var skillLv1 = $('#skill1').val().trim();
      var skillLv2Arr = [];
      var skill;
      var skill1Id = this.id;
      $('.skill2').each(function(){
        var $this = $(this);
        skillLv2Arr.push({
          "name": $this.val().trim(),
          "id": $this.attr("skill2Id"),
        });
      })

      skill = {
        "skill": skillLv1,
        "skill_level2s": skillLv2Arr
      }
      console.log(skill1Id, skill);
      // this.callAjax(skill1Id, skill);
    },

    callAjax: function (skill1Id, skill) {
      $.ajax({
        type: "POST",
        url: "/api/v1/skill_level1s/" + skill1Id,
        data: JSON.stringify({ skill }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function() {
          // this.createLink();
          alert("successfully");
        },
        error: function (error) {

        }
      });
    }

  });
})(jQuery);
