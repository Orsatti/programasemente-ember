import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
  model() {
    var newInst =  this.get('store').createRecord('instituicao');
      newInst.set('name', "alal");
      newInst.set('radical', "alal");
      newInst.set('uf', "alal");
      newInst.set('cidade', "alal");
      newInst.set('nrgestores', "1");
      newInst.set('nrcoordenadores', "1");
      newInst.set('nrmarketing', "1");
      newInst.set('nrsecretaria', "1");
      newInst.set('nrinstrutores', "1");
      newInst.set('nralunos', "1");
      newInst.set('enabled', true);
      newInst.set('isEscola', true);
      newInst.set('sEnabled', true);
    var segmentos = this.get('store').peekAll('segmento');
    return RSVP.hash({
      newInst: newInst,
      segmentos: segmentos
    });


      
  },
});