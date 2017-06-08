import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		delete(item) {
			item.set('pending', true);
			this.get('delete')(item);
		},
		save(item) {
			item.set('pending', true);
			this.get('save')(item);
		},
		menu(id) {
			let menu = new window.mdc.menu.MDCSimpleMenu(document.querySelector('#menu-'+id));
			menu.open = !menu.open;
		}
	}
});