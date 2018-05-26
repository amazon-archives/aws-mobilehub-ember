import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  authentication: inject(),
  cognito: inject(),
  actions: {
    logout() {
      this.get('logout')();
    }
  }
});
