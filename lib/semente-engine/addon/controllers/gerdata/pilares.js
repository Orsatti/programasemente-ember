import Controller from '@ember/controller';
import Ember from 'ember';
import InstValidations from "../../validations/instituicao";
import ENV from '../../config/environment';

export default Controller.extend({
   envnmt: ENV.APP,
   store: Ember.inject.service(),

   pessoaLogged: Ember.computed('model', function(){
      let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
      return this.get('store').peekRecord('pessoa',infosLogged.id);
   }),

   instituicao: Ember.computed('model', function(){
      return this.get('model.instituicao');
   }),

   pilares: Ember.computed('model', function() {
      return this.get('model.instituicao.pilares');
   }),
   
   actions: {
      openModal(pilar){
         this.set('selectedPilar', pilar);
         $('#confirm_modal').show();
      },
      closeModal(){
         this.set('selectedPilar', null);
         $('#confirm_modal').hide();
      },
      selectPilar(){
         let pilar = this.get('selectedPilar');
         let enabled = document.getElementById('pilar' + pilar.get('id') +'_enabled').checked;
         pilar.set('enabled', enabled);
         let show = document.getElementById('pilar' + pilar.get('id') +'_show').checked;
         pilar.set('show', show);
         pilar.save();
         this.send('closeModal');
      },
   }
})