import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  appController: Ember.inject.controller('application'),
  store: Ember.inject.service(),

  hasAnyCertificado: Ember.computed('model', function(){
    if(this.get('model').get('certificados').content.length > 0) return true;
    return false;
  }),
  
  certificados: Ember.computed('model', function(){
    return this.get('model').get('certificados');
  }),

  hasAnyCertificadoSemente: Ember.computed('model', function(){
    let certificados = this.get('model').get('certificados');
    let i = 0;
    certificados.forEach(certificado => {
      if(certificado.get("sistema") == 1) i++;
    });
    if(i > 0) return true;
    return false;
  }),

  hasAnyCertificadoS: Ember.computed('model', function(){
    let certificados = this.get('model').get('certificados');
    let i = 0;
    certificados.forEach(certificado => {
      if(certificado.get("sistema") == 2) i++;
    });
    if(i > 0) return true;
    return false;
  }),
  
  actions: {
    goToAulas(){
      window.history.back();
      //  this.transitionToRoute('aulas.index');
    },
  }
});
