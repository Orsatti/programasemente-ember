import Controller from '@ember/controller';
import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Controller.extend({
  pagedContent: pagedArray('model'),
  store: Ember.inject.service(),
  aulasController: Ember.inject.controller('aulas'),
  parentController: Ember.inject.controller('aulas'),
  
  queryParams: ["selected_segmento_id", "selected_ano_id", "selected_turma_id", "instituicao_id"],

  pessoa: Ember.computed('model',function(){
    let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
    return this.get('store').peekRecord('pessoa',infosLogged.id);
  }),

  instituicao:Ember.computed('model',function(){
      var id = this.get('pessoa').get('instituicao').get('id');
      return this.get('store').peekRecord('instituicao', id);
  }),

  selectedSegmento: '',
  segmentos:Ember.computed('model',function(){
    debugger;
    let listaSegmentos = [];
    let plataformaAnos = this.get('instituicao').get('plataformaAnos');
    plataformaAnos.forEach(pa => {
       var listaIds = listaSegmentos.map(x => x.get('id'));
       if(listaIds.indexOf(pa.get('segmento').get('id')) == -1){
          listaSegmentos.push(pa.get('segmento'));
       }
    });
    return listaSegmentos.sort(function(a, b){ return a.get('id') - b.get('id') });
  }).property('instituicao_id'),
  selected_segmento_id: Ember.computed('model', function () {
    var firstObject = this.get('segmentos').get('firstObject');
    this.set('selectedSegmento', firstObject);
    return firstObject.get('id');
  }),

  selectedPlataformaAno: '',
  plataformaAnos: Ember.computed('model', function () {
    let plataformaAnos = this.get('instituicao').get('plataformaAnos').filterBy('segmento.idx', this.get('selectedSegmento').get('idx'));
    return plataformaAnos;
  }).property('selected_segmento_id'),
  
  selectedPlataformaTurma: '',
  plataformaTurmas: Ember.computed('model', function () {
    let plataformaTurmas = this.get('instituicao').get('plataformaTurmas');
    if (this.get('selectedPlataformaAno') != null){
      plataformaTurmas = plataformaTurmas.filterBy('plataformaAno.idx', this.get('selectedPlataformaAno').get('idx'));
    }
    return plataformaTurmas;
  }).property('selected_segmento_id', 'selected_ano_id'),

  acompanhamentoSistemas: Ember.computed('model', function () {
    return this.get('model').get('acompanhamentoSistemasPlataforma');
  }),

  selectedFilteredRole: 'aluno',
  
  alunos: Ember.computed('model', function () {
    return this.get('model').get('acompanhamentoPessoasPlataforma').filterBy('role', 'aluno');
  }).property("selected_segmento_id", "selected_ano_id", "selected_turma_id", "instituicao_id"),

  professores: Ember.computed('model', function () {
    return this.get('model').get('acompanhamentoPessoasPlataforma').filterBy('role', 'instrutor');
  }).property("selected_segmento_id", "selected_ano_id", "selected_turma_id", "instituicao_id"),

  platAnoFiltered: false,

  search: Ember.computed('model', function () {
    return "";
  }),

  haveEad: Ember.computed('model', function () {
    let mods = this.get('parentController.inst_selected').get('modulos').content.length;
    if(mods > 0) return true;
    return false;
  }),

  actions: {
    toggleRole(selectedRole) {
      this.get('aulasController').send('toggleRole', selectedRole)
    },

    refreshSelectedFilteredRole(selectedRole) {
      this.set('selectedFilteredRole', selectedRole);
    },

    refreshSelectedSegmento(selectedSegmento) {
      this.set('selected_segmento_id', selectedSegmento.get('id'));
      this.set('selectedSegmento', selectedSegmento);
      this.send('refreshSelectedAno', "");
      this.send('refreshSelectedTurma', "");
      this.set('platAnoFiltered', false);
    },

    refreshSelectedAno(platAnoId) {
      let platAno = this.get('store').peekRecord('plataforma-ano', platAnoId);
      if (platAno) {
        this.set('selected_ano_id', platAno.get('id'));
        this.set('selectedPlataformaAno', platAno);
        this.set('platAnoFiltered', true);
      } else {
        this.set('selected_ano_id', null);
        this.set('selectedPlataformaAno', null);
        this.set('platAnoFiltered', false);
      }
      this.send('refreshSelectedTurma', "");
    },

    refreshSelectedTurma(platTurmaId) {
      let platTurma = this.get('store').peekRecord('plataforma-turma', platTurmaId);
      if (platTurma) {
        this.set('selected_turma_id', platTurma.get('id'));
        this.set('selectedPlataformaTurma', platTurma);
      } else {
        this.set('selected_turma_id', null);
        this.set('selectedPlataformaTurma', null);
      }
    },

    eraseText() {
      let btnTarget = document.getElementById("pesquisaperfil");
      btnTarget.value = '';
      this.send('filter');
    },

    goToEad() {
      let inst = this.get('store').peekRecord('instituicao', this.get('instituicao_id'));
      let mods = inst.get('modulos');
      let segmento = '';
      this.get('segmentos').forEach(function (seg){ 
        if(seg.get('titulo') == 'Ensino Médio') segmento = seg;
      });
      let plataformaAnos = [];
      inst.get('plataformaAnos').forEach(function (pa) {
        if(pa.get('segmento').get('id') == segmento.get('id')) plataformaAnos.pushObject(pa);
      });
      this.transitionToRoute('aulas.acompanhamento.ead', {
        queryParams: {
          instituicao_id: this.get('instituicao_id'),
          curso_selected: mods.get('firstObject'),
          page: 1,
          selectedPlataformaAno: plataformaAnos.get('firstObject'),
          selected_ano_id: plataformaAnos.get('firstObject').get('id'),
        }
      });
    },
  }

});
