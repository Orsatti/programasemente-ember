import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';


export default Route.extend({
    store: Ember.inject.service(),

  model() {
      return this.get('store').findAll('plataforma-ano',
        { include:  'segmento, ' +
                    'aulas.unidade, ' +
                    'aulas.plataforma-conteudos.publicos, ' +
                    'livros, ' +
                    'plataforma-turma.aplicacoes-plataforma-aula.aula' })
  },

   afterModel() {
     let person = JSON.parse(localStorage.getItem('person_logged'));
    if (person.role === 'admin') {
      return;
    }
    if (person.role == 'instrutor' && !person.isAplicador) {
        this.transitionTo('aulas.bibliotecaindex');
    }
  }
});
