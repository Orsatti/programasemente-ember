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
      openModal(platAno){
         let plataformaAno = this.get('store').peekRecord('plataforma-ano', platAno.get('id'));
         this.set('selectedPlatAno', plataformaAno);
         $('#confirm_modal').show();
      },
      closeModal(isCancel){
         if(isCancel){
            let check = document.getElementById('plat_ano' + this.get('selectedPlatAno').get('id'));
            if(check.checked) check.checked = false;
            else check.checked = true;
         }
         this.set('selectedPlatAno', null);
         $('#confirm_modal').hide();
      },
      selectAno(){
         let plataformaAno = this.get('selectedPlatAno');
         let check = document.getElementById('plat_ano' + plataformaAno.get('id')).checked;
         let inst = this.get('model.instituicao');
         let that = this;
         
         if(check){
            let sis = inst.get('sistemas');
            sis.forEach(s => {
               let obj = instPlatSis.filterBy('sistema.id', sis.get('id')).filterBy('plataformaAno.id', plataformaAno.get('id'))[0];
               if(obj == null){
                  let create = false;
                  let pIdx = plataformaAno.get('idx');
                  let sIdx = s.get('idx');
                  if(pIdx < 20 && pIdx != 17 && sIdx == 1 || pIdx > 19 && sIdx == 3){
                    create = true;
                  }

                  let segIdx = plataformaAno.get('segmento.idx');
                  if(segIdx > 1 && !inst.get('name').includes("Bradesco") && sIdx == 2) {
                     if(segIdx == 5 && pIdx != 17) create = false;
                     else create = true;
                  }

                  if(create){
                     var newObj =  this.get('store').createRecord('instituicao-plataforma-ano-sistema');
                     newObj.set('instituicao', inst);
                     newObj.set('plataformaAno', plataformaAno);
                     newObj.set('sistema', sis);
                     newObj.set('isEssencial', false);
                     newObj.save();
                  }
               }
            })
         }
         else{
            let instPlatSis = inst.get('instituicaoPlataformaAnoSistema').filterBy('plataformaAno.id', plataformaAno.get('id'));
            instPlatSis.forEach(obj => {
               let objDb = that.get('store').peekRecord('instituicao-plataforma-ano-sistema', obj.get('id'));
               objDb.destroyRecord();
            });
         }
         
         this.send('closeModal', false);
      },
   }
})