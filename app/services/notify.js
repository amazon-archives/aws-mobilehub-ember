import Ember from 'ember';

export default Ember.Service.extend({
	show(message) {
		let notify = window.mdc.snackbar.MDCSnackbar.attachTo(document.querySelector('.mdc-snackbar'));
			notify.show({
				'message': message
			});
	}
});
