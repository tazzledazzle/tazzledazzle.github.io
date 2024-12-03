(function(){  // whole blocked is wrapped into anonymous Jquery function..

window.App = {   // defining app name space, You can rename it as per your project name..
	Models: {},
	Collections: {},
	Views: {}
};

window.template = function(id){
	return _.template( $('#' + id).html() );
};


// Person Model
App.Models.Person = Backbone.Model.extend({   // Person model referencing the App namespace model.
	defaults: {
		name: 'Guest User',
		age: 30,
		occupation: 'worker'
	}
});

// A List of People
// Same here. People is referencing now collection from App namespace
App.Collections.People = Backbone.Collection.extend({
	model: App.Models.Person   // Change here for Person Reference from App models namespace
});


// View for all people
/// Same here. People is referencing now views from App namespace
App.Views.People = Backbone.View.extend({
	tagName: 'ul',

	render: function(){
		this.collection.each(function(person){
                        // Change here for Person Reference from App Views namespace
			var personView = new App.Views.Person({ model: person });
			this.$el.append(personView.render().el);
		}, this);

		return this;
	}
});

// The View for a Person
// Change here for Person Reference from App Views namespace
App.Views.Person = Backbone.View.extend({
	tagName: 'li',

	template: _.template($('#personTemplate').html()),
	render: function(){
		this.$el.html( this.template(this.model.toJSON()));
		return this;
	}
});
// Change here for Person Reference from App Collections namespace
var peopleCollection = new App.Collections.People([
	{
		name: 'Mohit Jain',
		age: 26
	},
	{
		name: 'Taroon Tyagi',
		age: 25,
		occupation: 'web designer'
	},
	{
		name: 'Rahul Narang',
		age: 26,
		occupation: 'Java Developer'
	}
]);

// Change here for Person Views from App Views namespace
var peopleView = new App.Views.People({ collection: peopleCollection });
$(document.body).append(peopleView.render().el);
})();