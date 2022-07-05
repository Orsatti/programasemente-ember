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
         document.getElementById('create_turma_modal').classList.add('modal--is-show');
         document.getElementsByTagName('body')[0].classList.add('overflow-hidden');
         this.set('plataformaAnoName', plataformaAno.get('name'));
         this.set('plataformaAnoId', plataformaAno.get('id'));
      },
      closeModal() {
         document.getElementsByTagName('body')[0].style.overflow = 'auto';
         document.getElementById('create_turma_modal').classList.remove('modal--is-show');
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
      create(plataformaAnoSelected){
         let instituicao = this.get('model.instituicao');
         let plataformaAno = this.get('store').peekRecord('plataforma-ano', plataformaAnoSelected.id);
         let list = document.getElementById("platTurmas-list-" + plataformaAnoSelected.id);
         const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
         let name = alphabet[list.children.length];

         let plataformaTurmaObj = this.get('store').createRecord('plataforma-turma',{
            'instituicao': instituicao,
            'plataformaAno': plataformaAno,
            'name': name,
         });
         plataformaTurmaObj.save();
      },
      edit(plataformaTurma){
         document.getElementById('plat_turma' + plataformaTurma.get('id')).contentEditable = true;
         document.getElementById('icon-edit' + plataformaTurma.get('id')).style.display = 'none';
         document.getElementById('icon-x' + plataformaTurma.get('id')).style.display = 'block';
         document.getElementById('icon-save' + plataformaTurma.get('id')).style.display = 'block';
      },
      cancelEdit(plataformaTurma){
         document.getElementById('plat_turma' + plataformaTurma.get('id')).contentEditable = false;
         document.getElementById('plat_turma' + plataformaTurma.get('id')).value = plataformaTurma.get('name');
         document.getElementById('plat_turma' + plataformaTurma.get('id')).innerText = plataformaTurma.get('name');
         document.getElementById('icon-edit' + plataformaTurma.get('id')).style.display = 'block';
         document.getElementById('icon-x' + plataformaTurma.get('id')).style.display = 'none';
         document.getElementById('icon-save' + plataformaTurma.get('id')).style.display = 'none';
      },
      saveEdit(plataformaTurma){
         let newName = document.getElementById('plat_turma' + plataformaTurma.get('id')).innerText;
         plataformaTurma.set('name', newName);
         plataformaTurma.save();
         this.send('cancelEdit', plataformaTurma);
      }
   }
})