import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
  model: function(params) {
    var newUser =  this.get('store').createRecord('pessoa');
    var instituicao = this.get('store').findRecord('instituicao', params.instituicao_id, {include: 'plataforma-turmas.plataforma-ano', reload: true});    
    var segmentos = this.get('store').peekAll('segmento');
    return RSVP.hash({
      newUser: newUser,
      instituicao: instituicao,
      segmentos: segmentos,
    });
  },
});