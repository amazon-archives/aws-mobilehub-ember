import Ember from 'ember';

export default Ember.Controller.extend({
	authentication: Ember.inject.service(),
	actions: {
		onLogout() {
			var auth = this.get('authentication');
				auth.logout()
					.then(() => {
						this.transitionToRoute('index');
					});
		}
	}
});
