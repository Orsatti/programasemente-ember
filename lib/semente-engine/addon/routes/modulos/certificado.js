import Ember from 'ember';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
  model(params) {
    let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
    let pessoa = this.get('store').findRecord('pessoa', infosLogged.id, {
      include: 'certificados',
      reload: true
    });

    let modulo = this.get('store').peekRecord('modulo', params.modulo_id);
    if (modulo == null) modulo = this.get('store').findRecord('modulo', params.modulo_id);
    return RSVP.hash({
      modulo: modulo,
      pessoa: pessoa,
    });
  },

  afterModel() {
    let header = document.getElementById('header_layout');
    header.style.display = 'flex';
  }
});