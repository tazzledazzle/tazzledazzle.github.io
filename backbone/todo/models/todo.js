// js/models/todo.js

var app = app || {};
var ENTER_KEY = 13;

// Todo Model
//  title and completed attributes

app.Todo = Backbone.Model.extend({
   defaults: {
       title: '',
       completed: false
   },

    toggle: function(){
        this.save({
            completed: !this.get('completed')
        });
    }
});