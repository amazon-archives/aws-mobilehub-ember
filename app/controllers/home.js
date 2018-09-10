import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  notify: inject(),
  onDelete(item) {
    item.destroyRecord()
      .then(() => {
        this.get('notify').show('Note Deleted');
      });
  },
  onSave(item) {
    item.save().then(() => {
      item.set('pending', undefined);
      this.get('notify').show('Note Updated');
    });
  },
  onCreate(title, content) {
    this.get('store').createRecord('note', {
      'title': title,
      'content': content
    }).save().then(() => {
      this.get('notify').show('New Note Created');
    });
  }
});
