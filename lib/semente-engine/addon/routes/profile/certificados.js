import Route from '@ember/routing/route';
import Ember from 'ember';

export default Route.extend({
  store: Ember.inject.service(),
  model(params) {
    return this.get('store').findRecord('pessoa', params.pessoa_id, {
      include: 'certificados',
      reload: true
    });
  },
});
