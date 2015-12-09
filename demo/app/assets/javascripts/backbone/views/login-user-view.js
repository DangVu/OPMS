var app = app || {};

(function($) {
  app.LoginView = Backbone.View.extend({
    template: JST["backbone/templates/login"],

    initialize: function() {
      this.render();
      Backbone.Validation.bind(this);
    },

    render: function() {
      this.$el.html(this.template);
      $("#admin_login").css("display", "none");
    },

    events: {
      "click .admin": "showAdmin",
      "click .user": "showUser",
      "click #loginBtUser": function (e) {
          e.preventDefault();
          this.setVisibleEr();
          this.loginUser();
      },
      "click #loginBtAdmin": function (e) {
          e.preventDefault();
          this.setVisibleEr();
          this.loginAdmin();
      }
    },

    showAdmin: function( event ) {
      event.preventDefault();
      this.setVisibleEr();
      this.setVisibleDiv("#user_login","#admin_login");
    },

    showUser: function( event ) {
      event.preventDefault();
      this.setVisibleEr();
      this.setVisibleDiv("#admin_login","#user_login");
    },

    setVisibleEr: function() {
      $("span").each(function() {
        $(this).addClass('hidden');
      });
    },

    setVisibleDiv: function(divClass1,divClass2) {
      $(divClass1).hide();
      $(divClass2).show();
    },

    loginUser: function() {
      this.model.set('name', $('#userName').val().trim());
      this.model.set('password', $('#userPassword').val().trim());
      if(this.model.isValid(true)) {
        // this.model.save();
        this.sendRequest($("#userName").val().trim(), $("#userPassword").val().trim(), "user");
        // alert('Great Success!');
      }
    },

    loginAdmin: function() {
      this.model.set('name', $('#adminName').val().trim());
      this.model.set('password', $('#adminPassword').val().trim());
      if(this.model.isValid(true)) {
        // this.model.save();
        this.sendRequest($("#adminName").val().trim(), $("#adminPassword").val().trim(), "admin");
        // alert('Great Success!');
      }
    },

    sendRequest: function (name, password, type) {
      var user = {
        "name": name,
        "password": password,
        "type": type
      };

      $.ajax({
        type: "POST",
        url: "/login",
        data: JSON.stringify({session: user }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function() {this.createLink();},
        error: function(error) {
          if (error["status"] === 450) {
            $('#adminNameEr').html("Invalid admin").removeClass('hidden');
            $('#nameEr').html("Invalid user").removeClass('hidden');
          }else if(error["status"] === 451) {
            $('#passwordEr').html("Invalid password").removeClass('hidden');
            $('#adminPasswordEr').html("Invalid password").removeClass('hidden');
          }
        },
        createLink: function() {
          var linkShow = "<a href='#listuser' id='showUsFrLg'>show</a>";
          $("#user_login").append(linkShow);
          $("#showUsFrLg")[0].click();
        }
      });
    }
  });
})(jQuery);
