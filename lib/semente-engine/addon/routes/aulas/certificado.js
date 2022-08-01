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

    let plataformaAno = this.get('store').peekRecord('plataforma-ano', params.platano_id);
    if (plataformaAno == null) this.get('store').peekRecord('plataforma-ano', params.platano_id);
    return RSVP.hash({
      plataformaAno: plataformaAno,
      pessoa: pessoa,
    });
  },

  afterModel() {
    let header = document.getElementById('header_layout');
    header.style.display = 'flex';
  }
});