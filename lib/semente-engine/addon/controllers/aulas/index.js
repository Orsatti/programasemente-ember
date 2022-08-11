import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  role: JSON.parse(localStorage.getItem('person_logged')).role,
  pessoaId: JSON.parse(localStorage.getItem('person_logged')).id,
  parentController: Ember.inject.controller('aulas'),
  session: Ember.inject.service('session'),
  showHeader: Ember.run.schedule('afterRender', function () {
    $('body').removeClass('no-header');
  }),
  thisRoute: Ember.run('render', function () {
    if (window.location.pathname.includes('aulas')) {
      return 'aulas';
    }
  }),
  ordem: "0",
  store: Ember.inject.service(),
  pessoa: Ember.computed('model', function () {
    return this.get('store').peekRecord('pessoa', this.get('pessoaId') );
  }),
  termoAceito: Ember.computed('model', function(){
    let termoInst = this.get('pessoa').get('instituicao').get('statusTermoAceite');
    let termoPessoa = this.get('pessoa').get('termoAceite');
    if(termoInst == true && termoPessoa == false){

    setTimeout(() => {
      $('body').addClass('no-header');
    }, 200);

      this.send('termoAceite');
    }
  }),

  isProfAplicador: Ember.computed('model', function(){
    let pessoa = this.get('pessoa');
    let inst = this.get('pessoa').get('instituicao');
    if(pessoa.get('isAplicador')){
      let platAnos = pessoa.get('plataformaAnos');
      let platTurmas = pessoa.get('plataformaTurmas');
      let platTurmasID = pessoa.get('plataformaTurmas').map(id => id.get('id'));
      let platTurmasInst = inst.get('plataformaTurmas');
      platTurmasInst.forEach(pti => {
        platAnos.forEach(pa => {
          if(pti.get('plataformaAno').get('id') == pa.get('id')){
            if(!platTurmasID.includes(pti.get('id'))){
              platTurmas.push(pti);
            }
          }
        })
      })
      pessoa.save();
    }
  }),

  certificado: Ember.computed('model', function () {
    if(this.get('pessoa').get('role') != 'aluno') return false;
    let aulas = this.get('store').peekAll('aula');
    aulas = aulas.filterBy('plataformaAno.id', this.get('selectedAno').get('id'));
    let nrVideosAssistidos = this.get('pessoa').get('nrVideosAlunos');

    let tarefas = 0;
    if(this.get('selectedAno').get('idx') < 0){
      tarefas = this.get('pessoa').get('tarefas').content.length;
    }
    if (aulas.length <= nrVideosAssistidos || tarefas == aulas.length) {
      return true
    } else {
      return false
    }
  }),

  ejaAcessoMedio: Ember.computed('model', function () {
    let p = JSON.parse(localStorage.getItem('person_logged'));
    let pessoa = this.get('store').peekRecord('pessoa', p.id);
    if(!pessoa.get('ejaAcessoMedio')){
      $('body').addClass('no-header');
      document.getElementById('header_layout').style.zIndex = -1;
      this.send('ejaModal');
    }
  }),

  turmasDoAno: Ember.computed('selectedAno', function(){
    let turmasDoAno = this.get('store').query('plataforma-turma', {plataformaAnoId: this.get('selectedAno').get('id')});
    return turmasDoAno;
  }),

  segmentos: Ember.computed('model', function() {
    return this.get('store').peekAll('segmento').sortBy('idx')
  }),

  selectedDependente: Ember.computed('model', function () {
    return this.get('parentController').get('selectedDependente')
  }),

  selectedSegmento: Ember.computed('model', function () {
    return this.get('segmentos.firstObject')
  }),

  plataformaAnos: Ember.computed('model', function () {
    return this.get('store').peekAll('plataforma-ano').sortBy('idx')
  }),

  isBloco: Ember.computed('', function() {
    let that = this;
    Ember.run.schedule('afterRender', function() {
      that.send('isBloco');
    })
  }),


  selectedAno: Ember.computed('model', function () {
    return this.get('plataformaAnos.firstObject')
  }),

  platanoId: Ember.computed('model', function () {
    return this.get('plataformaAnos.firstObject').get('id')
  }),

  Ano: Ember.computed('model', function () {
    return this.get('plataformaAnos').get('firstObject')
  }),
  livros: Ember.computed('pessoa', function () {
    return this.get('selectedAno').get('livros');
  }).property('selectedAno'),

  aulasFiltradas: Ember.computed('model', function () {
    let aulas = this.get('store').peekAll('aula')
      .filter(x => x.get('plataformaAno.id') == this.get('selectedAno.id'))
      .filter(x => x.get('titulo').toLowerCase().includes(this.get('search').toLowerCase()))
      .sortBy('idx');

    if (this.get('ordem') == "0") {
      return aulas.toArray();
    }
    return aulas.toArray().reverse();
  }).property('selectedSegmento', 'selectedAno', 'search', 'ordem'),


  noCards: false,

  qC() {
    setTimeout(() => {
      let qtde = document.querySelectorAll("[class*='media--card']").length;
      if (qtde === 0) {
        this.set('noCards', true);
      } else {
        this.set('noCards', false);
      }
    }, 1);
  },


  changedAulasFiltradas: Ember.observer('aulasFiltradas', function () {
    this.qC();
  }),

  search: '',
  actions: {
    refreshSelectedSegmento(segmento) {
      this.send('animateCardList');
      this.set('selectedSegmento', segmento);
      this.send('isBloco');
      this.set('selectedAno', segmento.get('plataformaAnos').sortBy('idx').get('firstObject'));
    },
    refreshSelectedSituacao(selectedSituacao) {
      this.set('selectedSituacao', selectedSituacao);
      localStorage.setItem('selectedSituacao', selectedSituacao);
      this.qC();
      this.send('animateCardList');
    },
    refreshSelectedAno(selectedAno) {
      this.set('selectedAno', selectedAno);
    },
    refreshOrdem(ordem) {
      this.set('ordem',ordem);
    },
    eraseText() {
      let btnTarget = document.getElementById("aulapesquisa");
      btnTarget.value = '';
    },
    animateCardList() {
      let currentList = document.querySelector('ul[class*="card-list"]');
      currentList.classList.remove('fadeIn');
      setTimeout(() => {
        currentList.classList.add('fadeIn')
      }, 1);
    },


    isBloco() {
      let segmento = this.get('selectedSegmento');
      if (segmento === 'Ensino Infantil' || segmento === 'Fundamental I') {
        this.set('isBloco', true);
      } else {
        this.set('isBloco', false);
      }
    },

    termoAceite() {
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
      document.getElementById('termo_modal').classList.add('modal--is-show');
      document.getElementsByTagName('body')[0].classList.add('overflow-hidden');
    },
    aceitarTermo(){
      let pessoa = this.get('store').peekRecord("pessoa", this.get('pessoaId'));
      pessoa.set('termoAceite', true);
      pessoa.save().then(() => {
        document.getElementsByTagName('body')[0].style.overflow = 'auto';
        document.getElementById('termo_modal').classList.remove('modal--is-show');
        document.getElementsByTagName('body')[0].classList.remove('overflow-hidden');
        $('body').removeClass('no-header');
      })
    },
    cancelTermo() {
      localStorage.clear();
      this.get('session').invalidate();
    },

    ejaModal(){
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
      document.getElementById('eja_modal').classList.add('modal--is-show');
      document.getElementsByTagName('body')[0].classList.add('overflow-hidden');
    },
    cancelEjaModal(){
      localStorage.clear();
      this.get('session').invalidate();
    },
  },
  init: function () {
    this._super();
    this.set('selectedSituacao', '');
  },


});
