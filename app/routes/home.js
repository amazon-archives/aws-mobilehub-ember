import Ember from 'ember';

export default Ember.Route.extend({
	authentication: Ember.inject.service(),
	beforeModel() {
		var auth = this.get('authentication');
		if (!auth.authenticated) {
			this.transitionTo('index');
		}
	},
	model() {
		return Ember.RSVP.hash({
			notes: this.get('store').findAll('note')
		});
	}
});