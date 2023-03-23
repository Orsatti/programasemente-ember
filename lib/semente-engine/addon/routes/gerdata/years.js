import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
  model: function(params) {
    var inst = this.get('store').findRecord('instituicao', params.instituicao_id, {include: 'plataforma-anos.segmento', reload: true});
    var segmentos = this.get('store').findAll('segmento', {include: 'plataforma-anos', reload: true});
    return RSVP.hash({
      instituicao: inst,
      segmentos: segmentos,
    });
  },
});