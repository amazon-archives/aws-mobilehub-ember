import Ember from 'ember';
const { Logger } = Ember;

export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/sw.js')
      .catch(function (err) {
        Logger.error('Unable to register service worker: ' + err);
      });
  }
}

export default {
  name: 'sw',
  initialize
};
