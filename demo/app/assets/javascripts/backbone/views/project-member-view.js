var app = app || {};

(function($) {
  app.ProjectMemberView = Backbone.View.extend({
    menuTemp: JST["backbone/templates/menu"],
    template: JST["backbone/templates/projectMember"],

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.append(this.menuTemp);
      this.$el.append(this.template);
      // this.callAjax(this.id);
      $('#startDate').datepicker({
        format: "yyyy-mm-dd"
      });
      $('#dueDate').datepicker({
          format: "yyyy-mm-dd"
      });
      var today = new Date();
      var previous = new Date(today.setMonth(today.getMonth() - 4, 1));
      var next = new Date(today.setMonth(today.getMonth() + 8, 1));
      this.showGantt(previous,next);
      var dd = previous.getDate();
      var mm = previous.getMonth()+1;
      var yyyy = previous.getFullYear();
      if(dd<10) {
          dd='0'+dd
      }
      if(mm<10) {
          mm='0'+mm
      }
      previous = yyyy+'-'+mm+'-'+dd;
      $('#startDate').val(previous);
      $(document).mouseup(function (e){
        var container = $(".tooltip-month");

        if (!container.is(e.target) && container.has(e.target).length === 0){
          container.remove();
        }
      });
    },

    cleanup: function() {
      this.undelegateEvents();
      $(this.el).empty();
    },

    events: {
      "change #startDate": function () {
        this.checkStartDateInput();
      },
      "change #dueDate": function() {
        this.checkDueDateInput();
      },
      "click #btShow": function(e) {
        e.preventDefault();
        $('.month').remove();
        $('.week').remove();
        $('.numMem').remove();
        $('.solidLineLeftDiv').remove();
        $('.solidLineRightDiv').remove();
        $('.dashedLineDiv').remove();
        $('.numMonth').remove();
        $('.solidLineAllMemDiv').remove();
        var startDate = new Date($('#startDate').val());
        var dueDate = new Date($('#dueDate').val());
        this.showGantt(startDate, dueDate);
      },
      "mouseover .numMem": function(e) {
        var x = e.clientX,
            y = e.clientY;
        $(".tooltip-day").css({
          "left": x + 20,
          "top": y - 20
        });
      },
      "click .numMonth": function(e) {
        e.preventDefault();
        var projectID = $(e.currentTarget).attr("data-id");
        var month = $(e.currentTarget).attr("data-time");
        this.showInfoMemberMonthAjax(e,projectID,month);
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

    showGantt: function(startDate, dueDate) {
      var months = this.monthDiff(startDate, dueDate)
      var monthArr = [];
      var yearArr = [];
      var month = startDate.getMonth();
      var year = startDate.getFullYear();
      var temp = _.template($('#ganttTemp').html());
      var tempNameCol = _.template($('#nameCol').html());
      var tempTotalCol = _.template($('#totalCol').html());
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
      $('#allMems').append(tempTotalCol);
      this.showTableGanttAjax(months, this.showMonthMemAjax);
    },

    monthDiff:function(startDate, dueDate) {
      var months;
      months = (dueDate.getFullYear() - startDate.getFullYear()) * 12;
      months -= startDate.getMonth();
      months += dueDate.getMonth()+1;
      return months <= 0 ? 0 : months;
    },

    showTableGanttAjax: function(months, showMonthMemAjax) {
      $.ajax({
        type: "GET",
        url: "/api/v1/projects",
        success: function(xhr) {
          var oneDay = 24*60*60*1000;
          var leftProDivArr = [];
          var proNameArr = [];
          var diffDayArr = [];
          var proIdArr = [];
          var numMemArr = [];
          var sttColorArr = [];
          var startDateArr = [];
          var dueDateArr = [];
          var leftProDiv;
          var diffDays;
          var temp;
          var statusColor;
          // console.log(xhr);
          for(var i=0, len=xhr.length; i<len; i++) {
            var startDateProject = new Date(xhr[i]["startDate"]);
            var endDateProject = new Date(xhr[i]["dueDate"]);
            var startDateIp = new Date($('#startDate').val());
            var dueDateIp = new Date($('#dueDate').val());
            var monProArr = xhr[i]["startDate"].match(/[0-9]+/g);
            temp = _.template($('#ganttNumMem').html());
            $('#ganttArea').append(temp);
            temp = _.template($('#name').html());
            $('#mainLeft').append(temp);
            temp = _.template($('#allMemOfProject').html());
            $('#allMems').append(temp);
            temp = _.template($('#solidLineAllMem').html());
            $('#allMems').append(temp);
            temp = _.template($('#solidLineLeft').html());
            $('#mainLeft').append(temp);
            temp = _.template($('#solidLineRight').html());
            $('#ganttArea').append(temp);
            if(xhr[i]["status"] === "working") {
              statusColor = "#b3ffb3";
            }else {
              statusColor = "#ff6666";
            }
            if(dueDateIp < endDateProject) {
              diffDays = Math.round((dueDateIp.getTime() - startDateProject.getTime())/(oneDay)) + 1;
            }
            if( startDateIp < startDateProject) {
              var divMon = $("div[dataid='"+monProArr[0]+"-"+parseInt(monProArr[1])+"']");
              var leftMonDiv = parseInt(divMon.css("left").match(/[0-9]+/g)[0]);
              leftProDiv = leftMonDiv + (monProArr[2]-1)*3.6;
              diffDays = Math.round((endDateProject.getTime() - startDateProject.getTime())/(oneDay)) + 1;
              if(startDateProject.getDate() === 31){
                leftProDiv = leftMonDiv + (monProArr[2]-1)*3.6 - 3.6;
              }
            }else{
              diffDays = Math.round((endDateProject.getTime() - startDateIp.getTime())/(oneDay)) + 1;
              leftProDiv = 0;
            }
            if(diffDays < 0) {
              diffDays = 0;
            }
            leftProDivArr.push(leftProDiv);
            diffDayArr.push(diffDays);
            proNameArr.push(xhr[i]["name"]);
            proIdArr.push(xhr[i]["_id"]['$oid']);
            if(xhr[i]["numberOfUser"] == null) {
              xhr[i]["numberOfUser"] = 0;
            }
            numMemArr.push(xhr[i]["numberOfUser"]);
            sttColorArr.push(statusColor);
            startDateArr.push(xhr[i]["startDate"]);
            dueDateArr.push(xhr[i]["dueDate"]);
          }
          // console.log(numMemArr);
          this.showProjectTime(startDateArr,dueDateArr,leftProDivArr,diffDayArr,sttColorArr,proIdArr,numMemArr);
          this.showMainLeft(proNameArr, proIdArr, numMemArr);
          this.showDivLine();
          this.showAllMem(numMemArr, proIdArr);
          showMonthMemAjax();
        },
        error: function() {

        },
        showProjectTime:function(startDateArr,dueDateArr,leftProDivArr,diffDayArr,sttColorArr,proIdArr,numMemArr) {
          $('.tooltip-day').each(function(index) {
            $(this).html(startDateArr[index]+" => "+dueDateArr[index]);
          });
          $('.numMem').each(function(index) {
            var $this = $(this);
            $this.css({
              "left": leftProDivArr[index],
              "width": 3.6*diffDayArr[index],
              "height": "25px",
              "top": 50 + 30*index,
              "background-color": sttColorArr[index]
            });
            $this.attr("data_id", proIdArr[index]);
            $('#ganttArea').css({
              "height": 120 + 30*index
            });
            $('#mainLeft').css({
              "height": 120 + 30*index
            });
            $('#allMems').css({
              "height": 120 + 30*index
            });
          });
          $('.month').each(function(index) {
            temp = _.template($('#dashedLine').html());
            $('#ganttArea').append(temp);
          });
        },
        showMainLeft: function(proNameArr, proIdArr) {
          $('.projectName').each(function(index) {
            var $this = $(this);
            $this.html(proNameArr[index]);
            $this.attr("href","#project/"+proIdArr[index]);
          });
          $('.projectNameDiv').each(function(index) {
            var $this = $(this);
            $this.css({
              "top": 50 + 30*index,
            });
          });
        },
        showAllMem: function(numMemArr, proIdArr) {
          $('.projectNum').each(function(index) {
            var $this = $(this);
            $this.html(numMemArr[index]);
            $this.attr("href","#projectdetail/"+proIdArr[index]);
          });
          $('.projectNumDiv').each(function(index) {
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
          $('.solidLineAllMemDiv').each(function(index) {
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
    },

    showMonthMemAjax: function() {
      $.ajax({
        type: "GET",
        url: "/api/v1/project_efforts",
        success: function(xhr) {
          var temp;
          var monthsArr = [];
          for(var i=0, len=xhr.length;i<len;i++){
            for(var j=0, leng=xhr[i].months.length;j<leng;j++){
              temp = _.template($('#numMonthHref').html());
              $("div[data_id='"+xhr[i]["_id"]+"']").append(temp);
              monthsArr.push(xhr[i]['months'][j]['month']);
            }
          }
          $(".numMem").each(function(index) {
            var $div = $(this);
            var numMemArr = [];
            var left = parseInt($div.css("left").match(/[0-9]+/g)[0]);
            for(var i=0, len=xhr[index].months.length; i<len; i++){
              numMemArr.push(xhr[index].months[i]["numberOfUser"]);
            }
            $div.children(".numMonth").each(function(i) {
              var $a = $(this);
              $a.html(numMemArr[i]);
              $a.css({
                "left": 108*i - left%108 + 52,
              });
              $a.attr('data-id',$div.attr("data_id"));
              $a.attr('data-time',monthsArr[i]);
            });
          });
        },
      });
    },
    showInfoMemberMonthAjax:function(e,projectID,month){
      $.ajax({
        type: "GET",
        url: "/api/v1/project_efforts/"+projectID+"/month/"+month,
        success: function(xhr) {
          var temp = _.template($('#membersMonth').html());
          $('.mainDiv').append(temp);
          var x = e.clientX,
            y = e.clientY;
          $(".tooltip-month").css({
            "left": x + 20,
            "top": y - 20
          });
          for(var i=0, len=xhr.length; i<len; i++) {
            // $(".projectMonthInfo").append("<p>"+xhr[i]["name"]+"  "+ xhr[i]["startDate"]+ " ==> " + xhr[i]["dueDate"]);
            $(".projectMonthInfo").append("<tr>"+
                                              "<td>"+xhr[i]["name"]+"</td>" +
                                              "<td>"+xhr[i]["startDate"]+"</td>" +
                                              "<td>"+xhr[i]["dueDate"]+"</td>" +
                                              "<td>"+xhr[i]["role"]+"</td>" +
                                              "<td>"+xhr[i]["effort"]+"%</td>"+
                                          "</tr>");
          }
          console.log(xhr);
        }
      });
    }
  });
})(jQuery);
