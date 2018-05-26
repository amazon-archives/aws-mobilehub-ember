import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  authentication: inject(),
  beforeModel() {
    var auth = this.get('authentication');
    if (!auth.authenticated) {
      this.transitionTo('index');
    }
  }
});
