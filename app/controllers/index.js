import Controller from '@ember/controller';
import { observer } from '@ember/object';
import { inject } from '@ember/service';

export default Controller.extend({
  authentication: inject(),
  onAuthenticated: observer('authentication.authenticated', function () {
    if (this.get('authentication').authenticated) {
      this.transitionToRoute('home');
    }
  })
});
