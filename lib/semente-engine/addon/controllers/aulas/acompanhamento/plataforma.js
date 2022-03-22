import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  aulasController: Ember.inject.controller('aulas'),
  parentController: Ember.inject.controller('aulas.acompanhamento'),
  store: Ember.inject.service(),
  queryParams: ["segmento_id", "plataformaano_id", "instituicao_id", "plataforma_turma_id"],
  alunos: Ember.computed('model', function () {
    return this.get('model').filterBy('role', 'aluno');
  }),

  professores: Ember.computed('model', function () {
    return this.get('model').filterBy('role', 'instrutor');
  }),

  role:Ember.computed('model', function () {
    let pessoa = JSON.parse(localStorage.getItem('person_logged'));
    return pessoa.role;
  }),

  isAdmin: Ember.computed('model', function () {

      let pessoa = JSON.parse(localStorage.getItem('person_logged'));
      if (pessoa.role === 'aluno' || pessoa.role === 'instrutor') {
        return false;
      } else {
        return true;
      }
    return true;
  }),

  filteredAlunos: Ember.computed('model', function () {
    return this.get('alunos');
  }),

  filteredProfessores: Ember.computed('model', function () {
    return this.get('professores');
  }),

  selectedFilteredRole: Ember.computed('model', function () {
    if (this.get('isAdmin')) {
      return 'professores'
    } else {
      return 'alunos'
    }
  }),

  segmento_id: Ember.computed('model', function () {
    return this.get('parentController').get('selectedSegmentoLocal').get('id');
  }),

  plataformaAnos: Ember.computed('model', function () {
    return this.get('parentController').get('selectedSegmentoLocal').get('plataformaAnos');
  }),

  plataformaTurmas: Ember.computed('model', function () {
    let turmas = [];
    let instPlatTurmas = this.get('parentController.inst_selected').get('plataformaTurmas');
    let platAnos = this.get('plataformaAnos');
    let selectedPlatAno = this.get('selectedPlataformaAno');

    if(selectedPlatAno == null){
      platAnos.forEach(pa =>{
        instPlatTurmas.forEach(pt => {
          if(pa.get('id') == pt.get('plataformaAno').get('id')){
            turmas.push(pt);
          }
        })
      })
    }
    else{
      instPlatTurmas.forEach(pt => {
        if(selectedPlatAno.get('id') == pt.get('plataformaAno').get('id')){
          turmas.push(pt);
        }
      })
    }

    return turmas;
  }),

  search: Ember.computed('model', function () {
    return "";
  }),

  actions: {
    toggleRole(selectedRole) {
      this.get('aulasController').send('toggleRole', selectedRole)
    },

    refreshSelectedFilteredRole(selectedRole) {
      this.set('selectedFilteredRole', selectedRole);
    },

    refreshSelectedSegmento(selectedSegmento) {
      this.set('segmento_id', selectedSegmento.get('id'));
      this.get('parentController').send('refreshSelectedSegmento', selectedSegmento);
      this.send('refreshSelectedAno', "");
      this.send('refreshSelectedTurma', "");
    },

    refreshSelectedAno(platAnoId) {
      let platAno = this.get('store').peekRecord('plataforma-ano', platAnoId);
      if (platAno) {
        this.set('plataformaano_id', platAno.get('id'));
        this.set('selectedPlataformaAno', platAno);
      } else {
        this.set('plataformaano_id', null);
        this.set('selectedPlataformaAno', null);
      }
    },

    refreshSelectedTurma(platTurmaId) {
      let platTurma = this.get('store').peekRecord('plataforma-turma', platTurmaId);
      if (platTurma) {
        this.set('plataforma_turma_id', platTurma.get('id'));
        this.set('selectedPlataformaTurma', platTurma);
      } else {
        this.set('plataforma_turma_id', null);
        this.set('selectedPlataformaTurma', null);
      }
    },

    eraseText() {
      let btnTarget = document.getElementById("pesquisaperfil");
      btnTarget.value = '';
      //  this.set('search', '');
      this.send('filter');
    },

    goToEad() {
      let inst = this.get('store').peekRecord('instituicao', this.get('instituicao_id'));
      let mods = inst.get('modulos');
      this.transitionToRoute('aulas.acompanhamento.ead', {
        queryParams: {
          instituicao_id: this.get('instituicao_id'),
          curso_selected:mods.get('firstObject'),
          anos: mods.get('firstObject').get('id'),
          page: 1,
        }
      });
    },
  }

});
