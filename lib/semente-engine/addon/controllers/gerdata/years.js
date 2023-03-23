import Controller from '@ember/controller';
import Ember from 'ember';
import InstValidations from "../../validations/instituicao";

export default Controller.extend({
   store: Ember.inject.service(),
   InstValidations,
   pessoaLogged: Ember.computed('model',function(){
      let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
      return this.get('store').peekRecord('pessoa',infosLogged.id);
   }),
   instituicao:Ember.computed('model',function(){
      return this.get('model.instituicao');
   }),
   segmentos:Ember.computed('model',function(){
      return this.get('model.segmentos');
   }),
   actions: {
      saveCourses(){
         document.getElementById('btnSubmit').innerText = "Salvando...";
         document.getElementById('btnSubmit').disabled = true;
         this.get('model.instituicao').save().then(function (){
            document.getElementById('btnSubmit').innerText = "Salvar";
            document.getElementById('btnSubmit').disabled = false;
         });
      },
      selectAno(plataformaAno, sistemaIdx){
         let sufix = '_portal';
         if(sistemaIdx == 2) sufix = '_s';
         if(sistemaIdx == 3) sufix = '_ap';

         let sistema = this.get('store').peekAll('sistema').filterBy('idx', parseInt(sistemaIdx))[0];
         let check = document.getElementById('plat_ano' + plataformaAno.get('id') + sufix).checked;
         if(check){
            var newObj =  this.get('store').createRecord('instituicao-plataforma-ano-sistema');
            newObj.set('instituicao', this.get('model.instituicao'));
            newObj.set('plataformaAno', plataformaAno);
            newObj.set('sistema', sistema);
            this.get('model.instituicao').get('instituicaoPlataformaAnoSistema').pushObject(newObj);
         }
         else{
            let instPlatSis = this.get('model.instituicao').get('instituicaoPlataformaAnoSistema');
            let obj = instPlatSis.filterBy('sistema.id', sistema.get('id')).filterBy('plataformaAno.id', plataformaAno.get('id'))[0];
            this.get('model.instituicao').get('instituicaoPlataformaAnoSistema').removeObject(obj);
         }
      },
   }
})