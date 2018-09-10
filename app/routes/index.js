//import Ember from 'ember';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  authentication: inject(),
  beforeModel() {
    if (this.get('authentication')
      .authenticated) {
      this.transitionTo('home');
    }
  }
});
