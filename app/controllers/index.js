import Ember from 'ember';

export default Ember.Controller.extend({
	authentication: Ember.inject.service(),
	onAuthenticated: Ember.observer('authentication.authenticated', function() {
		if (this.get('authentication').authenticated) {
			this.transitionToRoute('home');
		}
	})
});
