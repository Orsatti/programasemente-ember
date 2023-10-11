import Controller from '@ember/controller';
import Ember from 'ember';
import InstValidations from "../../validations/instituicao";

export default Controller.extend({
   store: Ember.inject.service(),
   InstValidations,
   sistemaSufix: null,
   selectedSistema: null,
   selectedPlatAno: null,
   pessoaLogged: Ember.computed('model',function(){
      let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
      return this.get('store').peekRecord('pessoa',infosLogged.id);
   }),
   instituicao:Ember.computed('model',function(){
      return this.get('model.instituicao');
   }),
   acessoS:Ember.computed('model',function(){
      var s = this.get('model.instituicao').get('sistemas').find((x) => { return x.get('idx') === 2 });
      if(s) return true;
      return false;
   }),
   acessoEssencial:Ember.computed('model',function(){
      return this.get('model.instituicao').get('essencialEnabled');
   }),
   acessoAp:Ember.computed('model',function(){
      var ap = this.get('model.instituicao').get('sistemas').find((x) => { return x.get('idx') === 3 });
      if(ap) return true;
      return false;
   }),
   segmentos:Ember.computed('model',function(){
      return this.get('model.segmentos').sortBy('idx');
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
      openModal(platAno, sistemaIdx, essencial){
         let sufix = '_portal';
         if(sistemaIdx == 2){
            if(essencial == 'true') sufix = '_essencial';
            else sufix = '_s';
         } 
         if(sistemaIdx == 3) sufix = '_ap';
         let sistema = this.get('store').peekAll('sistema').filterBy('idx', parseInt(sistemaIdx))[0];
         let plataformaAno = this.get('store').peekRecord('plataforma-ano', platAno.get('id'));
         this.set('sistemaSufix', sufix);
         this.set('selectedSistema', sistema);
         this.set('selectedPlatAno', plataformaAno);
         $('#confirm_modal').show();
      },
      closeModal(isCancel){
         if(isCancel){
            let check = document.getElementById('plat_ano' + this.get('selectedPlatAno').get('id') + this.get('sistemaSufix'));
            if(check.checked) check.checked = false;
            else check.checked = true;
         }
         this.set('sistemaSufix', null);
         this.set('selectedSistema', null);
         this.set('selectedPlatAno', null);
         $('#confirm_modal').hide();
      },
      selectAno(){
         let sufix = this.get('sistemaSufix');
         let sistema = this.get('selectedSistema');
         let plataformaAno = this.get('selectedPlatAno');
         let check = document.getElementById('plat_ano' + plataformaAno.get('id') + sufix).checked;
         if(check){
            let create = true;
            if(sistema.get('idx') == 2){
               let instPlatSis = this.get('model.instituicao').get('instituicaoPlataformaAnoSistema');
               let obj = instPlatSis.filterBy('sistema.id', sistema.get('id')).filterBy('plataformaAno.id', plataformaAno.get('id'))[0];
               if(obj != null){
                  create = false;
                  let essencial;
                  if(sufix == '_essencial')
                  {
                     essencial = true;
                     document.getElementById('plat_ano' + plataformaAno.get('id') + "_s").checked = false;
                  }
                  else{
                     essencial = false;
                     document.getElementById('plat_ano' + plataformaAno.get('id') + "_essencial").checked = false;
                  }
                  //obj.set('isEssencial', essencial);
               }
            }

            if(create){
               var newObj =  this.get('store').createRecord('instituicao-plataforma-ano-sistema');
               newObj.set('instituicao', this.get('model.instituicao'));
               newObj.set('plataformaAno', plataformaAno);
               newObj.set('sistema', sistema);
               let essencial = false;
               if(sufix == '_essencial') essencial = true;
               newObj.set('isEssencial', essencial);
               //newObj.save();
            }
         }
         else{
            let instPlatSis = this.get('model.instituicao').get('instituicaoPlataformaAnoSistema');
            let obj = instPlatSis.filterBy('sistema.id', sistema.get('id')).filterBy('plataformaAno.id', plataformaAno.get('id'))[0];
            let objDb = this.get('store').peekRecord('instituicao-plataforma-ano-sistema', obj.get('id'));
            //objDb.destroyRecord();
         }
         this.send('closeModal', false);
      },
   }
})