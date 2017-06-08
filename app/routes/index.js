import Ember from 'ember';

export default Ember.Route.extend({
	authentication: Ember.inject.service(),
	beforeModel() {
		if (this.get('authentication')
				.authenticated) {
					this.transitionTo('home');
		}
	}
});
