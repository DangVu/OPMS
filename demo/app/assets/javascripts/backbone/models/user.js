var app = app || {};

(function (){
  'use strict';
  _.extend(Backbone.Validation.callbacks, {
    valid: function (view, attr, selector) {
      if (attr === "name"){
        $('#nameEr').addClass('hidden');
      }else if (attr === "password"){
        $('#passwordEr').addClass('hidden');
      }else if (attr === "startDate"){
        $('#startDateEr').addClass('hidden');
      }else if (attr === "dueDate"){
        $('#dueDateEr').addClass('hidden');
      }else if (attr === "effort"){
        $('#effortEr').addClass('hidden');
      }
    },
    invalid: function (view, attr, error, selector) {
      if (attr === "name"){
        $('#nameEr').html(error).removeClass('hidden');
        $('#adminNameEr').html(error).removeClass('hidden');
      }else if (attr === "password"){
        $('#passwordEr').html(error).removeClass('hidden');
        $('#adminPasswordEr').html(error).removeClass('hidden');
      }else if (attr === "startDate"){
        $('#startDateEr').html(error).removeClass('hidden');
      }else if (attr === "dueDate"){
        $('#dueDateEr').html(error).removeClass('hidden');
      }else if (attr === "effort"){
        $('#effortEr').html(error).removeClass('hidden');
      }
    }
  });
  app.User = Backbone.Model.extend({
    validation: {
      name: {
        required: true,
        msg: 'Input your name'
      },
      password: {
        required: true,
        minLength: 6
      },
      startDate: {
        required: true
      },
    }
  });
})();
