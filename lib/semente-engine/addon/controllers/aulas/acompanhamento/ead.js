import Controller from '@ember/controller';
import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';
import ENV from '../../../config/environment';

export default Controller.extend({
  aulasController: Ember.inject.controller('aulas'),
  parentController: Ember.inject.controller('aulas.acompanhamento'),
  store: Ember.inject.service(),
  queryParams: ["page", "perPage", "ordem", "str_search", "selected_ano_id", "selected_turma_id", "shouldReviewProfile"],
  appController: Ember.inject.controller('application'),
  pagedContent: pagedArray('model'),
  envnmt: ENV.APP,
  ordem: 'az',
  shouldReviewProfile: Ember.computed('model', () => {
    return false;
  }),
  page: Ember.computed.alias('pagedContent.page'),
  perPage: Ember.computed.alias('pagedContent.perPage'),
  stylePerPageText: Ember.computed('model', function() {
    return `${parseInt(this.get('perPage'))*48 + 50}px`
  }),
  totalPessoas: Ember.computed.alias('pagedContent.content.meta.page.total'),
  modulos: Ember.computed.alias('aulasController.inst_selected.modulos'),

  selectedContent: 'g',
  inst_selected: Ember.computed('model', function(){
    return this.get('store').peekRecord('instituicao', this.get('instituicao_id'));
  }),

  segmentos:Ember.computed('model', function () {
    let segmentos = this.get('inst_selected').get('plataformaAnos').map(function (ano) {return ano.get('segmento')});
    segmentos = segmentos.filter(this.onlyUnique);
    return segmentos;
  }),
  onlyUnique: function (value, index, self) {
    return self.map(x => x.get('id')).indexOf(value.get('id')) === index;
  },

  curso_selected: Ember.computed('model', function(){
    let mods = this.get('inst_selected').get('modulos');
    return mods.get('firstObject');
  }),

  selectedModuloName: '',
  selectedTurmaName: '',

  hasChildren: Ember.computed('model', function () {
    if (this.get('inst_selected').get('instituicaoFilhas').content.length > 1) return true;
    return false;
  }),

  pessoaLogged: Ember.computed('model', function () {
    let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
    return this.get('store').peekRecord('pessoa', infosLogged.id);
  }),

  acompanhamentosatividades: Ember.computed('instituicao_id', function () {
    this.get('store').findRecord('instituicao', this.get('inst_selected').get('id'), { include: 'acompanhamentos-atividade-instituicao', reload: true });
    return this.get('inst_selected').get('acompanhamentosatividades');
  }),

  showLoader: true,
  endLoader: Ember.computed('model', function () {
    document.getElementsByName('loader-').forEach(elem => {
      elem.style.display = "none";
    })
    this.set('showLoader', false);
  }),

  plataformaAnos: Ember.computed('model', function () {
    let segmento = '';
    this.get('segmentos').forEach(function (seg){ 
      if(seg.get('titulo') == 'Ensino Médio') segmento = seg;
    });
    let plataformaAnos = [];
    this.get('inst_selected').get('plataformaAnos').forEach(function (pa) {
      if(pa.get('segmento').get('id') == segmento.get('id')) plataformaAnos.pushObject(pa);
    });
    return plataformaAnos;
  }),

  plataformaTurmas: Ember.computed('model', function () {
    let plataformaAnos = this.get('plataformaAnos')
    let plataformaTurmas = [];
    this.get('inst_selected').get('plataformaTurmas').forEach(function (pt) {
      plataformaAnos.forEach(function (pa){
        if(pt.get('plataformaAno').get('id') == pa.get('id')) plataformaTurmas.pushObject(pt);
      });
    })
    return plataformaTurmas;
  }),
  
  actions: {
    goToPlataforma(seg){
      this.get('parentController').set('selectedSegmentoLocal', seg);
      this.transitionToRoute('aulas.acompanhamento.plataforma',{
        queryParams: {
          segmento_id: seg.get('id'),
          page: 1,
        }
      })
    },

    pagedsearch() {
      let busca = document.getElementById('search_input_pessoas_adm').value;
      if (busca.length >= 3) {
        this.set('admdataLoaderState', 1);
        this.set('str_search', busca);
      }
      if (busca === null || busca === '' || busca === ' ') {
        this.set('admdataLoaderState', 1);
        this.set('str_search', '');
      }
      this.get('pagedContent').set('page', 1);

    },

    exitpagedsearch() {
      document.getElementById('search_input_pessoas_adm').value = '';
      this.set('admdataLoaderState', 1);
      this.set('str_search', '');
      this.get('pagedContent').set('page', 1);
    },
    
    refreshContent(c) {
      this.set('selectedContent', c);
    },

    setExibir() {
      let exib = document.getElementById('amount').value;
      this.get('pagedContent').set('page', 1);
      this.get('pagedContent').set('perPage', exib);
    },
    
    selectPessoa(id) {
      this.transitionToRoute('aulas.acompanhamento.persondetails', id);
    },
    
    downloadFile() {
      let user = JSON.parse(localStorage.getItem('person_logged')).id;
      if (document.getElementById('detalhado').classList.contains('btn--is-active')){
        window.location.href = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/relatorios/alunos?pessoaId=' + user + '&instituicaoId=' + this.get('instituicao_id');
        $("#downloading").addClass("alert--is-show");
        setTimeout(function(){ $("#downloading").removeClass("alert--is-show"); }, 4000);
      } 
    },

    selectedPlataformaAno(selectedPlatAnoId){
      this.set('selectedPlataformaTurma', "");
      this.set('selected_turma_id', null);
      this.set('selectedTurmaName', "");
      var selectedPlatAno = this.get('store').peekRecord('plataforma-ano', selectedPlatAnoId);
      this.set('selectedPlataformaAno', selectedPlatAno);
      this.set('selected_ano_id', selectedPlatAno.get('id'));
      this.set('selectedModuloName', selectedPlatAno.get('name'));

      let modulo = '';
      this.get('inst_selected').get('modulos').forEach(function (mod) {
        if(selectedPlatAno.get('idx') == 10 && mod.get('idx') == 1) modulo = mod;
        if(selectedPlatAno.get('idx') == 11 && mod.get('idx') == 2) modulo = mod;
        if(selectedPlatAno.get('idx') == 12 && mod.get('idx') == 3) modulo = mod;
      });
      this.set('curso_selected', modulo);
    },

    selectedPlataformaTurma(selectedPlatTurmaId){
      if (selectedPlatTurmaId != "") {
        var selectedPlatTurma = this.get('store').peekRecord('plataforma-turma', selectedPlatTurmaId);
        this.set('selectedPlataformaTurma', selectedPlatTurma);
        this.set('selected_turma_id', selectedPlatTurma.get('id'));
        this.set('selectedTurmaName', " - " + selectedPlatTurma.get('name'));

        let turma = '';
        let modulo = this.get('curso_selected');
        this.get('inst_selected').get('turmas').forEach(function (tur){
          if(selectedPlatTurma.get('name') == tur.get('name') && modulo.get('id') == tur.get('modulo').get('id')) turma = tur;
        })
        this.set('turma_selected', turma);
        this.set('filtered_turma', true);
      } else {
        this.set('selectedPlataformaTurma', "");
        this.set('turma_selected', "");
        this.set('filtered_turma', false);
        this.set('selected_turma_id', null);
        this.set('selectedTurmaName', "");
      }
    },
  }
});