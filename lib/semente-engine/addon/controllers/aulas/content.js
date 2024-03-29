import Controller from '@ember/controller';
import Ember from 'ember';
import ENV from '../../config/environment';

export default Controller.extend({
  envnmt: ENV.APP,
  annotationsSorting: ['id:desc'],
  sortedAnnotations: Ember.computed.sort('anotacoes', 'annotationsSorting'),
  appController: Ember.inject.controller('application'),
  thisRoute: Ember.run('render', function(){
    if(window.location.pathname.includes('aulas')) {
      return 'aulas';
    }
  }),
  store: Ember.inject.service(),
  sendSuggestion: false,
  newAnotacao: false,
  showToggle: false,
  pessoa: Ember.computed('model', function(){ return this.get('model.pessoa'); }),
  role:Ember.computed('model', function(){ return this.get('model.pessoa').get('role'); }),
  parentController: Ember.inject.controller('aulas'),
  aula: Ember.computed('model', function(){ 
    return this.get('model.aula'); 
  }),

  livros: Ember.computed('aula', function () {
    let livros = this.get('store').peekAll('livro').filterBy('plataformaAno.id', this.get('aula').get('plataformaAno').get('id'));
    return livros;
  }).property('model.aula'),

  plataformaTurmas: Ember.computed('model', function(){
    let list = [];
    this.get('model.pessoa').get('plataformaTurmas').forEach(pt => {
      if(pt.get('plataformaAno').get('id') == this.get('aula').get('plataformaAno').get('id')) list.pushObject(pt);
    })
    return list;
  }),

  TurmasAplicadas: Ember.computed('aula', function(){ 
    let turmasAplicadas = this.get('aula').get('aplicacoes').filterBy('aplicado', true).filterBy('pessoa.id', this.get('pessoa.id')).mapBy('turma');
    return turmasAplicadas
  }).property('model.aula'),

  UltimaAplicacao: Ember.computed('aula', function(){
    let ultimaData =  this.get('aula').get('aplicacoes').filterBy('aplicado', true).filterBy('pessoa.id', this.get('pessoa.id')).sortBy('dataAplicacao').reverse()[0];
    return ultimaData;
   }).property('model.aula'),

  selectedAgrupamento: 'Básico',
  conteudos: Ember.computed('aula', function(){
    let conts = this.get('aula.plataformaConteudos');
    if (['gestor', 'coordenador', 'admin'].includes(this.get('pessoa.role'))){
      return conts.filterBy('situacao', true).filterBy('agrupamento.name', this.get('selectedAgrupamento'));
    }
     return conts.filter(c => c.get('publicos').mapBy('name').includes(this.get('pessoa.role'))).filterBy('situacao', true).filterBy('agrupamento.name', this.get('selectedAgrupamento'))
  }).property('model.aula', 'selectedAgrupamento'),

  stopVideo: false,
  stopVideoEad: false,
  endVideo: Ember.computed('model', function(){
    return false;
  }),

  toggleConteudoModal(target) {
    var el = document.getElementById('content-modal');
    $(el).toggleClass('modal--is-show');
    //document.getElementById("header_layout").removeAttribute('style');
    $('body').toggleClass('overflow-hidden no-header');
  },

  tarefa: Ember.computed('model', function(){
    let pessoa = this.get('pessoa');
    let aula = this.get('aula');
    let tarefa;
    pessoa.get('tarefas').forEach(function(t){
      if (t.get('aula').get('id') == aula.get('id')){
        tarefa = t;
      }
    });
    return tarefa;
  }),

  avaliacao: Ember.computed('model', function(){
    let pessoa = this.get('pessoa');
    return pessoa.get('avaliacoes').filterBy('aula.id', this.get('aula').get('id'))[0];
  }).property('model.aula'),

  anotacoes: Ember.computed('model', function(){
    let pessoa = this.get('pessoa');
    return pessoa.get('anotacoes').filterBy('aula.id', this.get('aula').get('id'));
  }),
  activeAula: true,
  todasAulas: Ember.computed('model', function(){ return this.get('store').findAll('aula', {include: 'plataforma-ano'}) }),

  actions: {
    voltar() {
      this.set('endVideo', false);
      this.transitionToRoute('aulas');
      //window.location.reload();
    },

    refreshSelectedAula(selectedAulaId) {
      let aula = this.get('store').peekRecord('aula', selectedAulaId);
      this.set('aula', aula);
    },
    refreshSelectedAgrupamento(selectedAgrupamento){
      this.set('selectedAgrupamento', selectedAgrupamento);
    },
    toggleModal(conteudoId){
      this.set('stopVideo', false);
      var conteudo = this.get('model.aula.plataformaConteudos').filterBy('id', conteudoId).get('firstObject');
      this.set('selectedConteudo', conteudo);
      this.toggleConteudoModal();
    },
    closeConteudoModal() {
      this.set('stopVideo', true);
      this.set('selectedConteudo', null);
      this.set('endVideo', false);
      this.toggleConteudoModal();
    },

    toggleModalEad(params) {
      this.set('videoId', '');
      this.set('videoName', '');
      this.set('stopVideoEad', false);
      this.set('videoId', params[0]);
      this.set('videoName', params[1]);
      var el = document.getElementById('content-modal-ead');
      $(el).toggleClass('modal--is-show');
      $('body').toggleClass('overflow-hidden no-header');
    },
    closeConteudoModalEad() {
      this.set('stopVideoEad', true);
      this.set('videoId', '');
      this.set('videoName', '');
      var el = document.getElementById('content-modal-ead');
      $(el).toggleClass('modal--is-show');
      $('body').toggleClass('overflow-hidden no-header');

    },

    refreshTarefa(){
      let tarefa = this.get('tarefa');
      let check = document.getElementById('checkbox-tarefa').checked;
      if (tarefa){
        tarefa.set('realizado', check);
        tarefa.save();
      } else {
        let newTarefa = this.get('store').createRecord('tarefa',{
          pessoa: this.get('pessoa'),
          aula: this.get('aula'),
          realizado: check,
        });
        newTarefa.save();
      }
    },

    avaliar(nota){
      let avaliacao = this.get('avaliacao');
      if (avaliacao){
        avaliacao.set('nota', nota);
        avaliacao.save();
      } else{
        let newAvaliacao = this.get('store').createRecord('avaliacao',{
          pessoa: this.get('pessoa'),
          aula: this.get('aula'),
          nota: nota
        });
        newAvaliacao.save();
      }

      let rating = document.querySelector('#rating');
      if(rating.classList.contains('blink')) {
        rating.classList.remove('blink');
      }

      setTimeout(function() {
        rating.classList.add('blink');
      }, 1);

    },

    createAnotacao() {
      let textArea = document.getElementById('nova-anotacao');
      let texto = textArea.value;
      let newAnotacao = this.get('store').createRecord('anotacao', {
        texto: texto,
        pessoa: this.get('pessoa'),
        aula: this.get('aula')
      });
      newAnotacao.save();
      this.get('anotacoes').pushObject(newAnotacao);
      this.set('newAnotacao', false);
      // this.send('toggleCreateAnotacao');
      // this.set('anotacoes', this.get('anotacoes').pushObject(newAnotacao));
    },

    cancelAnotacao(){
      this.set('newAnotacao', false);
    },

    deleteAnotacao(id) {
      let anotacao = this.get('store').peekRecord('anotacao', id);
      this.get('anotacoes').removeObject(anotacao);
      anotacao.destroyRecord();
    },

    toggleCreateAnotacao() {
      this.set('newAnotacao', true);
      setTimeout(function(){
        let textArea = document.getElementById('nova-anotacao');
        textArea.value = '';
        textArea.focus();
      }, 1);
    },

    checkFill() {
      let target = event.target;

      if (target.value.length >= 80) {
        this.set('sendSuggestion', true)
      } else {
        this.set('sendSuggestion', false)
      }
    },

    showTooltip() {
      if (this.get('sendSuggestion')) {
        this.set('showTooltip', false);
      } else {
        this.set('showTooltip', true);
      }
    },

    hideTooltip() {
     this.set('showTooltip', false);
    },

    sendSuggestion() {
      let aula = this.get('aula').get('titulo')
      let ano = this.get('aula').get('plataformaAno').get('name');
      let segmento = this.get('aula').get('plataformaAno').get('segmento').get('titulo');

      let suggestionBox = document.getElementById('suggestion');
      let benefitBox = document.getElementById('benefit');

      let localTok = JSON.parse(localStorage.getItem('person_logged'));

      let mailBody =
        "<html>" +
        "<body>" +
        "<meta name='viewport' content='width=device-width' />" +
        "<table border='0' cellpadding='0' cellspacing='0'>" +
        "<tr>" +
        "<td>" +
        "<table border='0' cellpadding='0' cellspacing='0'>" +
        "<tr>" +
        "<td style='color: #25212a; display: block; margin: 0 auto; max-width: 100%; padding: 16px; text-align: left; width: 640px;'>" +
        "<h1 style='text-transform: uppercase; font-size: 20px; letter-spacing: .1em; border-bottom: 1px solid #efeff0; margin: 0 0 24px; padding-bottom: 8px;'>Sugestão para <span class='color-leaf-50'>" + aula + "</span> | <span class='color-leaf-50'>" + ano + " </span> | <span class='color-leaf-50'>" + segmento + "</span></h1>" +
        "<ul style='list-style: none; margin: 0; padding: 0;'>" +
        "<li style='margin-bottom: 16px; margin-left: 0;'><strong style='font-size: 12px; letter-spacing: .1em; text-transform: uppercase;'>E-mail do sugestor:</strong> " + localTok.email + "</li>" +
        "<li style='margin-bottom: 16px; margin-left: 0;'><strong style='font-size: 12px; letter-spacing: .1em; text-transform: uppercase;'>Nome do sugestor:</strong> " + localTok.name + "</li>" +
        "<li style='margin-bottom: 16px; margin-left: 0;'><strong style='font-size: 12px; letter-spacing: .1em; text-transform: uppercase;'>Instituição do sugestor:</strong> " + localTok.instituicao_name + "</li>" +
        "<li style='margin-bottom:  0px; margin-left: 0;'><strong style='font-size: 12px; letter-spacing: .1em; text-transform: uppercase;'>Sugestão:</strong> " + suggestionBox.value + "</li>" +
        "<li style='margin-bottom:  0px; margin-left: 0;'><strong style='font-size: 12px; letter-spacing: .1em; text-transform: uppercase;'>Benefício apontado pelo sugestor:</strong> " + benefitBox.value + "</li>" +
        "</ul>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</body>" +
        "</html>";

      let url = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/emails-semente';
      let params = JSON.stringify({
        "data": {
          "type": "email-semente",
          "id": "0",
          "attributes": {
            "email-origem": "portal@sementeeducacao.com.br",
            "email-destino": "sugestoes@sementeeducacao.com.br",
            "assunto": "Sugestão de " + localTok.name + " para melhoria de aula",
            "plain-text": "Melhoria de aula",
            "html-content": mailBody,
            //"meta-dados": "{path: " + location.pathname + ", screen: " + window.screen.width + 'x' + window.screen.height + ", browser: " + browserName + "}"
          },
          "relationships": {
            "pessoa": {
              "data": [{
                "type": "pessoa",
                "id": localTok.id.toString()
              }]
            }
          }
        }
      });

      this.get('appController').makeCustomCall('POST', url, params).then(() => {

      }).catch(() => {

      });

        suggestionBox.value = '';
        benefitBox.value = '';
        this.set('sendSuggestion', false);
        document.getElementById('suggestionSent').classList.add('suggestions__sent--is-show');
        setTimeout(() => {
          document.getElementById('suggestionSent').classList.remove('suggestions__sent--is-show');
        }, 3500);


    }

  },
});
