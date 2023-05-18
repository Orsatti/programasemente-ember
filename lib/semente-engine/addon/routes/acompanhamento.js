import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
    model() {
    var person = JSON.parse(localStorage.getItem('person_logged'));
    var pessoa = this.get('store').peekRecord('pessoa', person.id);
    // var inst = this.get('store').findRecord('instituicao', params.instituicao_id, {include: 'plataforma-turmas.plataforma-ano, plataforma-anos.segmento', reload: true});
    var segmentos = this.get('store').findAll('segmento', {include: 'plataforma-anos', reload: true});
    return RSVP.hash({
        pessoa: pessoa,
        // instituicao: inst,
        segmentos: segmentos,
    });
  }
});
