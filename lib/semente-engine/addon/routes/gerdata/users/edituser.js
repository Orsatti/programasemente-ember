import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
  model: function(params) {
    var pessoa = this.get('store').findRecord('pessoa', params.pessoa_id, {include: 'plataforma-turmas, plataforma-anos', reload: true});
    var segmentos = this.get('store').peekAll('segmento');
    return RSVP.hash({
      pessoa: pessoa,
      segmentos: segmentos,
    });
  },
});