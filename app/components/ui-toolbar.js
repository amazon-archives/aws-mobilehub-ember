import Ember from 'ember';

export default Ember.Component.extend({
	authentication: Ember.inject.service(),
	cognito: Ember.inject.service(),
	actions: {
		logout() {
			this.get('logout')();
		}
	}
});
