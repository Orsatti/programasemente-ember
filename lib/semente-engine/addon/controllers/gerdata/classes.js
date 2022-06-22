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
   plataformaAnoId: 0,
   plataformaAnos:Ember.computed('model',function(){
      return this.get('model.instituicao').get('plataformaAnos');
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
         this.set('plataformaAnoId', plataformaAno.get('id'));
      },
      closeModal() {
         document.getElementsByTagName('body')[0].style.overflow = 'auto';
         document.getElementById('turma_modal').classList.remove('modal--is-show');
         document.getElementsByTagName('body')[0].classList.remove('overflow-hidden');
         $('body').removeClass('no-header');
      },
      showTab(id){
         let val = 1
         if(id == 1){ val = 2 }
         document.getElementById('tab-' + val).classList.remove('tabs__tab--is-active');
         document.getElementById('tab-' + val + '1').style.display = 'none';
         document.getElementById('tab-' + id).classList.add('tabs__tab--is-active');
         document.getElementById('tab-' + id + '1').style.display = 'block';
      },
      create(id){
         let instituicao = this.get('model.instituicao');
         let plataformaAnoId = this.get('plataformaAnoId');
         let plataformaAno = this.get('store').peekRecord('plataforma-ano', plataformaAnoId);
         if(id == 'name'){
            let name = document.getElementById('name').value;
            let plataformaTurmaObj = this.get('store').createRecord('plataforma-turma',{
               'instituicao': instituicao,
               'plataformaAno': plataformaAno,
               'name': name
            });
            plataformaTurmaObj.save();
         }
         if(id == 'quantity'){
            let names = ["A", "B", "C", "D", "E"];
            let quantity = document.getElementById('quantity').value;
            for(let i = 0; i < quantity; i++) {
               let name = names[i];
               let plataformaTurmaObj = this.get('store').createRecord('plataforma-turma',{
                  'instituicao': instituicao,
                  'plataformaAno': plataformaAno,
                  'name': name,
               });
               plataformaTurmaObj.save();
            }
         }
         this.send('closeModal');
      }
   }
})