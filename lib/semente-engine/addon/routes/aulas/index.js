import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';


export default Route.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),

  model() {
    let person = JSON.parse(localStorage.getItem('person_logged'));
    var inst = this.get('store').findRecord('instituicao', person.instituicao_id, {include: 'plataforma-anos', reload: true});
    var calendarios = this.get('store').findAll('calendario');
    return this.get('store').findAll('plataforma-ano',
      {
        include: 'segmento, ' +
          'aulas.unidade, ' +
          'aulas.plataforma-conteudos.publicos, ' +
          'livros, ' +
          'aulas.aplicacao-plataforma-aula,' + 
          'plataforma-turma,' +
          'aulas.competencias,' +
          'aulas.calendarios'
      })
  },

  afterModel() {
    let person = JSON.parse(localStorage.getItem('person_logged'));
    if (person.role === 'admin') {
      return;
    }
    if (person.role == 'instrutor' && !person.isAplicador) {
      this.transitionTo('aulas.bibliotecaindex');
    }
  },

  actions: {
    error() {
      localStorage.clear();
      this.get('session').invalidate();
    }
  }
});
