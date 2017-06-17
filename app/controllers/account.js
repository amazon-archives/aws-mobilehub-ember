import Ember from 'ember';

export default Ember.Controller.extend({
	authentication: Ember.inject.service(),
	cognito: Ember.inject.service(),
	notify: Ember.inject.service(),
	creating: false,
	jwtId: Ember.computed('authentication', function() {
		var token = this.get('authentication').get('token');
		return window.jwt_decode(token);
	}),
	jwtAccess: Ember.computed('authentication', function() {
		var token = this.get('authentication').get('accessToken');
		return window.jwt_decode(token);
	}),
	newAttribute: {},
	expireTime: window.AWS.config.credentials.expireTime,
	actions: {
		refreshCredentials() {
			var ctrl = this;
			this.get('cognito').refresh((error) => {
				if (error) {
					ctrl.get('notify').show('Error refreshing credentials, check the console');
				} else {
					ctrl.get('notify').show('AWS credentials refreshed');
					Ember.set(ctrl, 'expireTime', window.AWS.config.credentials.expireTime);
				}
			});
		},
		gotoSection(section) {
			window.$('#accountSections').find('.account-section').addClass('hidden');
			window.$('.mdc-list').find('.mdc-list-item').removeClass('mdc-permanent-drawer--selected');
			window.$('.'+section).removeClass('hidden');
			window.$('.mdc-list .'+section).addClass('mdc-permanent-drawer--selected')
		},
		updateAttributes() {

		},
		addAttributes() {
			if (!this.get('newAttribute').Name || !this.get('newAttribute').Value) {
				return this.get('notify').show('Please Enter a Name and a Value');
			}
			var attrs = [this.get('newAttribute')];
			this.get('cognito').updateUserAttributes(attrs)
				.then(() => {
					this.get('notify').show('Attributes Updated');
				}, (/*error*/) => {
					this.get('notify').show('Error Updating Attributes :(');
				})
		},
		createAttribute() {
			this.actions.gotoSection('attributes');
			this.set('creating', true);
		},
		cancelAddAttributes() {
			this.set('creating', undefined);
		}
	}
});
