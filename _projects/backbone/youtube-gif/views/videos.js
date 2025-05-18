
var app = app || {};

app.VideoView = Backbone.View.extend({
	tagName: 'div',

	videoTemplate: _.template($('#video-template').html()),

	events: {},

	initialize: function () {
        this.render();
	},
	render: function () {
		debugger;
		this.$el.html(this.template(this.model.attributes));
		
		return this;

	}

});