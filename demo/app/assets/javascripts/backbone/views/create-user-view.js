var app = app || {};
(function ($) {
  // 'use strict';
  app.CreateUserView = Backbone.View.extend ({
    menuTemp: JST["backbone/templates/menu"],
    template: JST["backbone/templates/createUser"],
    skillForm: JST["backbone/templates/skillFormCreateUser"],
    skillLv2Form: JST["backbone/templates/skillLv2Form"],

    initialize: function() {
      this.render();
      Backbone.Validation.bind(this);
    },

    render: function() {
      this.$el.append(this.menuTemp);
      this.$el.append(this.template);
      $('.allSkillDiv').append(this.skillForm);
      $('#startDate').datepicker({
        format: "yyyy-mm-dd"
      });
      this.listSkill1Ajax();
    },

    cleanup: function() {
        this.undelegateEvents();
        $(this.el).empty();
    },

    events: {
      "click #createUserBt": function (e) {
        e.preventDefault();
        this.createUser();
      },
      "change #startDate": function () {
        this.checkStartDateInput();
      },
     "click #removeFWBt": function(e) {
        var $div = $($(e.currentTarget).parent());
        $div.remove();
      },
      'click #addSkillLv1Bt': function(e){
        var temp = _.template($('#removeBtTemp').html());
        // var skillDiv = $('.skillDiv').html();
        $('.allSkillDiv').append(this.skillForm);
        $($('.skillDiv').get($('.cbbSkills').length-1)).append(temp);
        this.listSkill1Ajax();
      },
      'click #addSkillLv2Bt': function(e){
        var $this = $(e.currentTarget);
        var $parent = $($this.parent());
        console.log($($($($parent).parents('.skillDiv')).find('.slSkill1s')).val());
        var $slSkill1 = $($parent.find('.slSkill1s'));
        $parent.append(this.skillLv2Form);
        this.listSkill2Ajax($($($($parent).parents('.skillDiv')).find('.slSkill1s')).val(), e);
      },
      'change .slSkill1s': function(e) {
        var $this = $(e.currentTarget);
        var $parent = $($this).parent();
        var $inputExpLv1 = $($parent).find('.expText');
        $inputExpLv1.attr('data-skill',$this.val());
        var $select = $($parent).find('.slSkill2s');
        var $option = $($parent).find('.skill2Op');
        $option.remove();
        skill1Id = $this.val();
        this.listSkill2Ajax(skill1Id, e);
      },
      'change .slSkill2s': function(e) {
        var $this = $(e.currentTarget);
        var $parent = $($this).parent();
        var $input = $($parent).find('.expTextLv2');
        $input.attr('data-skillLv2',$this.val());
      }
    },

    listSkill2Ajax:function(skill1Id, e) {
      $.ajax({
        type: "GET",
        url: "api/v1/skill_level1s/"+skill1Id+"/skill_level2s",
        success: function(xhr) {
          var $parent = $($(e.currentTarget)).parents('.skillDiv');
          var $input = $($parent).find('.expText');
          var $select = $($parent).find('.slSkill2s');
          var skillLv2Arr = ["Choose"];
          var temp = _.template($('#skill2OpTemp').html());
          var skillIdLv2Arr = [" "];
          for(var i=0, len=xhr.length; i<len; i++) {
            skillLv2Arr.push(xhr[i]['skill2']);
            skillIdLv2Arr.push(xhr[i]["_id"]["$oid"])
          }
          $($select).each(function() {
            var $this = $(this)
            for(var i=0, len=xhr.length; i<=len; i++) {
              $this.append(temp);
            }
            $this.find('.skill2Op').each(function(index) {
              var $option = $(this);
              $option.attr("id", skillLv2Arr[index]);
              $option.attr("value", skillIdLv2Arr[index]);
              $option.html(skillLv2Arr[index]);
            })
          });
          $(".skill2Op").each(function(){
            if($(this).val() == "")
              $(this).remove();
          });
        },
        error: function () {
        }
      });
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

    createUser: function() {
      this.model.set('name', $('#name').val().trim());
      this.model.set('password', $('#password').val().trim());
      this.model.set('startDate', $('#startDate').val().trim());
      var langArr = [];
      var skillInventoryArr = [];
      var allSkill = [];
      var skill1NameArr = [];
      $('.skillDiv').each(function() {
        var $this = $(this);
        var skill2Arr = [];
        var skill;

        $($this.find('.expTextLv2')).each(function() {
          var $expSkill2 = $(this);
          skill2Arr.push({
            "skill2Id": $expSkill2.attr('data-skilllv2'),
            "exp": $expSkill2.val(),
          })
        });

        $($this.find('.expText')).each(function() {
          var $expSkill1 = $(this);
          skill = {
            "skill1Id": $expSkill1.attr('data-skill'),
            "exp": $expSkill1.val(),
            "skill2s": skill2Arr,
          };
        });
        $($this.find('.slSkill1s')).each(function() {
          var $skill1Name = $(this);
          skill1NameArr.push($($skill1Name).find('option:selected').text());
        })
        allSkill.push(skill);
      });

      // console.log(skill1NameArr);
      // console.log(skill1Name);

      var user = {
        "name": $('#name').val().trim(),
        "password": $('#password').val().trim(),
        "department": $('#department').val(),
        "skillInventory": allSkill,
        "startDate": $('#startDate').val(),
        "skills": skill1NameArr
      };
      console.log(user);
      if(this.model.isValid(true)) {
        this.sendRequest(user);
      }
    },

    listSkill1Ajax: function() {
      $.ajax({
        type: "GET",
        url: "api/v1/skill_level1s/",
        success: function(xhr) {
          // var temp = _.template($('#language').html());
          var tempOp = _.template($('#skill1OpTemp').html());
          var $skillDiv = $($('.slSkill1s').get($('.slSkill1s').length-1))
          var skillLv1Arr = [];
          var skillIdLv1Arr = [];
          for(var i=0, len=xhr.length; i<len; i++) {
            $skillDiv.append(tempOp);
            skillLv1Arr.push(xhr[i].skill);
            skillIdLv1Arr.push(xhr[i]["_id"]["$oid"]);
          }
          $skillDiv.find('.skill1Op').each(function(index){
            var $this = $(this);
            $this.attr("id", skillLv1Arr[index]);
            $this.attr("value", skillIdLv1Arr[index]);
            $this.html(skillLv1Arr[index]);
          });
        },
        error: function () {
        }
      });
    },

    sendRequest: function (user) {
      $.ajax({
        type: "POST",
        url: "/api/v1/users",
        data: JSON.stringify({ user }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function() {
          this.createLink();
        },
        error: function (error) {
          console.log(error);
          if (JSON.parse(error["responseText"])["errors"][0]["code"] === 432) {
            $('#nameEr').html("Name is already taken").removeClass('hidden');
          }
        },
        createLink: function() {
          var linkShow = "<a href='#listuser' id='showUsFrLg'>show</a>";
          $(".create_user").append(linkShow);
          $("#showUsFrLg")[0].click();
        }
      });
    }
  });
})(jQuery);
