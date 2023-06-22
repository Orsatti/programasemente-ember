import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  store: Ember.inject.service(),
  aulasController: Ember.inject.controller('aulas'),
  parentController: Ember.inject.controller('aulas'),

  queryParams: ["selected_segmento_id", "selected_ano_id", "selected_turma_id"],

  pessoa: Ember.computed('model',function(){
    let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
    return this.get('store').peekRecord('pessoa', infosLogged.id);
  }),

  isMedio: false,
  isAdulto: false,
  segmentos:Ember.computed('model',function(){
    this.set('selectedSegmento', this.get('model.selectedSegmento'));
    if(this.get('model.selectedSegmento').get('idx') == 4) this.set('isMedio', true);
    if(this.get('model.selectedSegmento').get('idx') == 6) this.set('isAdulto', true);

    let listaSegmentos = [];
    let plataformaAnos = [];
    if(this.get('model') != null) plataformaAnos = this.get('model.instituicao').get('plataformaAnos');
    plataformaAnos.forEach(pa => {
       var listaIds = listaSegmentos.map(x => x.get('id'));
       if(listaIds.indexOf(pa.get('segmento').get('id')) == -1){
          listaSegmentos.push(pa.get('segmento'));
       }
    });
    let sorted = listaSegmentos.sort(function(a, b){ return a.get('id') - b.get('id') });
    if(sorted.length == 0) return this.get('store').peekAll('segmento').sortBy('idx');
    return sorted;
  }),

  selectedPlataformaAno: '',
  plataformaAnos: Ember.computed('model', function () {
    var platAnosPortal = this.get('model.instituicao').get('instituicaoPlataformaAnoSistema').filterBy('sistema.idx', 1).mapBy('plataformaAno');
    let plataformaAnos = [];
    if(this.get('selectedSegmento') != null) plataformaAnos = platAnosPortal.filterBy('segmento.idx', this.get('selectedSegmento.idx'));
    let sorted = plataformaAnos.toArray().sort(function (a, b){
      if(a.get("name") < b.get("name")) return -1;
      if(a.get("name") > b.get("name")) return 1;
      return 0;
    })
   return sorted;
  }).property('selected_segmento_id'),

  selectedPlataformaTurma: '',
  plataformaTurmas: Ember.computed('model', function () {
    let plataformaTurmas = this.get('model.instituicao').get('plataformaTurmas');
    if (this.get('selectedPlataformaAno') != null){
      plataformaTurmas = plataformaTurmas.filterBy('plataformaAno.idx', this.get('selectedPlataformaAno').get('idx'));
    }
    let sorted = plataformaTurmas.toArray().sort(function (a, b){
      if(a.get("name") < b.get("name")) return -1;
      if(a.get("name") > b.get("name")) return 1;
      return 0;
    })
    return sorted;
  }).property('selected_segmento_id', 'selected_ano_id'),

  acompanhamentoSistemas: Ember.computed('model', function () {
    return this.get('model.acompanhameto').get('acompanhamentoSistemasPlataforma');
  }),

  selectedFilteredRole: 'aluno',

  acompanhamentoPessoas: Ember.computed('model', function () {
    return this.get('model.acompanhameto').get('acompanhamentoPessoasPlataforma');
  }),

  platAnoFiltered: false,

  search: Ember.computed('model', function () {
    return "";
  }),

  selectedContent: 'geral',
  acompanhamentoAtividade: Ember.computed('model', function () {
    return this.get('model.acompanhameto').get('acompanhamentoAtividadesPlataforma');
  }),

  haveEad: Ember.computed('model', function () {
    let mods = this.get('parentController.inst_selected').get('modulos').content.length;
    if(mods > 0) return true;
    return false;
  }),

  page: 1,
  per_page: 10,
  totalPessoas: 0,
  pessoasDetalhado: Ember.observer('model',function() {
    let that = this;
    this.get('store').query('pessoa', {
      instituicao_id: this.get('model.instituicao').get('id'),
      selected_ano_id: this.get('selected_ano_id'),
      selected_turma_id: this.get('selected_turma_id'),
      ordem: '',
      role: 'aluno',
      page: this.get('page'),
      per_page: this.get('per_page'),
      str_search: this.get('search'),
      include: 'acompanhamento-atividades'
    }).then(function(response) {
      that.set('totalPessoas', response.content.length)
      that.set('pessoasDetalhadoL', response);
  });
  }).property("selected_ano_id", "selected_turma_id", "search", "page"),


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
      if(selectedSegmento.get('idx') == 4) this.set('isMedio', true);
      else this.set('isMedio', false);
      if(selectedSegmento.get('idx') == 6) this.set('isAdulto', true);
      else this.set('isAdulto', false);
      this.send('refreshSelectedAno', "");
      this.send('refreshSelectedTurma', "");
      this.set('platAnoFiltered', false);
      this.set('selectedContent', 'geral');
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

    refreshContent(c) {
      this.set('selectedContent', c);
      var first = this.get('plataformaAnos').get('firstObject');
      this.set('selectedPlataformaAno', first);
      this.set('selected_ano_id', first.get('id'));
    },

    goToGerAcompanhamento(){
      this.set('selected_segmento_id', null);
      this.set('selectedSegmento', null);
      this.set('selected_ano_id', null);
      this.set('selectedPlataformaAno', null);
      this.set('selected_turma_id', null);
      this.set('selectedPlataformaTurma', null);
      this.set('isMedio', false);
      this.set('isAdulto', false);
      this.transitionToRoute('geracompanhamento');
    },
  }

});
