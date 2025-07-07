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
   percursoAdulto: Ember.computed('model', function(){
      let sistema = this.get('store').peekAll('sistema').filterBy('idx', 2)[0];
      let instPlatSis = this.get('model.instituicao').get('instituicaoPlataformaAnoSistema');
      let obj = instPlatSis.filterBy('sistema.id', sistema.get('id')).filterBy('plataformaAno.segmento.idx', 6)[0];
      return obj.get('plataformaAno.name');
   }),

   async addSelectAnosSegmento(){

   },
   
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
      closeModal(){
         if(this.get('selectedPlatAno').get('segmento.idx') == 6){
            let sistema = this.get('selectedSistema');
            let instPlatSis = this.get('model.instituicao').get('instituicaoPlataformaAnoSistema');
            let obj = instPlatSis.filterBy('sistema.id', sistema.get('id')).filterBy('plataformaAno.segmento.idx', 6)[0];
            let select = document.getElementById('platAnoAdulto');
            select.value = obj.get('plataformaAno.id');
         }
         else{
            let check = document.getElementById('plat_ano' + this.get('selectedPlatAno').get('id') + this.get('sistemaSufix'));
            if(check.checked) check.checked = false;
            else check.checked = true;
         }
         this.set('selectedPlatAno', null);
         $('#confirm_modal').hide();
      },
      selectAno(){
         let plataformaAno = this.get('selectedPlatAno');
         let instPlatSis = this.get('model.instituicao').get('instituicaoPlataformaAnoSistema');

         let portal = this.get('store').peekAll('sistema').filterBy('idx', 1)[0];
         let s = this.get('store').peekAll('sistema').filterBy('idx', 2)[0];
         let ap = this.get('store').peekAll('sistema').filterBy('idx', 3)[0];

         if(plataformaAno.get('segmento.idx') == 6){
            
            let objS = instPlatSis.filterBy('sistema.id', s.get('id')).filterBy('plataformaAno.segmento.idx', 6)[0];
            if(objS != null) objS.destroyRecord();

            let objAp = instPlatSis.filterBy('sistema.id', ap.get('id')).filterBy('plataformaAno.segmento.idx', 6)[0];
            if(objAp != null) objAp.destroyRecord();

            var newObjS =  this.get('store').createRecord('instituicao-plataforma-ano-sistema');
            newObjS.set('instituicao', this.get('model.instituicao'));
            newObjS.set('plataformaAno', plataformaAno);
            newObjS.set('sistema', s);
            newObjS.set('isEssencial', false);
            newObjS.save();

            var newObjAp =  this.get('store').createRecord('instituicao-plataforma-ano-sistema');
            newObjAp.set('instituicao', this.get('model.instituicao'));
            newObjAp.set('plataformaAno', plataformaAno);
            newObjAp.set('sistema', ap);
            newObjAp.set('isEssencial', false);
            newObjAp.save();

         }
         else {
            let check = document.getElementById('plat_ano' + plataformaAno.get('id')).checked;
            if(check){
               let objPortal = instPlatSis.filterBy('sistema.id', portal.get('id')).filterBy('plataformaAno.id', plataformaAno.get('id'))[0];
               if(objPortal == null){
                  var newObjPortal =  this.get('store').createRecord('instituicao-plataforma-ano-sistema');
                  newObjPortal.set('instituicao', this.get('model.instituicao'));
                  newObjPortal.set('plataformaAno', plataformaAno);
                  newObjPortal.set('sistema', portal);
                  newObjPortal.set('isEssencial', false);
                  newObjPortal.save();
               }

               let objS = instPlatSis.filterBy('sistema.id', s.get('id')).filterBy('plataformaAno.id', plataformaAno.get('id'))[0];
               if(objS == null){
                  var newObjS =  this.get('store').createRecord('instituicao-plataforma-ano-sistema');
                  newObjS.set('instituicao', this.get('model.instituicao'));
                  newObjS.set('plataformaAno', plataformaAno);
                  newObjS.set('sistema', s);
                  newObjS.set('isEssencial', false);
                  newObjS.save();
               }
            }
            else{
               let objPortal = instPlatSis.filterBy('sistema.id', portal.get('id')).filterBy('plataformaAno.id', plataformaAno.get('id'))[0];
               if(objPortal != null) objPortal.destroyRecord();

               let objS = instPlatSis.filterBy('sistema.id', s.get('id')).filterBy('plataformaAno.id', plataformaAno.get('id'))[0];
               if(objS != null) objS.destroyRecord();
            }
         }
         
         this.set('selectedPlatAno', null);
         $('#confirm_modal').hide();
      },

      openModalSegmento(segmento){
         const selectedSegmento = this.get('store').peekRecord('segmento', segmento.get('id'));
         this.set('selectedSegmento', selectedSegmento);
         $('#confirm_segmento_modal').show();
      },

      closeModalSegmento(){
         this.set('selectedSegmento', null);
         $('#confirm_segmento_modal').hide();
      },

      async selectAnosSegmento(){
         const selectedSegmento = this.get('selectedSegmento');
         const plataformaAnos = selectedSegmento.get('plataformaAnos');
         const instPlatSis = this.get('model.instituicao').get('instituicaoPlataformaAnoSistema');

         const portal = this.get('store').peekAll('sistema').filterBy('idx', 1)[0];
         const s = this.get('store').peekAll('sistema').filterBy('idx', 2)[0];

         plataformaAnos.forEach(async plataformaAno => {
            let check = document.getElementById('plat_ano' + plataformaAno.get('id')).checked;
            if(!check){
               let objPortal = instPlatSis.filterBy('sistema.id', portal.get('id')).filterBy('plataformaAno.id', plataformaAno.get('id'))[0];
               if(objPortal == null){
                  var newObjPortal =  this.get('store').createRecord('instituicao-plataforma-ano-sistema');
                  newObjPortal.set('instituicao', this.get('model.instituicao'));
                  newObjPortal.set('plataformaAno', plataformaAno);
                  newObjPortal.set('sistema', portal);
                  newObjPortal.set('isEssencial', false);
                  await newObjPortal.save();
               }

               let objS = instPlatSis.filterBy('sistema.id', s.get('id')).filterBy('plataformaAno.id', plataformaAno.get('id'))[0];
               if(objS == null){
                  var newObjS =  this.get('store').createRecord('instituicao-plataforma-ano-sistema');
                  newObjS.set('instituicao', this.get('model.instituicao'));
                  newObjS.set('plataformaAno', plataformaAno);
                  newObjS.set('sistema', s);
                  newObjS.set('isEssencial', false);
                  await newObjS.save();
               }
            }
            else{
               let objPortal = instPlatSis.filterBy('sistema.id', portal.get('id')).filterBy('plataformaAno.id', plataformaAno.get('id'))[0];
               if(objPortal != null) await objPortal.destroyRecord();

               let objS = instPlatSis.filterBy('sistema.id', s.get('id')).filterBy('plataformaAno.id', plataformaAno.get('id'))[0];
               if(objS != null) await objS.destroyRecord();
            }

            document.getElementById('plat_ano' + plataformaAno.get('id')).checked = !check;
         });

         this.set('selectedSegmento', null);
         $('#confirm_segmento_modal').hide();
      }
   }
})