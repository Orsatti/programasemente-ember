import Ember from 'ember';
import Component from '@ember/component';
//import service from 'ember-service/inject';

export default Component.extend({
  router: Ember.inject.service('-routing'),
  store: Ember.inject.service(),
  tagName: '',
  instIgnoraCalendario: Ember.computed('model', function () {
    let ignora = this.get('instituicao').get('ignoraCalendarioMedio');
    return ignora;

  }),
  appstate: Ember.inject.service(),
  instituicao: Ember.computed('model', function () {
    let str = localStorage.getItem('person_logged');
    if (str) {
      str = JSON.parse(str);
      let instituicao = this.get('store').peekRecord('instituicao', str.instituicao_id);
      return instituicao
    }

  }),
  notStudent: Ember.computed('model', function () {
    let str = localStorage.getItem('person_logged');
    if (str) {
      str = JSON.parse(str);
      if (str.role !== 'aluno') {
        return true;
      } else {
        return false;
      }

    }
  }),

  value: Ember.computed('data', 'appstate.upState', function () {
    let idx = this.get('data');
    let percent, itens_completos, total, dataAtual;
    let aula = this.get('appstate').getItem('atividades', idx);
    let resp = this.get('atividade');//   this.get('store').peekRecord('atividade', aula.id);
    dataAtual = new Date();
    let notTravada = resp.get('liberada');
    this.set('notTravada', notTravada);
    let data = resp.get('dia');
    let dataAtividade = new Date(data);
    let mes = parseInt(data.substr(5, 2));
    this.set('dia', parseInt(data.substr(8, 2)));
    this.set('mensagem_mes', 'de Janeiro');
    if (mes == 2) {
      this.set('mensagem_mes', 'de Fevereiro');
    }
    else if (mes == 3) {
      this.set('mensagem_mes', 'de Março');
    }
    else if (mes == 4) {
      this.set('mensagem_mes', 'de Abril');
    }
    else if (mes == 5) {
      this.set('mensagem_mes', 'de Maio');
    }
    else if (mes == 6) {
      this.set('mensagem_mes', 'de Junho');
    }
    else if (mes == 7) {
      this.set('mensagem_mes', 'de Julho');
    }
    else if (mes == 8) {
      this.set('mensagem_mes', 'de Agosto');
    }
    else if (mes == 9) {
      this.set('mensagem_mes', 'de Setembro');
    }
    else if (mes == 10) {
      this.set('mensagem_mes', 'de Outubro');
    }
    else if (mes == 11) {
      this.set('mensagem_mes', 'de Novembro');
    }
    else if (mes == 12) {
      this.set('mensagem_mes', 'de Dezembro');
    }
    this.set('data_ok', false);


    let ignoraCalendario = this.get('instituicao').get('ignoraCalendarioMedio');

    if (dataAtual > dataAtividade || ignoraCalendario == true) {

      this.set('data_ok', true);

    }
    this.set('aula_liberada', false);
    if (aula) {
      percent = aula.percent;
      itens_completos = aula.secoes_completas;
      total = aula.secoes.length;
      let modulo = resp.get('modulo');

      let pessoaLogged = JSON.parse(localStorage.getItem('person_logged'));
      let pessoa = this.get('store').peekRecord('pessoa', pessoaLogged.id);
      let matriculas = pessoa.get('matriculas');
      let moduloId = modulo.get('id');
      let statusVideo;
      matriculas.forEach(mat => {
        if (mat.get('moduloId') == moduloId) {
          statusVideo = mat.get('statusVideoInicio');
        }
      })
      if (statusVideo) {
        let atividade_anterior = modulo.get('atividades').filterBy('idx', resp.get('idx') - 1).get('firstObject');
        if (atividade_anterior) {
          let state_anterior = this.get('appstate').getItem('atividades', atividade_anterior.get('id'));
          if (state_anterior.percent === 100) {
            this.set('aula_liberada', true);
          }
        }
        if (resp.get('idx') === 1) {
          this.set('aula_liberada', true);
        }
      }
    }
    else {
      percent = 0;
      itens_completos = 0;
      total = 0;
    }
    let string = Ember.String.htmlSafe('width: ' + percent + '%;');
    let that = this;
    Ember.run.once(function () {
      that.set('string', string);
      that.set('total', total);
      that.set('itens_completos', itens_completos);
      that.set('modulo', resp.get('modulo'));
      if (aula.secoes[0]) {
        that.set('temSecoes', true);
      }
      else {
        that.set('temSecoes', false);
      }

    });
    return percent;
  }),
  actions: {
    transitToAtividade() {
      this.transit(this.get('atividade.id'));
    }
  },
  init: function () {
    this._super();
    this.get('value');
  }
});
