import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject } from '@ember/service';

export default Route.extend({
  authentication: inject(),
  beforeModel() {
    var auth = this.get('authentication');
    if (!auth.authenticated) {
      this.transitionTo('index');
    }
  },
  model() {
    return hash({
      notes: this.get('store').findAll('note')
    });
  }
});
