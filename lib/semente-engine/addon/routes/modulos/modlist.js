import Route from '@ember/routing/route';
import Ember from 'ember';

export default Route.extend({
  store: Ember.inject.service(),
  model(params) {
    let a = this.get('store').peekRecord('modulo', params.modulo_id);
    if (a) {
      return a;
    }
    return this.get('store').findRecord('modulo', params.modulo_id, { include: 'atividades.competencias'});
  },

  afterModel() {
    let header = document.getElementById('header_layout');
    if (header) {
      header.style.display = 'flex';
    }
  }
});
