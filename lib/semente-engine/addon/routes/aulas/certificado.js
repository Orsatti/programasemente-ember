import Ember from 'ember';
import Route from '@ember/routing/route';

export default Route.extend({
    store: Ember.inject.service(),
  model(params) {
    let a = this.get('store').peekRecord('plataforma-ano', params.platano_id);
    if (a) {
      return a;
    }
    return this.get('store').peekRecord('plataforma-ano', params.platano_id);
  },

  afterModel() {
    let header = document.getElementById('header_layout');
    header.style.display = 'flex';
  }
});