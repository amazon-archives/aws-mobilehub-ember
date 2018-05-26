//import Ember from 'ember';
import Service from '@ember/service';

export default Service.extend({
  show(message) {
    let notify = window.mdc.snackbar.MDCSnackbar.attachTo(document.querySelector('.mdc-snackbar'));
    notify.show({
      'message': message
    });
  }
});
