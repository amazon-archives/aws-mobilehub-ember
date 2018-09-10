import Application from '@ember/application';
import { initialize } from 'ember-mobilehub-tester/initializers/aws';
import { module, test } from 'qunit';
import { run } from '@ember/runloop';
import destroyApp from '../../helpers/destroy-app';

module('Unit | Initializer | aws', {
  beforeEach() {
    run(() => {
      this.application = Application.create();
      this.application.deferReadiness();
    });
  },
  afterEach() {
    destroyApp(this.application);
  }
});

// Replace this with your real tests.
test('it works', function (assert) {
  initialize(this.application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
