import Controller from '@ember/controller';
import Ember from 'ember';
import ENV from '../../config/environment';


export default Controller.extend({
  store: Ember.inject.service(),
  applicationController: Ember.inject.controller('application'),
  session: Ember.inject.service('session'),
  envnmt: ENV.APP,
  env: ENV.APP,

  timeoutIcon: null,
  timeoutTxt: null,
  timeoutAlert(param) {
    const tAlert = document.getElementById('timeoutAlertUser');

    if (param == 'close') {
      setTimeout(function () {
        tAlert.classList.remove('alert--is-show');
      }, 5000);
    } else{
      if (param == 'error') this.set('timeoutIcon', 'error');
      this.timeoutAlert('close');
    }
  },

  shouldReview: Ember.computed('model', function(){
    let pessoa = this.get('model');
    if (pessoa.get('shouldReviewProfile')){
        this.transitionToRoute('profile.review', pessoa.get('id'));
    }
  }),
  uri_avatar: Ember.computed('model', function(){ //change avatar image
    let pessoa = this.get('model');
    if (pessoa.get('uriAvatar')){
      return pessoa.get('uriAvatar');
    }
    return new Ember.String.htmlSafe("/assets/img/avatar-default.svg");
  }),
  sendAvatarToServer() { //change avatar image
    let file = this.get('selected_file_avatar');
    let pessoalogged = JSON.parse(localStorage.getItem('person_logged'));
    if (file) {
      let header = localStorage.getItem('person_logged');
      let header_inst;
      if (header) {
        header = JSON.parse(header);
        header_inst = header.id;
      } else header_inst = "";
      let sessionData = this.get('session.data');
      let tok = sessionData.authenticated.access_token;
      let temp = 'Bearer ';
      let userToken = temp.concat(tok);
      let final_url = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/pessoas/avatar';
      return new Ember.RSVP.Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', final_url);
        xhr.responseType = 'json';
        xhr.onreadystatechange = handler;
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=x1x2y3y4z5z6');
        xhr.setRequestHeader('pessoaid', header_inst);
        xhr.setRequestHeader('Authorization', userToken);
        xhr.setRequestHeader('filename', file.name);
        xhr.send(file);

        function handler() {
          if (this.readyState === this.DONE) {
            if (this.status === 200 || this.status === 204) {
              let avatarBack = this.response.included[0].attributes['uri-avatar'];
              pessoalogged.uri_avatar = avatarBack;
              localStorage.setItem("person_logged", JSON.stringify(pessoalogged));
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
    }
  },
  instituicao: Ember.computed('model', function(){
    return this.get('model').get('instituicao');
  }),
  dataNascimento: Ember.computed('model', function(){
    let pessoa = this.get('model');
    if (pessoa.get('nascimento')){
      return pessoa.get('dataNascimento');
    }
    return 'sem data';
  }),
  pessoa: Ember.computed('model', function(){
    return this.get('model');
  }),
  passwordChanged: Ember.computed('', function() {
    return false;
  }),
  isAplicador:Ember.computed('model', function(){
    return this.get('model').get('isAplicador');
  }),
  segmentos: Ember.computed('pessoa', function () {
    return this.get('store').peekAll('segmento').toArray().sort(function(a, b){return a.id-b.id});
  }),
  plataformaAnos:Ember.computed('model',function(){
    return this.get('pessoa').get('instituicao').get('plataformaAnos');
}),
  plataformaTurmas:Ember.computed('model',function(){
      return this.get('pessoa').get('instituicao').get('plataformaTurmas');
  }),
  makeCustomCall(verb, url, json) {
    let header = localStorage.getItem('person_logged');
    let header_inst;
    if (header) {
      header = JSON.parse(header);
      header_inst = header.id;
    } else {
      header_inst = "";
    }
    let sessionData = this.get('session.data');
    let tok = sessionData.authenticated.access_token;
    let temp = 'Bearer ';
    let userToken = temp.concat(tok);
    return new Ember.RSVP.Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open(verb, url);
      xhr.responseType = 'json';
      xhr.onreadystatechange = handler;
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('content-type', 'application/json');
      xhr.setRequestHeader('data-type', 'application/json');
      xhr.setRequestHeader('pessoaid', header_inst);
      xhr.setRequestHeader('Authorization', userToken);
      xhr.send(json);

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
  afterRenderInformation: Ember.computed('model',function(){
    this.get('pessoa').get('plataformaTurmas').forEach(pt => {
        document.getElementById('plat_turma' + pt.get('id')).checked = true;
    })
  }),
  actions: {
    buscarArquivoAvatar: function(event) { //change avatar image
      const file = event.target.files[0];
      this.set('selected_file_avatar', file);
      let bloburl = URL.createObjectURL(file);
      this.set('uri_avatar', bloburl);
      this.get('model').set('uriAvatar', bloburl);
      this.sendAvatarToServer();
    },
    changePw() {
      let pwd_old = document.getElementById('pass_profile').value;
      let pwd_new = document.getElementById('pass_new_profile').value;
      let pwd_conf = document.getElementById('pass_new_profile_copy').value;
      this.set('success_pwd', '');
      this.set('error_pwd', '');
      if (pwd_new.length < 6) {
        this.set('error_pwd', 'Mínimo de 6 caracteres');
      } else if (pwd_new !== pwd_conf) {
        this.set('error_pwd', 'Nova senha e confirmação devem ser iguais');
      } else {
        let final_url = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/accounts/changePassword';
        let string = JSON.stringify({
          'data': {
            'id': '1',
            'type': 'change-password',
            'attributes': {
              'oldpassword': pwd_old,
              'newpassword': pwd_new,
              'confirmpassword': pwd_conf
            }
          }
        });
        let that = this;
        this.makeCustomCall('POST', final_url, string).then(() => {
          that.set('success_pwd', 'Sucesso! Senha alterada');
          setTimeout(() => {
            that.set('success_pwd', '');
          }, 5000);
          that.set('error_pwd', '');
          document.getElementsByTagName('body')[0].style.overflow = 'auto';
        }).catch(() => {
          that.set('success_pwd', '');
          that.set('error_pwd', 'A senha atual informada não está correta.');
        });
      }
    },
    updatePasswordChanged() {
      this.set('passwordChanged', true);
    },

    saveChanges() {
      let login = document.getElementById('login').value;
      let pessoa = this.get('pessoa');
      pessoa.set('email', login)

      this.get('pessoa').save().then(function(){
          window.location.reload(true);
      }).catch((reason) => {
        if (reason.errors) {
          reason.errors.forEach((error) => {
            if (error.status === "400") {
              const tAlert = document.getElementById('timeoutAlertUser');
              tAlert.classList.add('alert--is-show');
              this.set('timeoutTxt', 'O novo login informado já está sendo utilizado por outra pessoa');
              this.timeoutAlert('error');
            }
          })
        }
      })
    },

    refreshGenero(event) {
      this.get('pessoa').set('genero', event.target.value);
    },

    selectAno() {
      let platAnos = this.get('store').peekAll('plataforma-ano');
      let platAnosSelected = [];

      platAnos.forEach(pa => {
        var checkbox = document.getElementById('plat_ano' + pa.id);
        if (checkbox.checked) {
          platAnosSelected.pushObject(pa);
        }
      })

      this.get('pessoa').set('plataformaAnos', platAnosSelected);
      this.get('pessoa').set('hasDirtyAttributes', true);
    },

    addPAPT(plataformaTurmaId){
      let platTurma = this.get('store').peekRecord('plataforma-turma', plataformaTurmaId);
      let platAno = this.get('store').peekRecord('plataforma-ano', platTurma.get('plataformaAno').get('id'));
      let checkbox = document.getElementById('plat_turma' + plataformaTurmaId).checked;
      if (checkbox) {
        this.get('pessoa').get('plataformaTurmas').pushObject(platTurma);
          var platAnoIds = this.get('pessoa').get('plataformaAnos').map(x => x.get('id'));
          if(platAnoIds.indexOf(platAno.get('id')) == -1){
            this.get('pessoa').get('plataformaAnos').pushObject(platAno);
          }
      } else {
        this.get('pessoa').get('plataformaTurmas').removeObject(platTurma);
          var platAnoIds = this.get('pessoa').get('plataformaTurmas').map(x => x.get('plataformaAno').get('id'));
          if(platAnoIds.indexOf(platAno.get('id')) == -1){
            this.get('pessoa').get('plataformaAnos').removeObject(platAno);
          }
      }
    },

    goToAulas(){
      //window.history.back();
       this.transitionToRoute('aulas.index');
    },
  }
});
