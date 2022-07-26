import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
  model: function(params) {
    var aula = this.get('store').findRecord('aula', params.aula_id, {include:'competencias, calendarios', reload: true});
    var competencias = this.get('store').findAll('comp');
    var calendarios = this.get('store').findAll('calendario');
    return RSVP.hash({
      aula: aula,
      competencias: competencias,
      calendarios: calendarios,
    });
  },
});