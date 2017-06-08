import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		cancelCreate() {
			this.set('creating', undefined);
		},
		create() {
			this.set('creating', !this.get('create'));1
		},
		save() {
			let title = this.get('title'),
				content = this.get('content');
			this.get('save')(title,content);
			this.set('title', undefined);
			this.set('content', undefined);
		}
	}
});
