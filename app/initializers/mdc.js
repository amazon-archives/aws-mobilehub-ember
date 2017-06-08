export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');

  /* eslint no-undef: "off" */
  mdc.autoInit();
}

export default {
  name: 'mdc',
  initialize
};
