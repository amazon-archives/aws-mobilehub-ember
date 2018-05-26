import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  authentication: inject(),
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
