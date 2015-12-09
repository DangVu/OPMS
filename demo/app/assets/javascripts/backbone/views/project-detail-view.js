var app = app || {};

(function($) {
  app.ProjectDetailView = Backbone.View.extend({
    menuTemp: JST["backbone/templates/menu"],
    template: JST["backbone/templates/projectDetail"],

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.append(this.menuTemp);
      this.$el.append(this.template);
      // var today = new Date();
      // var previous = new Date(today.setMonth(today.getMonth() - 2, 1));
      // var next = new Date(today.setMonth(today.getMonth() + 7, 1));
      // this.projectAjax(this.showGantt);
      var projectID = this.id;
      this.showGanttAjax(projectID,this.showTableGanttAjax);
    },

    cleanup: function() {
      this.undelegateEvents();
      $(this.el).empty();
    },

    events: {
    },

    showGanttAjax: function(projectID,showTableGanttAjax) {
      $.ajax({
        type: "GET",
        url: "/api/v1/projects/"+projectID,
        success: function(xhr) {
          var stDate = new Date(xhr.startDate);
          var endDate = new Date(xhr.dueDate);
          var months = this.monthDiff(stDate, endDate);
          var monthArr = [];
          var yearArr = [];
          var month = stDate.getMonth();
          var year = stDate.getFullYear();
          var temp = _.template($('#ganttTemp').html());
          var tempNameCol = _.template($('#nameCol').html());
          var tempRoleCol = _.template($('#roleCol').html());
          var tempLanguageCol = _.template($('#languageCol').html());
          for(var i = 0; i < (months); i++) {
            $('#ganttArea').append(temp);
            if(month >= 12) {
              month = 1;
              year++;
            }else {
              month++;
            }
            monthArr.push(month);
            yearArr.push(year);
          }
          $('.monTitle').each(function(index) {
            $(this).html(monthArr[index]+ "-" +yearArr[index]);
          });
          $('.month').each(function(index) {
            var $this = $(this);
            $this.css({
              "left": 108*index,
              "width": "108px",
              "height": "25px"
            });
            $this.attr("dataId",yearArr[index]+"-"+monthArr[index]);
          });
          $('.week').each(function(index) {
            $(this).css({
              "left": 27*index,
              "width": "27px",
              "height": "25px"
            });
          });
          $('#mainLeft').append(tempNameCol);
          $('#roleMems').append(tempRoleCol);
          $('#languageMem').append(tempLanguageCol);
          showTableGanttAjax(months, projectID);
        },
        error: function() {

        },
        monthDiff:function(startDate, dueDate) {
          var months;
          months = (dueDate.getFullYear() - startDate.getFullYear()) * 12;
          months -= startDate.getMonth();
          months += dueDate.getMonth()+1;
          return months <= 0 ? 0 : months;
        },
      });
    },

    showTableGanttAjax: function(months, projectID) {
      $.ajax({
        type: "GET",
        url: "/api/v1/projects/"+projectID+"/members",
        success: function(xhr) {
          var oneDay = 24*60*60*1000;
          var leftProDivArr = [];
          var memNameArr = [];
          var diffDayArr = [];
          var userIdArr = [];
          var memRoleArr = [];
          var startDateArr = [];
          var dueDateArr = [];
          var memLanguageArr = [];
          var leftProDiv;
          var diffDays;
          var temp;
          var statusColor;
          for(var i=0, len=xhr.length; i<len; i++) {
            for(var j=0, leng=xhr[i]['members'].length; j<leng; j++){
              var member = xhr[i]['members'];
              var startDateProject = new Date(member[j]["startDate"]);
              var endDateProject = new Date(member[j]["dueDate"]);
              var monProArr = member[j]["startDate"].match(/[0-9]+/g);
              temp = _.template($('#ganttNumMem').html());
              $('#ganttArea').append(temp);
              temp = _.template($('#name').html());
              $('#mainLeft').append(temp);
              temp = _.template($('#roleMemTemp').html());
              $('#roleMems').append(temp);
              temp = _.template($('#solidLineRoleMem').html());
              $('#roleMems').append(temp);
              temp = _.template($('#languageMemTemp').html());
              $('#languageMem').append(temp);
              temp = _.template($('#solidLineLanguageMem').html());
              $('#languageMem').append(temp);
              temp = _.template($('#solidLineLeft').html());
              $('#mainLeft').append(temp);
              temp = _.template($('#solidLineRight').html());
              $('#ganttArea').append(temp);
              memRoleArr.push(member[j]['role']);
              memLanguageArr.push(member[j]['language']);
              diffDays = Math.round((endDateProject.getTime() - startDateProject.getTime())/(oneDay)) + 1;
              var divMon = $("div[dataid='"+monProArr[0]+"-"+parseInt(monProArr[1])+"']");
              var leftMonDiv = parseInt(divMon.css("left").match(/[0-9]+/g)[0]);
              leftProDiv = leftMonDiv + (monProArr[2]-1)*3.6;
              leftProDivArr.push(leftProDiv);
              diffDayArr.push(diffDays);
              userIdArr.push(member[j]["id"])
              memNameArr.push(member[j]["name"]);
              startDateArr.push(member[j]["startDate"]);
              dueDateArr.push(member[j]["dueDate"]);
            }
          }
          this.showProjectTime(startDateArr,dueDateArr,leftProDivArr,diffDayArr,userIdArr);
          this.showMainLeft(memNameArr, userIdArr);
          this.showRoleMem(userIdArr, memRoleArr);
          this.showLanguageMem(memLanguageArr);
          this.showDivLine();
        },
        error: function() {

        },
        showProjectTime:function(startDateArr,dueDateArr,leftProDivArr,diffDayArr,userIdArr) {
          $('.tooltip-p').each(function(index) {
            $(this).html(startDateArr[index]+" => "+dueDateArr[index]);
          });
          $('.numMem').each(function(index) {
            var $this = $(this);
            $this.css({
              "left": leftProDivArr[index],
              "width": 3.6*diffDayArr[index],
              "height": "25px",
              "top": 50 + 30*index,
              'background-color': 'green'
            });
            $('#ganttArea').css({
              "height": 120 + 30*index,
              "margin-top": 20
            });
            $('#mainLeft').css({
              "height": 120 + 30*index
            });
            $('#roleMems').css({
              "height": 120 + 30*index
            });
            $('#languageMem').css({
              "height": 120 + 30*index
            });
          });
          $('.month').each(function(index) {
            temp = _.template($('#dashedLine').html());
            $('#ganttArea').append(temp);
          });
        },
        showMainLeft: function(memNameArr, userIdArr) {
          $('.memberName').each(function(index) {
            var $this = $(this);
            $this.html(memNameArr[index]);
            $this.attr("href","#user/"+userIdArr[index]);
          });
          $('.memberNameDiv').each(function(index) {
            var $this = $(this);
            $this.css({
              "top": 50 + 30*index,
            });
          });        },
        showLanguageMem: function(memLanguageArr) {
          $('.languageMem').each(function(index) {
            var $this = $(this);
            $this.html(memLanguageArr[index].join());
          });
          $('.languageMemDiv').each(function(index) {
            var $this = $(this);
            $this.css({
              "top": 50 + 30*index,
            });
          });
        },
        showRoleMem: function(userIdArr, memRoleArr) {
          $('.roleMem').each(function(index) {
            var $this = $(this);
            $this.html(memRoleArr[index].join());
          });
          $('.memRoleDiv').each(function(index) {
            var $this = $(this);
            $this.css({
              "top": 50 + 30*index,
            });
          });
        },
        showDivLine: function() {
          var height = parseInt($('#mainLeft').css("height").match(/[0-9]+/g)[0]);
          $('.dashedLineDiv').each(function(index) {
            var $this = $(this);
            $this.css({
              "left": 108 * (index+1),
              "height": height-70,
            });
          });
          $('.solidLineLeftDiv').each(function(index) {
            var $this = $(this);
            $this.css({
              "top": 75 + 30*index,
            });
          });
          $('.solidLineRoleMemDiv').each(function(index) {
            var $this = $(this);
            $this.css({
              "top": 75 + 30*index,
            });
          });
          $('.solidLineLanguageMemDiv').each(function(index) {
            var $this = $(this);
            $this.css({
              "top": 75 + 30*index,
            });
          });
          $('.solidLineRightDiv').each(function(index) {
            var $this = $(this);
            $this.css({
              "top": 75 + 30*index,
              "width": months*108
            });
          });
        }
      });
    }
  });
})(jQuery);
