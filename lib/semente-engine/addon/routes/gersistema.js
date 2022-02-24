import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';
import ENV from '../config/environment';

export default Route.extend({
  store: Ember.inject.service(),
  env: ENV.APP,
  session: Ember.inject.service('session'),
  beforeModel() {
    if (!localStorage.getItem('person_logged')) { // if the user had not selected an institution, then do not load
      this.transitionTo('index');
    }
    let person = JSON.parse(localStorage.getItem('person_logged'));
    let pessoa = this.get('store').peekRecord('pessoa', person.id);
    if (!pessoa){
      this.get('store').findRecord('pessoa', person.id, {include: 'turmas'});
    }
  },
  model() {
    let person = JSON.parse(localStorage.getItem('person_logged'));
    let role = person.role;
    let inst_id = person.instituicao_id;
    if (role === 'admin') {
      return RSVP.hash({
        instituicoes: this.get('store').findAll('instituicao', {
          include: '', reload: false
        }),
        modulos: this.get('store').findAll('modulo',{
          include:'sistemas, atividades', reload: false
        }),
        sistemas: this.get('store').findAll('sistema'),
        plataformaAnos: this.get('store').findAll('plataforma-ano',{
          include:'segmento', reload: false
        }),
      });
    } else {
      return RSVP.hash({
        instituicoes: this.get('store').findRecord('instituicao', inst_id, {
          include: 'areas, modulos, plataforma-anos.segmento, codigos-cadastro, plataforma-turmas', reload: false
        }),
        modulos: this.get('store').findAll('modulo',{
          include:'sistemas', reload: false
        }),
        sistemas: this.get('store').findAll('sistema', { reload: false}),
      });
    }
  },
  actions: {
    willTransition(transition) {
      if (transition.targetName != 'webapp.semente-engine.gersistema.gerdata.index') {
        if (this.controller.get('instView') == true) {
          this.controller.set('instView', false);
        }
      }
    },
    refreshAll() {
      this.refresh();
    }
  }
});
