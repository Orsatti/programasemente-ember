import Controller from '@ember/controller';
import Ember from 'ember';
import moment from 'moment';
import ENV from '../../config/environment';
import pagedArray from 'ember-cli-pagination/computed/paged-array';
import { toggle } from '../../helpers/toggle';

export default Controller.extend({
  envnmt: ENV.APP,
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  pagedContent: pagedArray('model'),

  pessoaLogged: Ember.computed('model',function(){
    let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
    return this.get('store').peekRecord('pessoa', infosLogged.id);
  }),

  instituicaoId: 0,
  instituicao: Ember.computed('model', function(){
    this.set('instituicaoId', this.get('model').otherParams.instituicao_id);
    return this.get('store').peekRecord('instituicao', this.get('model').otherParams.instituicao_id);
  }),

  role: Ember.computed('model',function(){
     return this.get('pessoaLogged').get('role');
  }),

  selectedSegmento: '',
  segmentos:Ember.computed('model',function(){
    return this.get('store').peekAll('segmento');
  }),

  selectedPlataformaAno: '',
  plataformaAnos:Ember.computed('model',function(){
    return this.get('store').peekRecord('instituicao', this.get('instituicaoId')).get('plataformaAnos');
  }),

  selectedPlataformaTurma: '',
  plataformaTurmas:Ember.computed('model',function(){
      return this.get('store').peekRecord('instituicao', this.get('instituicaoId')).get('plataformaTurmas');
  }),

  queryParams: ["page", "perPage", "ordem", "str_search", "selected_segmento_id", "selected_ano_id", "selected_turma_id"],
  page: Ember.computed.alias('pagedContent.page'),
  perPage: Ember.computed.alias('pagedContent.perPage'),
  totalPessoas: Ember.computed.alias('pagedContent.content.meta.page.total'),
  sortCol: 'name',
  sortAsc: true,
  ordem: 'az',
  reSort: 0,
  gerdataLoaderState: 0,

  paginationSelected: {
    p5: false,
    p10: true,
    p25: false,
    p50: false,
    p100: false,
    p500: false,
    p1000: false
  },

  pessoas_sorted: Ember.computed('pagedContent.content', 'sortCol', 'sortAsc', 'reSort', function () {
    let people = this.get('pagedContent.content');
    if (people) {
      let sortCol = this.get('sortCol');
      if (this.get('sortAsc') && this.get('reSort') < 3)
        return people.sortBy(sortCol, 'DimensionName');
      else return people.sortBy(sortCol, 'DimensionName').reverse();
    } else return [];
  }),

  observeSearch: function () {
    let busca = document.getElementById('search_input_pessoas_ger').value;
    this.set('gerdataLoaderState', 1);
    this.set('str_search', busca);
    if (busca === null || busca === '' || busca === ' ') {
      this.set('str_search', '');
    }
    this.get('pagedContent').set('page', 1);
  }.observes('searchVal'),

  contentChanged: Ember.observer('pagedContent.content', function () {
    this.set('gerdataLoaderState', 0);
  }),
  

//   setLocation: Ember.observer('instituicaoId', function () {
//     if (this.get('instituicaoId') == 0) {
//       if (JSON.parse(localStorage.getItem('person_logged')).role == 'admin') {
//         this.get('gerController').set('inst_selected', false);
//       } else {
//         this.set('instituicaoId', JSON.parse(localStorage.getItem('person_logged')).instituicaoId);
//         this.transitionToRoute('gersistema.gerdata', {
//           queryParams: {
//             instituicaoId: JSON.parse(localStorage.getItem('person_logged')).instituicaoId,
//             page: 1
//           }
//         });
//       }
//     }
//   }),
//   
//   failedEmailsList: [],
// //------------------------------------------------------------------------------------------------------
//   solicitaListaLote() {
//     if (this.get('allow_refresh')) {
//       setTimeout(function () {
//         this.refreshListaLote();
//       }, 1000);
//     }
//   },
//   refreshListaLote() {
//     this.getListaLote().then((response) => {
//       let lista = response.data;
//       let data_ls = localStorage.getItem('person_logged');
//       if (data_ls) {
//         data_ls = JSON.parse(data_ls);
//       }
//       let result = [];
//       let refresh;
//       lista.forEach(item => {
//         let actionUser = response.included.find(el => {
//           if (el.id == item.relationships.pessoa.data.id)
//             return el;
//         });

//         let link;
//         if (item.attributes.status === "Sucesso" || item.attributes.status === "Realizada com Erros") {
//           link = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/cadastrolotes/download?id=' + item.id + '&pessoaId=' + data_ls.id;
//         }
//         if (item.attributes.status === "Processando") refresh = true;
//         let obj = {
//           'id': item.id,
//           'pessoaNome': actionUser.attributes.name,
//           'data': moment(1000 * item.attributes.data).format('D/M/Y hh:mm a'),
//           'nomeArquivo': item.attributes.nomeArquivo,
//           'quantidadeDeUsuarios': item.attributes.quantidadeDeUsuarios,
//           'status': item.attributes.status,
//           'usuariosNaoProcessados': item.attributes.usuariosNaoProcessados,
//           'usuariosProcessados': item.attributes.usuariosProcessados,
//           'link': link
//         };
//         result.pushObject(obj);
//       });
//       var spinner = document.getElementById('spinner-importar-lote');
//       if (refresh) {
//         this.solicitaListaLote();
//         spinner.style.display = "inline-block";
//       } else {
//         spinner.style.display = "none";
//       }
//       this.set('wait_lote', false);
//       this.set('lista_lote', result);
//     }).catch((erro) => {
//       this.set('wait_lote', false);
//       this.set('erro_lista', erro);
//     });
//   },
//   getListaLote() {
//     let header = localStorage.getItem('person_logged');
//     let header_inst;
//     if (header) {
//       header = JSON.parse(header);
//       header_inst = header.id;
//     } else {
//       header_inst = "";
//     }
//     let inst = this.get('inst_selected');
//     let sessionData = this.get('session.data');
//     let tok = sessionData.authenticated.access_token;
//     let temp = 'Bearer ';
//     let userToken = temp.concat(tok);
//     // alterar url com include de pessoas
//     let final_url = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/cadastrolotes?include=pessoas';
//     return new Ember.RSVP.Promise(function (resolve, reject) {
//       let xhr = new XMLHttpRequest();
//       xhr.open('GET', final_url);
//       xhr.responseType = 'json';
//       xhr.onreadystatechange = handler;
//       xhr.setRequestHeader('Accept', 'application/json');
//       xhr.setRequestHeader('pessoaid', header_inst);
//       xhr.setRequestHeader('instituicaoid', inst.id);
//       xhr.setRequestHeader('Authorization', userToken);
//       xhr.send();

//       function handler() {
//         if (this.readyState === this.DONE) {
//           if (this.status === 200 || this.status === 204) {
//             resolve(this.response);
//           } else if (this.status === 404) {
//             reject('Server not found');
//           } else if (this.status >= 400) {
//             reject(new Error(this.response.error));
//           } else {
//             reject(new Error('Failure from server call: [' + this.status + ']'));
//           }
//         }
//       }
//     });
//   },
//   sendFiletoServer(file) {
//     let header = localStorage.getItem('person_logged');
//     let header_inst;
//     if (header) {
//       header = JSON.parse(header);
//       header_inst = header.id;
//     } else {
//       header_inst = "";
//     }
//     let inst = this.get('inst_selected');
//     let sessionData = this.get('session.data');
//     let tok = sessionData.authenticated.access_token;
//     let temp = 'Bearer ';
//     let userToken = temp.concat(tok);
//     let final_url = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/pessoas/cadastroloteMedio';
//     return new Ember.RSVP.Promise(function (resolve, reject) {
//       let xhr = new XMLHttpRequest();
//       xhr.open('POST', final_url);
//       xhr.responseType = 'json';
//       xhr.onreadystatechange = handler;
//       xhr.setRequestHeader('Accept', 'application/json');
//       xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=x1x2y3y4z5z6');
//       xhr.setRequestHeader('pessoaid', header_inst);
//       xhr.setRequestHeader('instituicaoid', inst.id);
//       xhr.setRequestHeader('Authorization', userToken);
//       xhr.setRequestHeader('filename', document.getElementById('get_lote').files[0].name);
//       xhr.send(file);

//       function handler() {
//         if (this.readyState === this.DONE) {
//           if (this.status === 200 || this.status === 204) {
//             resolve(this.response);
//           } else if (this.status === 404) {
//             reject('Server not found');
//           } else if (this.status >= 400) {
//             reject(new Error(this.response.error));
//           } else {
//             reject(new Error('Failure from server call: [' + this.status + ']'));
//           }
//         }
//       }
//     });
//   },
//   zera_Progressos(pessoa_id) {
//     let header = localStorage.getItem('person_logged');
//     let header_inst;
//     if (header) {
//       header = JSON.parse(header);
//       header_inst = header.id;
//     } else {
//       header_inst = "";
//     }
//     let inst = this.get('inst_selected');
//     let sessionData = this.get('session.data');
//     let tok = sessionData.authenticated.access_token;
//     let temp = 'Bearer ';
//     let userToken = temp.concat(tok);
//     let final_url = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/pessoas/zerarProgressos/' + pessoa_id;
//     return new Ember.RSVP.Promise(function (resolve, reject) {
//       let xhr = new XMLHttpRequest();
//       xhr.open('POST', final_url);
//       xhr.responseType = 'json';
//       xhr.onreadystatechange = handler;
//       xhr.setRequestHeader('Accept', 'application/json');
//       xhr.setRequestHeader('pessoaid', header_inst);
//       xhr.setRequestHeader('instituicaoid', inst.id);
//       xhr.setRequestHeader('Authorization', userToken);
//       xhr.send();

//       function handler() {
//         if (this.readyState === this.DONE) {
//           if (this.status === 200 || this.status === 204) {
//             resolve(this.response);
//           } else if (this.status === 404) {
//             reject('Server not found');
//           } else if (this.status >= 400) {
//             reject(new Error(this.response.error));
//           } else {
//             reject(new Error('Failure from server call: [' + this.status + ']'));
//           }
//         }
//       }
//     });
//   },
//   userListReload() {
//     let tg = this.get('str_search');

//     if (tg == '' || tg == null) this.set('str_search', ' ');
//     else this.set('str_search', '');

//     document.getElementById('search_input_pessoas_ger').value = null;
//   },
//   
//   timeoutIcon: null,
//   /* laod | error | success */
//   timeoutTxt: null,
//   staticType: null,
//   /* checklist | mail | failed | delete | progress */
//   staticTxt1: null,
//   staticTxt2: null,
//   staticList: null,
//   timeoutAlert(param) {
//     const tAlert = document.getElementById('timeoutAlertUser');

//     if (param == 'close') {
//       setTimeout(function () {
//         tAlert.classList.remove('alert--is-show');
//       }, 2500);
//     } else {
//       tAlert.classList.add('alert--is-show');

//       if (param == 'load') this.set('timeoutIcon', 'load');
//       else {
//         if (param == 'error') this.set('timeoutIcon', 'error');
//         if (param == 'success') this.set('timeoutIcon', 'success');

//         this.timeoutAlert('close');
//       }
//     }
//   },
  
//   

//   // ### TOGGLE ###
//   toggle(param) {
//     return toggle(param);
//   },


//   ValidaCPFValido(strCPF) {
//     var Soma;
//     var Resto;
//     Soma = 0;

//     strCPF = strCPF.replace(".", "");
//     strCPF = strCPF.replace(".", "");
//     strCPF = strCPF.replace("-", "");
//     strCPF = strCPF.trim();

//     if (strCPF == "00000000000") return false;

//     for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
//     Resto = (Soma * 10) % 11;

//     if ((Resto == 10) || (Resto == 11)) Resto = 0;
//     if (Resto !== parseInt(strCPF.substring(9, 10))) return false;

//     Soma = 0;
//     for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
//     Resto = (Soma * 10) % 11;

//     if ((Resto == 10) || (Resto == 11)) Resto = 0;
//     if (Resto !== parseInt(strCPF.substring(10, 11))) return false;
//     return true;
//   },

//   refreshAcessoS(){
//     let id = document.getElementById('new_user_ano').value;
//     if(id != "" && id != "0"){
//       let platAno = this.get('store').peekRecord('plataforma-ano', id);
  
//       if(!(platAno.get('idx') > 5 && platAno.get('idx') < 13 || platAno.get('idx') > 13 && platAno.get('idx') <= 20)){
//         if(this.get('sEnabled')){
//           this.set('new_user_acessoPlataformaS', false);
//           document.getElementById('new_user_acessoPlataformaS').checked = false;
//         }
//       }
//     }
//   },


  actions: {
    baixarTemplateAtivos() {
      let instituicao = this.get('instituicao');
      let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
      window.location.href = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/pessoas/templateativos?pessoaId=' + infosLogged.id + '&instituicaoId=' + instituicao.get('id');
    },

    exitsearch() {
      document.getElementById('search_input_pessoas_ger').value = '';
      this.set('str_search', '');
      this.get('pagedContent').set('page', 1);
    },

    setExibir() {
      let exib = document.getElementById('amount').value;
      this.get('pagedContent').set('page', 1);
      this.get('pagedContent').set('perPage', exib);
    },

    setSort(param) {
      if (this.get('sortCol') === param && this.get('sortAsc')) {
        this.set('sortAsc', false);
      } else {
        this.set('sortCol', param);
        this.set('sortAsc', true);
      }
    },

    selectedSegmento(selectedSegmentoId) {
      this.set('selectedPlataformaAno', "");
      this.set('selected_ano_id', null);
      this.set('selectedPlataformaTurma', "");
      this.set('selected_turma_id', null);
      if (selectedSegmentoId != "") {
        var selectedSegmento = this.get('store').peekRecord('segmento', selectedSegmentoId);
        this.set('selectedSegmento', selectedSegmento);
        this.set('selected_segmento_id', selectedSegmentoId);
      } else {
        this.set('selectedSegmento', "");
        this.set('selected_segmento_id', null);
      }
    },

    selectedPlataformaAno(selectedPlatAnoId){
      this.set('selectedPlataformaTurma', "");
      this.set('selected_turma_id', null);
      if (selectedPlatAnoId != "") {
        var selectedPlatAno = this.get('store').peekRecord('plataforma-ano', selectedPlatAnoId);
        this.set('selectedPlataformaAno', selectedPlatAno);
        this.set('selected_ano_id', selectedPlatAnoId);
      } else {
        this.set('selectedPlataformaAno', "");
        this.set('selected_ano_id', null);
      }
    },

    selectedPlataformaTurma(selectedPlatTurmaId){
      if (selectedPlatTurmaId != "") {
        var selectedPlatTurma = this.get('store').peekRecord('plataforma-turma', selectedPlatTurmaId);
        this.set('selectedPlataformaTurma', selectedPlatTurma);
        this.set('selected_turma_id', selectedPlatTurmaId);
      } else {
        this.set('selectedPlataformaTurma', "");
        this.set('selected_turma_id', null);
      }
    },

    // refreshSelectedInstFilha(selectedIstFilhaId) {
    //   var selectedInstFilha = this.get('store').findRecord('instituicao', selectedIstFilhaId, {include: 'plataforma-anos.segmento, plataforma-turmas.plataforma-ano'});
    //   this.set('selectedInstFilha', selectedInstFilha);
    //   this.set('selected_instituicao_filha', selectedIstFilhaId);
    // },
    

    

    


    // userSave(param) {
    //   if (this.validateUserForm()) {
    //     this.set('timeoutTxt', "Há erros no preenchimento, favor revisar");
    //     this.timeoutAlert('error');
    //   } else {
    //     this.set('timeoutTxt', this.alertTxt.load.saving);
    //     this.timeoutAlert('load');
    //     let userToSave = null;
    //     let name = document.getElementById('new_user_name').value;
    //     let role = document.getElementById('new_user_role').value;
    //     let email = document.getElementById('new_user_email').value;
    //     let phone = document.getElementById('new_user_phone').value;
    //     let senha = document.getElementById('new_user_senha').value;
    //     let cpf = document.getElementById('new_user_cpf').value;
    //     let login = document.getElementById('new_user_login').value;
    //     let genero = document.getElementById('new_user_gender').value;
    //     let acessoS = false;
    //     if(this.get('sEnabled')){
    //       acessoS = document.getElementById('new_user_acessoPlataformaS').checked;
    //      }
    //     let matricula, nascimento;
    //     if (role == 'aluno'){
    //       //matricula = document.getElementById('new_user_subsc').value;
    //       nascimento = document.getElementById('new_user_birth').value;
    //     }
    //     let inst = this.get('inst_selected');
    //     let enabled = document.getElementById('new_user_enabled').checked;

    //     // inputs values verification
    //     let errors = 0;

    //     // save edited user
    //     if (param) {
    //       let pessoa = this.get('pessoa_selected');
    //       let inst = this.get('inst_selected');
    //       pessoa.set('emailsent', false);
    //       pessoa.set('name', name);
    //       pessoa.set('instituicao', inst)
    //       pessoa.set('genero', genero);
    //       if (role == 'aluno') {
    //         pessoa.set('nascimentoPlataforma', nascimento)
    //       }
    //       pessoa.set('emailCadastrado', email);
    //       pessoa.set('telefone', phone);
    //       pessoa.set('cpf', cpf);
    //       pessoa.set('email', login);
    //       pessoa.set('enabled', enabled);
    //       pessoa.set('role', role);
    //       pessoa.set('senha', senha);
    //       this.get('modulos').forEach((mod) => {
    //         pessoa.get('modulos').removeObject(mod);
    //       });
    //       if (role == 'aluno' || role == 'instrutor') {
    //         let turmas = pessoa.get('turmas');
    //         turmas.forEach(tur => {
    //           pessoa.get('turmas').removeObject(tur);
    //         });
    //       }
    //       pessoa.set('acessoPlataformaS', acessoS);
    //       userToSave = pessoa;
    //     }
    //     // save new user
    //     else {
    //       let pessoa;
    //       if (role == 'aluno'){
    //         pessoa = {
    //           "name": name,
    //           "emailCadastrado": email,
    //           "telefone": phone,
    //           "senha": senha,
    //           "enabled": enabled,
    //           "role": role,
    //           "instituicao": inst,
    //           "genero": genero,
    //           "matricula": matricula,
    //           "nascimentoPlataforma": nascimento,
    //           "email": login,
    //           "cpf": cpf
    //         };
    //       } else{
    //         pessoa = {
    //           "name": name,
    //           "emailCadastrado": email,
    //           "telefone": phone,
    //           "senha": senha,
    //           "genero": genero,
    //           "enabled": enabled,
    //           "role": role,
    //           "instituicao": inst,
    //           "email": login,
    //           "cpf": cpf
    //         };
    //       }

    //       let obj_pessoa = this.get('store').createRecord('pessoa', pessoa);
    //       obj_pessoa.set('acessoPlataformaS', acessoS);
    //       if (role == 'instrutor'){
    //         let anos = this.get('selectedPlataformaAnos');
    //         anos.forEach(function(ano){
    //           obj_pessoa.get('plataformaAnos').pushObject(ano);
    //           obj_pessoa.set('isAplicador', true);
    //         })
    //       }

    //       if (role == 'aluno'){
    //         let ano = this.get('selectedPlataformaAnos');
    //         ano.forEach(function(a){
    //           obj_pessoa.get('plataformaAnos').pushObject(a);
    //         })

    //         let turma = this.get('selectedPlataformaTurma');
    //         turma.forEach(function(t){
    //           obj_pessoa.get('plataformaTurmas').pushObject(t);
    //         })
    //       }
    //       userToSave = obj_pessoa;
    //     }
    //     // if inputs values validated save
    //     if (errors === 0) {
    //       userToSave.save().then(() => {
    //         this.set('user_modulos', '');
    //         this.set('new_user_id', '');
    //         this.set('new_user_name', '');
    //         this.set('new_user_role', '');
    //         this.set('new_user_email', '');
    //         this.set('new_user_phone', '');
    //         this.set('new_user_cpf', '');
    //         this.set('new_user_login', '');
    //         this.set('new_user_senha', '');
    //         this.set('new_user_enabled', false);
    //         if(this.get('sEnabled')){
    //           this.set('new_user_acessoPlataformaS', false);
    //           document.getElementById('new_user_acessoPlataformaS').checked = false;
    //         }
    //         this.set('new_user_aplicador', false);
    //         this.set('new_user_gender', '');
    //         this.set('new_user_birth', '');
    //         this.set('new_user_ano', '');
    //         this.set('new_user_turma', '');
    //         this.set('new_user_inst', '');
    //         this.set('perfil', '');
    //         document.getElementById('userModal').classList.remove('modal--is-show');
    //         document.getElementsByTagName('body')[0].style.overflow = 'auto';
    //         if (param) {
    //           this.set('timeoutTxt', this.alertTxt.success.users.edited);
    //           this.timeoutAlert('success');
    //           document.querySelector('body').classList.remove('no-header');
    //         } else {
    //           this.set('timeoutTxt', this.alertTxt.success.users.created);
    //           this.timeoutAlert('success');
    //           document.querySelector('body').classList.remove('no-header');
    //         }
    //         this.userListReload();
    //       }).catch((reason) => {
    //         if (reason.errors) {
    //           reason.errors.forEach((error) => {
    //             if (error.status === "500") {
    //               this.set('timeoutTxt', this.alertTxt.error.server);
    //               this.timeoutAlert('error');
    //             } else if (error.status === "401") {
    //               localStorage.clear();
    //               this.get('session').invalidate();
    //               this.set('timeoutTxt', this.alertTxt.error.session);
    //               this.timeoutAlert('error');
    //             } else if (error.status === "400") {
    //               this.set('timeoutTxt', error.title);
    //               this.timeoutAlert('error');
    //             } else {
    //               this.set('timeoutTxt', this.alertTxt.error.connection);
    //               this.timeoutAlert('error');
    //             }
    //           })
    //         } else if (reason.message) {
    //           this.set('timeoutTxt', this.alertTxt.error.unknown);
    //           this.timeoutAlert('error');
    //         } else {
    //           this.set('timeoutTxt', this.alertTxt.error.unknown);
    //           this.timeoutAlert('error');
    //         }
    //       });
    //     }
    //   }
    // },

    // // ------------------------------------- lot registration
    // cadastroLote() {
    //   document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    //   document.getElementById('lote_modal').classList.add('modal--is-show');
    //   document.getElementsByTagName('body')[0].classList.add('overflow-hidden');
    //   this.set('error_lote', '');
    //   this.set('erro_lista', '');
    //   this.set('wait_lote', true);
    //   this.set('selected_file', '');
    //   this.set('lista_lote', '');
    //   this.set('allow_refresh', true);
    //   this.refreshListaLote();
    // },
    // // ------------------------------ cancel lot registration
    // cancelLote() {
    //   document.getElementsByTagName('body')[0].style.overflow = 'auto';
    //   document.getElementById('get_lote').value = '';
    //   document.getElementById('lote_modal').classList.remove('modal--is-show');
    //   document.getElementsByTagName('body')[0].classList.remove('overflow-hidden');
    //   this.set('error_lote', '');
    //   this.set('wait_lote', false);
    //   this.set('selected_file', '');
    //   this.set('erro_lista', '');
    //   this.set('lista_lote', '');
    //   this.set('allow_refresh', false);
    // },
    // // ------------------- lot registration template download
    // baixarTemplate() {
    //   let inst = this.get('inst_selected');
    //   let header = localStorage.getItem('person_logged');
    //   let header_inst;
    //   if (header) {
    //     header = JSON.parse(header);
    //     header_inst = header.id;
    //   } else {
    //     header_inst = "";
    //   }
    //   window.location.href = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/pessoas/templatecargalote?pessoaId=' + header_inst + '&instituicaoId=' + inst.id;
    // },
    // // --------------------- lot registration template search
    // buscarArquivo() {
    //   let file_name = document.getElementById('get_lote').files[0].name;
    //   this.set('selected_file', file_name);
    // },
    // // --------------------- lot registration template import
    // importarLote() {
    //   let file_lote = document.getElementById('get_lote').files[0];

    //   if (file_lote) {
    //       this.sendFiletoServer(file_lote).then(() => {
    //       this.set('error_lote', '');
    //       this.set('erro_lista', '');
    //       this.set('wait_lote', true);
    //       this.set('selected_file', '');
    //       this.set('lista_lote', '');
    //       this.set('allow_refresh', true);
    //       document.getElementById('get_lote').value = '';
    //       this.refreshListaLote();
    //       this.userListReload();
    //       document.getElementsByTagName('body')[0].style.overflow = 'auto';
    //     }).catch((erro) => {
    //       this.set('timeoutTxt', "ocorreu um erro ao importar o arquivo");
    //       this.timeoutAlert('error');
    //       this.refreshListaLote();
    //     });

    //     var spinner = document.getElementById('spinner-importar-lote');
    //     spinner.style.display = "inline-block";
    //   } else {
    //     this.set('selected_file', '');
    //     this.set('error_lote', 'impossivel achar arquivo');
    //   }
    // },
    // deletePessoa(param) {
    //   // document.getElementById('userActionOptions' + param).classList.remove('submenu--each-animation-is-show');
    //   this.set('listingChecked', false);
    //   this.set('selectedToDelete', true);
    //   let pessoa = this.get('store').peekRecord('pessoa', param);
    //   let confirm_entity = {
    //     'name': pessoa.get('name'),
    //     'id': pessoa.get('id'),
    //     'type': 'pessoa'
    //   };
    //   this.set('confirm_entity', confirm_entity);
    //   this.set('staticTxt2', this.alertTxt.confirmation.user.delete);
    //   this.staticAlert('delete');
    // },
    // cancelDel() {
    //   this.set('confirm_entity', '');
    //   this.staticAlert('close');
    // },
    // confirmDel(params) {
    //   document.getElementById("button-confirm-delete").disabled = true;
    //   this.set('timeoutTxt', this.alertTxt.load.deleting);
    //   this.timeoutAlert('load');
    //   let type = params.type;
    //   let id = params.id;
    //   let obj = this.get('store').peekRecord(type, id);
    //   obj.destroyRecord().then(() => {
    //     document.getElementById("button-confirm-delete").disabled = false;
    //     let linha = document.getElementById("linha-pessoa-" + id);
    //     if (linha) linha.classList.add("d--none");
    //     this.userListReload();
    //     this.set('confirm_entity', '');
    //     this.staticAlert('close');
    //     this.set('timeoutTxt', this.alertTxt.success.users.deleted);
    //     this.timeoutAlert('success');
    //   }).catch((reason) => {
    //     document.getElementById("button-confirm-delete").disabled = false;
    //     if (reason.errors) {
    //       reason.errors.forEach((error) => {
    //         if (error.status === "500") {
    //           this.set('timeoutTxt', this.alertTxt.error.server);
    //           this.timeoutAlert('error');
    //         } else if (error.status === "401") {
    //           this.set('timeoutTxt', this.alertTxt.error.session);
    //           this.timeoutAlert('error');
    //         } else {
    //           this.set('timeoutTxt', error.title);
    //           this.timeoutAlert('error');
    //         }
    //       })
    //     } else if (reason.message) {
    //       this.set('timeoutTxt', this.alertTxt.error.users.delete);
    //       this.timeoutAlert('error');
    //     } else {
    //       this.set('timeoutTxt', this.alertTxt.error.users.delete);
    //       this.timeoutAlert('error');
    //     }
    //   });
    // },

    

    // 

    // 

    // abrirPasso() {

    //    document.getElementById("passoapasso").classList.toggle('img-passoapasso');

    // },

    // giro() {
    //   document.getElementById("seta").classList.toggle('giro');
    // },

    // verifyPlatAno(){
    //   let id = document.getElementById('new_user_ano').value;
    //   if(id != "" && id != "0"){
    //     let platAno = this.get('store').peekRecord('plataforma-ano', id);

    //     if(!(platAno.get('idx') > 5 && platAno.get('idx') < 13 || platAno.get('idx') > 13 && platAno.get('idx') <= 20)){
    //       this.set('timeoutTxt', "Ano não possui acesso à Plataforma S");
    //       this.timeoutAlert('error');
    //       if(this.get('sEnabled')){
    //         this.set('new_user_acessoPlataformaS', false);
    //         document.getElementById('new_user_acessoPlataformaS').checked = false;
    //       }
    //     }
    //   }
    // },

  }
});


