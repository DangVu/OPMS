var app = app || {};
(function($) {
  app.AddMembers = Backbone.View.extend ({
    menuTemp: JST["backbone/templates/menu"],
    template: JST["backbone/templates/addMembers"],

    initialize: function() {
      this.render();
      Backbone.Validation.bind(this);
      var proID = this.id;
      // this.memNoProjectAjax(this.$("#ipsearchNewMember").val(), this.creMemArr());
      this.showProjectMemberAjax(proID, this.memNoProjectAjax, this.creMemArr);
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
      this.listLangugeAjax();
      this.checkDueDateInput(this.id);
    },

    cleanup: function() {
      this.undelegateEvents();
      $(this.el).empty();
    },

    events: {
      "keyup #ipsearchNewMember": "search",
      "click #member-add-submit": function(e) {
        e.preventDefault();
        this.addMembers(e);
      },
      "click .edit": function(e) {
        e.preventDefault();
        this.edit(e);
      },
      "click .cancel": function(e) {
        e.preventDefault();
        $('#member-'+e.currentTarget.id).hide();
        $('#memberRole'+e.currentTarget.id).show();
      },
      "click .delete": function(e) {
        e.preventDefault();
        // var currentTime = new Date();
        // var dd = currentTime.getDate();
        // var mm = currentTime.getMonth() + 1;
        // var yyyy = currentTime.getFullYear();
        // var time = yyyy+"-"+mm+"-"+dd;
        // var memberID =  $(e.currentTarget).attr("dataMember");
        // var memRoleArr = [];
        var member = {
          "memberID": $(e.currentTarget).attr("dataMember"),
          "userID": e.currentTarget.id,
        };
        // memRoleArr.push($("#memberRole"+e.currentTarget.id).text());
        // console.log($("#memberRole"+e.currentTarget.id).text());
        // var member = {
        //   "userID": e.currentTarget.id,
        //   "role": memRoleArr,
        //   "dueDate": time
        // }
        var proID = this.id;
        // console.log(time);
        // this.changeRoleMemAjax(member, memberID, this.showProjectMemberAjax, this.memNoProjectAjax, this.creMemArr, proID);
        this.delMemberAjax(member, proID, this.memNoProjectAjax, this.creMemArr, this.showProjectMemberAjax);
      },
      "change .selectRole": function(e) {
        if($(e.currentTarget).val() === "developer") {
          $(".cbbLangAddMem").removeClass("hidden");
        }else {
          $(".cbbLangAddMem").addClass("hidden");
        }
      },
      "click #saveChange": function(e) {
        e.preventDefault();
        this.changeRoleMem(e);
      },
      "change #dueDate": function (e) {
        this.checkDueDateInput(this.id,e);
      },
      "change #startDate": function (e) {
        this.checkDueDateInput(this.id,e);
      },
      "change .dueDateEdit": function (e) {
        // var dueDate = $(".dueDateEdit").val;
        this.checkDueDateInput(this.id,e);
      }
    },

    edit: function(e) {
      $('#member-'+e.currentTarget.id).show();
      $('#memberRole'+e.currentTarget.id).hide();

      $(".dueDateEdit").datepicker({
        format: "yyyy-mm-dd"
      });
    },

    creMemArr: function(memIdArr) {
      var memArr = [];
      var showMemArr = [];
      $('.memName').each(function() {
        memArr.push($(this).attr('data_id'));
      });
      if (memIdArr === undefined) {
        memIdArr = [];
      }
      showMemArr = memArr.concat(memIdArr);
      return showMemArr;
    },

    search: function() {
      this.memNoProjectAjax(this.$("#ipsearchNewMember").val(), this.creMemArr());
    },

    checkDueDateInput: function(proID, e) {
      $.ajax({
        type: "GET",
        url: "api/v1/projects/"+proID,
        success: function(xhr) {
          if(!e){
            $('#startDate').val(xhr.startDate);
            $('#dueDate').val(xhr.dueDate);
          }else{
            console.log("asdsad");
            var startDate = new Date($('#startDate').val());
            var dueDate = new Date($(e.currentTarget).val());
            if (startDate > dueDate) {
              $(e.currentTarget).val($('#startDate').val());
            }else if (new Date(dueDate) > new Date(xhr.dueDate)){
              $(e.currentTarget).val(xhr.dueDate);
            }else if(new Date(startDate) < new Date(xhr.startDate)) {
              $(e.currentTarget).val(xhr.startDate);
            }
          }
        },
        error: function(error) {
          console.log(error);
        }
      });
    },

    addMembers: function() {
      this.model.set('startDate', $('#startDate').val());
      this.model.set('dueDate', $('#dueDate').val());
      this.model.set('effort', $('#effort').val());
      var memIdArr = [];
      var memNameArr = [];
      var member = {};
      var memInfo = [];
      var roleArr = [];
      var languageArr = [];
      var proID = this.id;
      var effort = $('#effort').val();
      $(".checkboxAddMembers").each(function() {
        var $this = $(this);

        if ($this.prop("checked") === true) {
          memIdArr.push($this.val());
          memNameArr.push($this.attr("userName"));
        }
      });
      $(".cbLanguage").each(function() {
        var $this = $(this);

        if ($this.prop("checked") === true) {
          languageArr.push($this.val());
        }
      });
      roleArr.push($(".selectRole").val());
      for(var i = 0, len = memIdArr.length; i<len; i++){
        memInfo.push(
          {
            "id": memIdArr[i],
            "name": memNameArr[i],
            "role": roleArr,
            "language": languageArr,
            "effort": effort,
            "startDate": $('#startDate').val(),
            "dueDate": $('#dueDate').val()
          })
      }
      var projectMembers = {
        "project_id": this.id,
        "members": memInfo
      };
      console.log(languageArr);
      console.log(projectMembers);
      if (memIdArr.length > 0 && this.model.isValid(true)){
        this.addMembersAjax(projectMembers, proID, this.memNoProjectAjax, this.creMemArr, memIdArr, this.showProjectMemberAjax);
      }else if(memIdArr.length == 0) {
        alert("Choose member");
      }
    },

    listLangugeAjax: function() {
      $.ajax({
        type: "GET",
        url: "api/v1/skill_level1s/",
        success: function(xhr) {
          var temp = _.template($('#language').html());
          var languageArr = [];
          for(var i=0, len=xhr.length; i<len; i++) {
            $('.cbbLangAddMem').append(temp);
            languageArr.push(xhr[i]['skill']);
          }
          $('.cbLanguage').each(function(index){
            var $this = $(this);
            $this.attr("id", languageArr[index]+"-add");
            $this.attr("value", languageArr[index]);
          });
          $('.lbLanguage').each(function(index){
            var $this = $(this);
            $this.attr("for", languageArr[index]+"-add");
            $this.html(languageArr[index]);
          });
        },
        error: function () {
        }
      });
    },

    addMembersAjax: function(member, proID, memNoProjectAjax, creMemArr, memIdArr, showProjectMemberAjax) {
      $.ajax({
        type: "POST",
        url: "/api/v1/members",
        data: JSON.stringify({ member }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function() {
          $(":checkbox").attr('checked', false);
          // $('#dueDate').val("");
          showProjectMemberAjax(proID, memNoProjectAjax, creMemArr, memIdArr);
        },
        error: function(error) {
          console.log(error);
        }
      });
    },



    showProjectMemberAjax: function(proID, memNoProjectAjax, creMemArr, memIdArr) {
      $.ajax({
        type: "GET",
        url: "api/v1/projects/"+proID+"/members",
        success: function(xhr) {
          var showMemArr = [];
          var inputVal = "";
          this.showEle(xhr);
          showMemArr = creMemArr(memIdArr);
          memNoProjectAjax(inputVal, showMemArr);
          this.changeRoleDiv(xhr, showMemArr);
          this.listLangugeAjax();
        },
        error: function(error) {
          console.log(error);
        },
        listLangugeAjax: function() {
          $.ajax({
            type: "GET",
            url: "api/v1/skill_level1s/",
            success: function(xhr) {
              var temp = _.template($('#language').html());
              var languageArr = [];
              for(var i=0, len=xhr.length; i<len; i++) {
                $('.cbLanguagesAddMember').append(temp);
                languageArr.push(xhr[i]['skill']);
              }
              $('.cbLanguagesAddMember').each(function(index) {
                var $div = $(this);
                $div.find('.cbLanguage').each(function(i){
                  var $this = $(this);
                  $this.attr("id", languageArr[i]+'-'+index);
                  $this.attr("value", languageArr[i]);
                });
                $div.find('.lbLanguage').each(function(i){
                  var $this = $(this);
                  $this.attr("for", languageArr[i]+'-'+index);
                  $this.html(languageArr[i]);
                });
              })
              // $('.cbLanguage').each(function(index){
              //   var $this = $(this);
              //   $this.attr("id", languageArr[index]);
              //   $this.attr("value", languageArr[index]);
              // });
             //  $('.lbLanguage').each(function(index){
             //    var $this = $(this);
             //    $this.attr("for", languageArr[index]);
             //    $this.html(languageArr[index]);
             // });
            }
          });
        },
        changeRoleDiv: function(xhr, showMemArr) {
          var temp = _.template($('#newRole').html());
          var memberIDArr = [];
          var dueDateMemArr = [];
          var roleMemArr = [];
          $('.role').append(temp);
          for (var i=0, len=xhr.length; i<len; i++) {
            for (var j=0, leng=Object.keys(xhr[i].members).length; j<leng; j++) {
              memberIDArr.push(xhr[i]._id["$oid"]);
              dueDateMemArr.push(xhr[i]['members'][j]['dueDate']);
              roleMemArr.push(xhr[i]['members'][j]['role']);
            }
          }
          $('.changeRole').each(function(i) {
            var $this = $(this);
            $this.attr('id','member-'+showMemArr[i]);
            $this.attr('data_member', memberIDArr[i]);
          });
          $('.dueDateEdit').each(function(index) {
            $(this).val(dueDateMemArr[index]);
          })
          $('.cancel').each(function(i) {
            $(this).attr('id', showMemArr[i]);
          });
          $('.changeRole').hide();
        },
        showEle: function(xhr) {
          var tdEle = "";
          console.log(xhr);
          if (xhr.length > 0) {
            $(".contentLeftAddMemPage").removeClass("hidden");
            for (var i=0, len=xhr.length; i<len; i++) {
              for (var j=0, leng=xhr[i].members.length; j<leng; j++) {
                tdEle += this.createEle(xhr[i].members[j].id, xhr[i].members[j].name, xhr[i].members[j].role, xhr[i]._id["$oid"], xhr[i].members[j].language);
              }
            }
          }else {
            $(".contentLeftAddMemPage").addClass("hidden");
          }
          $(".bodyTb").html(tdEle);
        },
        createEle: function(id, name, role, memId, language) {
          return ("<tr>" +
                    "<td class='memName' data_id="+id+"><a href='#user/" + id + "'>" + name + "</a></td>"+
                    "<td class='role'><span id='memberRole"+ id +"'>" + role + "</span></td>"+
                    "<td class='language'><span id='memberLanguage"+ id +"'>" + language + "</span></td>"+
                    "<td><a href='#' class='btfunction edit' id='"+ id +"'>Edit</a>"+
                        "<a href='#' class='btfunction delete' id='"+ id +"' dataMember='"+ memId +"'>Delete</a></td>"+
                  "</tr>");
        }
      });
    },

    memNoProjectAjax: function(inputVal, showMemArr) {
      $.ajax({
        type: "GET",
        url: "api/v1/users/",
        success: function(xhr) {
          var newResponse;
          newResponse = this.chooseMember(xhr);
          this.showEle(newResponse);
        },
        error: function(error) {
          console.log(error);
        },
        chooseMember: function(xhr) {
          var newResponse;
          newResponse = xhr.filter(function(item) {
            if(showMemArr.indexOf(item._id["$oid"].toString()) === -1) {
              return true;
            }
            return false;
          });
          return newResponse;
        },
        showEle:function(newResponse) {
          var liEle = "";
          for (var i=0, len=newResponse.length; i<len; i++) {
            if (inputVal === null) {
              liEle += this.createEle(newResponse[i]._id["$oid"], newResponse[i].name);
            }else {
              if (newResponse[i].name.indexOf(inputVal) > -1) {
                liEle += this.createEle(newResponse[i]._id["$oid"], newResponse[i].name);
              }
            }
          }
          $("#listNewMembers").html(liEle);
        },
        createEle: function(id, name) {
          return ("<label class='showNewMembers'><input class='checkboxAddMembers' type='checkbox' value='" +
                    id + "' userName='"+name+"'>"+name +"</label>");
        }
      });
    },

    delMemberAjax: function(member, proID, memNoProjectAjax, creMemArr, showProjectMemberAjax) {
      $.ajax({
        type: "POST",
        url: "/api/v1/members/"+member["memberID"]+"/users/" +member["userID"],
        data: JSON.stringify({ member }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(xhr) {
          showProjectMemberAjax(proID, memNoProjectAjax, creMemArr);
        },
        error: function(error) {
          console.log(error);
        }
      });
    },

    changeRoleMem: function(e) {
      var $buttonEle = $(e.currentTarget);
      var $divEle = $buttonEle.closest("div");
      var $checkboxRole = $divEle.find(".checkboxAddMembers");
      var $checkboxLangugage = $divEle.find(".cbLanguage");
      var $dueDateInput = $divEle.find(".dueDateEdit");
      var memRoleArr = [];
      var memLanguageArr = [];
      var memberID = $divEle.attr("data_member");
      var proID = this.id;
      $checkboxRole.each(function() {
        var $this = $(this);

        if ($this.prop("checked") === true) {
          memRoleArr.push($this.val());
        }
      });
      $checkboxLangugage.each(function() {
        var $this = $(this);

        if ($this.prop("checked") === true) {
          memLanguageArr.push($this.val());
        }
      });
      var member = {
        "userID": $divEle.attr("id").slice(7,31),
        "role": memRoleArr,
        // "language": memLanguageArr,
        "dueDate": $dueDateInput.val()
      };
      // console.log(member);
      if(memRoleArr.length >0) {
        this.changeRoleMemAjax(member, memberID, this.showProjectMemberAjax, this.memNoProjectAjax, this.creMemArr, proID);
      }else {
        alert("Choose role")
      }
    },

    changeRoleMemAjax: function(member, memberID, showProjectMemberAjax, memNoProjectAjax, creMemArr, proID) {
      $.ajax({
        type: "POST",
        url: "/api/v1/members/"+memberID,
        data: JSON.stringify({ member }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(xhr) {
          // var memIdArr = [];
          // console.log(proID);
          showProjectMemberAjax(proID, memNoProjectAjax, creMemArr);
        },
        error: function(error) {
          console.log(error);
        }
      });
    },
  });
})(jQuery);
