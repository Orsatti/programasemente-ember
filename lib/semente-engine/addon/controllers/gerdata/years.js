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
      return this.get('store').peekAll('segmento');
   }),
   actions: {
      saveCourses(){
         debugger;
      },
      selectAno(plataformaAno){
         let check = document.getElementById('plat_ano' + plataformaAno.get('id')).checked;
         if(check){
            this.get('model.instituicao').get('plataformaAnos').pushObject(plataformaAno);
         }
         else{
            this.get('model.instituicao').get('plataformaAnos').removeObject(plataformaAno);
         }
      },
   }
})