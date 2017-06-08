import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('aws-cognito-auth', 'Integration | Component | aws cognito auth', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{aws-cognito-auth}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#aws-cognito-auth}}
      template block text
    {{/aws-cognito-auth}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
