import Controller from '@ember/controller';
import Ember from 'ember';
import InstValidations from "../../validations/instituicao";

export default Controller.extend({
   store: Ember.inject.service(),
   InstValidations,
   role: Ember.computed('model',function(){
      let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
      return this.get('store').peekRecord('pessoa',infosLogged.id).get('role');
   }),
   instituicao:Ember.computed('model',function(){
      return this.get('model.instituicao');
   }),
   segmentos:Ember.computed('model',function(){
      let listaSegmentos = [];
      let plataformaAnos = this.get('model.instituicao').get('plataformaAnos');
      plataformaAnos.forEach(pa => {
         var listaIds = listaSegmentos.map(x => x.get('id'));
         if(listaIds.indexOf(pa.get('segmento').get('id')) == -1){
            listaSegmentos.push(pa.get('segmento'));
         }
      });
      return listaSegmentos.sort(function(a, b){ return a.get('id') - b.get('id') });
   }),
   plataformaTurmas:Ember.computed('model',function(){
      return this.get('model.instituicao').get('plataformaTurmas');
   }),
   actions: {
      openModal(plataformaAno) {
         document.getElementsByTagName('body')[0].style.overflow = 'hidden';
         document.getElementById('turma_modal').classList.add('modal--is-show');
         document.getElementsByTagName('body')[0].classList.add('overflow-hidden');
         this.set('plataformaAnoName', plataformaAno.get('name'));
      },
      closeModal() {
         document.getElementsByTagName('body')[0].style.overflow = 'auto';
         document.getElementById('turma_modal').classList.remove('modal--is-show');
         document.getElementsByTagName('body')[0].classList.remove('overflow-hidden');
         $('body').removeClass('no-header');
      },
      save(){

      }
   }
})