import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';
import ENV from '../config/environment';

export default Route.extend({
  store: Ember.inject.service(),
  model() {
    return RSVP.hash({
      instituicoes: this.get('store').findAll('instituicao', {
        include: 'calendario', reload: false
      }),
      sistemas: this.get('store').findAll('sistema'),
      anos: this.get('store').findAll('plataforma-ano')
    });
  },
});
