import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
  model() {
    var newInst =  this.get('store').createRecord('instituicao');
    newInst.set('enabled', true);
    var segmentos = this.get('store').peekAll('segmento');
    // var calendarios = this.get('store').findAll('calendario');
    var calendarios = this.get('store').peekAll('calendario');
    return RSVP.hash({
      newInst: newInst,
      segmentos: segmentos,
      calendarios: calendarios
    });
  },
});