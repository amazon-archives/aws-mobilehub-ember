import Ember from 'ember';
export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');
	if(navigator.serviceWorker) {
	  navigator.serviceWorker.register('/sw.js')
	  .catch(function(err) {
	    Ember.Logger.error('Unable to register service worker: ' + err);
	  });
	}
}

export default {
  name: 'sw',
  initialize
};
