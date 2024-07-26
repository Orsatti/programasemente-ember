import Controller from '@ember/controller';
import Ember from 'ember';
import ENV from '../../../config/environment';

export default Controller.extend({
  envnmt: ENV.APP,
  session: Ember.inject.service(),
  store: Ember.inject.service(),

  oneInst: false,
  pessoaLogged: Ember.computed('model',function(){
    let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
    return this.get('store').peekRecord('pessoa', infosLogged.id);
  }),

  error_lote: '',
  erro_lista: '',
  selected_file: '',
  wait_lote: true,
  lista_lote: '',
  historyLote: true,
  preProcessamento: false,

  loadInfo:Ember.computed('model',function(){
    this.refreshListaLote();
  }),

  refreshListaLote() {
    this.getListaLote().then((response) => {
      let lista = response.data;
      let pessoaId = this.get('pessoaLogged').get('id');
      let result = [];
      let refresh;
      lista.forEach(item => {
        let actionUser = response.included.find(el => {
          if (el.id == item.relationships.pessoa.data.id)
            return el;
        });

        let link;
        if (item.attributes.status === "Sucesso" || item.attributes.status === "Realizada com Erros") {
          link = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/cadastrolotes/download?id=' + item.id + '&pessoaId=' + pessoaId;
        }
        if (item.attributes.status === "Processando") refresh = true;
        let obj = {
          'id': item.id,
          'pessoaNome': actionUser.attributes.name,
          'data': moment(1000 * item.attributes.data).format('D/M/Y hh:mm a'),
          'nomeArquivo': item.attributes.nomeArquivo,
          'quantidadeDeUsuarios': item.attributes.quantidadeDeUsuarios,
          'status': item.attributes.status,
          'usuariosNaoProcessados': item.attributes.usuariosNaoProcessados,
          'usuariosProcessados': item.attributes.usuariosProcessados,
          'link': link
        };
        result.pushObject(obj);
      });
      var spinner = document.getElementById('spinner-importar-lote');
      if (refresh) {
        this.refreshListaLote();
        spinner.style.display = "flex";
      } else {
        spinner.style.display = "none";
      }
      this.set('wait_lote', false);
      this.set('lista_lote', result);
    }).catch((erro) => {
      this.set('wait_lote', false);
      this.set('erro_lista', erro);
    });
  },

  getListaLote() {
    let pessoaId = this.get('pessoaLogged').get('id');
    let instituicaoId = this.get('model.instituicao').get('id');
    let sessionData = this.get('session.data');
    let tok = sessionData.authenticated.access_token;
    let temp = 'Bearer ';
    let userToken = temp.concat(tok);

    let final_url = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/cadastrolotes?include=pessoas';
    return new Ember.RSVP.Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', final_url);
      xhr.responseType = 'json';
      xhr.onreadystatechange = handler;
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('pessoaid', pessoaId);
      xhr.setRequestHeader('instituicaoid', instituicaoId);
      xhr.setRequestHeader('Authorization', userToken);
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200 || this.status === 204) {
            resolve(this.response);
          } else if (this.status === 404) {
            reject('Server not found');
          } else if (this.status >= 400) {
            reject(new Error(this.response.error));
          } else {
            reject(new Error('Failure from server call: [' + this.status + ']'));
          }
        }
      }
    });
  },

  sendFiletoServer(file, isPre) {
    let pessoaId = this.get('pessoaLogged').get('id');
    let instituicaoId = this.get('model.instituicao').get('id');
    let sessionData = this.get('session.data');
    let tok = sessionData.authenticated.access_token;
    let temp = 'Bearer ';
    let userToken = temp.concat(tok);

    let final_url = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/pessoas/cadastroLoteMedio';
    if(isPre) final_url = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/pessoas/preCadastroLoteMedio';
    return new Ember.RSVP.Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', final_url);
      xhr.responseType = 'json';
      xhr.onreadystatechange = handler;
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=x1x2y3y4z5z6');
      xhr.setRequestHeader('pessoaid', pessoaId);
      xhr.setRequestHeader('instituicaoid', instituicaoId);
      xhr.setRequestHeader('Authorization', userToken);
      xhr.setRequestHeader('filename', document.getElementById('get_lote').files[0].name);
      xhr.send(file);

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200 || this.status === 204) {
            resolve(this.response);
          } else if (this.status === 404) {
            reject('Server not found');
          } else if (this.status >= 400) {
            reject(new Error(this.response.error));
          } else {
            reject(new Error('Failure from server call: [' + this.status + ']'));
          }
        }
      }
    });
  },

  actions: {
    baixarTemplate() {
      let pessoaId = this.get('pessoaLogged').get('id');
      let instituicaoId = this.get('model.instituicao').get('id');
      window.location.href = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/pessoas/templatecargalote?pessoaId=' + pessoaId + '&instituicaoId=' + instituicaoId;
    },

    buscarArquivo() {
      let file_name = document.getElementById('get_lote').files[0].name;
      this.set('selected_file', file_name);
    },

    preImportarLote(){
      let file_lote = document.getElementById('get_lote').files[0];
      let that = this;
      if (file_lote) {
          this.sendFiletoServer(file_lote, true).then((response) => {
            this.set('error_lote', '');
            this.set('erro_lista', '');
            this.set('historyLote', false);
            this.set('preProcessamento', true);

            var errosPlanilha = response.filterBy('type', 'Planilha');
            this.set('errosPlanilha', errosPlanilha);

            var infosInstituicao = response.filterBy('type', 'Instituição');
            this.set('infosInstituicao', infosInstituicao);
            
            var spinner = document.getElementById('spinner-importar-lote');
            spinner.style.display = "none";
            
            
            if (infosInstituicao.length == 1) {
              this.set('oneInst', true);
            }

        }).catch((erro) => {
          this.set('timeoutTxt', "ocorreu um erro ao pré processar o arquivo");
        });

        var spinner = document.getElementById('spinner-importar-lote');
        spinner.style.display = "flex";
      } else {
        this.set('selected_file', '');
        this.set('error_lote', 'impossivel achar arquivo');
      }
    },

    importarLote() {
      let file_lote = document.getElementById('get_lote').files[0];

      if (file_lote) {
          this.sendFiletoServer(file_lote, false).then(() => {
          this.set('error_lote', '');
          this.set('erro_lista', '');
          this.set('wait_lote', true);
          this.set('selected_file', '');
          this.set('lista_lote', '');
          this.set('historyLote', true);
          this.set('preProcessamento', false);
          document.getElementById('get_lote').value = '';
          this.refreshListaLote();
          document.getElementsByTagName('body')[0].style.overflow = 'auto';
        }).catch((erro) => {
          this.set('timeoutTxt', "ocorreu um erro ao importar o arquivo");
          this.refreshListaLote();
        });

        var spinner = document.getElementById('spinner-importar-lote');
        spinner.style.display = "flex";
      } else {
        this.set('selected_file', '');
        this.set('error_lote', 'impossivel achar arquivo');
      }
    },

    abrirPasso() {
        document.getElementById("passoapasso").classList.toggle('img-passoapasso');
    },
    giro() {
      document.getElementById("seta").classList.toggle('giro');
    },

    showDetails(id){
      let el = document.getElementById('detalhes-' + id);
      if(el.style.display == 'none') el.style.display = 'flex';
      else el.style.display = 'none';
    },

  }
})