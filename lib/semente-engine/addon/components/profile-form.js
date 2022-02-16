import Ember from 'ember';
import Component from '@ember/component';
import ENV from '../config/environment';
// import pessoa from '../../../../app/models/pessoa';

Ember.TextField.reopen({
  attributeBindings: ['data-type', 'data-required', 'data-context']
});

Ember.Checkbox.reopen({
  attributeBindings: ['data-type', 'data-required']
});

export default Ember.Component.extend({
  tagName: '',
  session: Ember.inject.service('session'),
  store: Ember.inject.service(),
  envnmt: ENV.APP,
  env: ENV.APP,
  avancarLabel: 'Avançar',
  formValidation: Ember.observer('selectedGenero', 'selectedAno', 'selectedTurma', function () {
    this.removeerrors();
  }),
  platAnos: Ember.computed(function() {
    return this.get('store').peekAll('plataforma-ano').sortBy('idx');
  }),
  removeAllAnos: async function(pessoa){
    
  },
  correctCPF: Ember.computed('pessoa', function() {
    let cpf = this.get('pessoa').get('cpf');
    cpf = cpf.replace(/\D/g, "");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    this.get('pessoa').set('cpf', cpf);
  }),
  plataformaAnosToHide: Ember.computed(function () {
    let pessoa = this.get('pessoa');
    let idxToHide = [];
    if (pessoa.get('role') == 'aluno') {
      idxToHide = [-2, -1, 1, 2, 3, 4, 5];
    }
    let plataformaAnos = pessoa.get('instituicao').get('plataformaAnos');
    let plataformaAnosToHide = [];
    plataformaAnos.forEach(pa => {
      if (idxToHide.includes(pa.get('idx'))) {
        plataformaAnosToHide.pushObject(pa);
      }
    });
    return plataformaAnosToHide;
  }),
  segmentos: Ember.computed('pessoa', function () {
    return this.get('store').peekAll('segmento').sortBy('id');
  }),
  uri_avatar: Ember.computed('model', function () { //change avatar image
    let pessoa = this.get('pessoa');
    if (pessoa.get('uriAvatar')) {
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
  actions: {
    buscarArquivoAvatar: function(event) { //change avatar image
      const file = event.target.files[0];
      this.set('selected_file_avatar', file);
      let bloburl = URL.createObjectURL(file);
      this.set('uri_avatar', bloburl);
    },
    refreshSelectedGenero(selectedGenero) {
      let pessoa = this.get('pessoa');
      pessoa.set('genero', selectedGenero);
      this.set('selectedGenero', selectedGenero);
    },
    refreshSelectedAno(selectedPlatAnoId) {
      if (!selectedPlatAnoId == "") {
        let pessoa = this.get('pessoa');
        let ano = this.get('store').peekRecord('plataforma-ano', selectedPlatAnoId);
        pessoa.set('plataformaAnos', [ano]);
        // pessoa.get('plataformaAnos').pushObject(ano);
        this.set('selectedAno', ano);
        this.send('refreshSelectedPlataformaTurma', ano.get('plataformaTurmas').get('firstObject').get('id'));
      } else {
      }
    },
    refreshSelectedPlataformaTurma(plataformaTurmaId) {
      if (!plataformaTurmaId == "") {
        let pessoa = this.get('pessoa');
        let turma = this.get('store').peekRecord('plataforma-turma', plataformaTurmaId);
        pessoa.set('plataformaTurmas', [turma]);
        // pessoa.get('plataformaTurmas').pushObject(turma);
        this.set('selectedTurma', turma);
      } else {
        this.set('selectedTurma', "");
      }
    },

    saveProfile(pessoa) {
      pessoa = this.get('store').peekRecord('pessoa', pessoa.get('id'));
      if (!pessoa.get('email')) {
        debugger;
        pessoa.set('email', pessoa.get('userName'));
      }
      if (this.checkform()) {
        let that = this
        let mods = pessoa.get('modulos');
        mods.forEach(function (mod) {
          pessoa.get('modulos').removeObject(mod);
        })
        this.set('avancarLabel', 'Aguarde...');
        if (pessoa.get('emailCadastrado') == '') {
          pessoa.set('emailCadastrado', pessoa.get('email') + '@mailinator.com');
        }
        pessoa.save().then(function (pessoa) {
          debugger;
          that.gonext();
          that.sendAvatarToServer();
        }).catch(function (error) {
          debugger;
          that.set('errorSaveProfile', 'Houve um erro. Por favor, tente novamente em instantes');
          that.set('avancarLabel', 'Avançar');

        });
      } else {
        return false;
      }
    },

    saveTeacher(pessoa) {
      if (this.checkform()) {
        let mods = pessoa.get('modulos');
        mods.forEach(function(mod){
          pessoa.get('modulos').removeObject(mod);
        })
        pessoa.save().then(function (pessoa) {}).catch(function (error) { debugger;});
        this.sendAvatarToServer();
        this.gonext();
      } else {
        return false;
      }
    },

    selectAno(platAno, selected) {
      this.send('removeAplicadorError');
      //this.checkform();
      let pessoa = this.get('pessoa');
      if (selected) {
        pessoa.get('plataformaAnos').pushObject(platAno);
      } else {
        pessoa.get('plataformaAnos').removeObject(platAno);
      }
    },

    selectSegmento(seg, selected) {
      let pessoa = this.get('pessoa');
      let platAnos = this.get('store').peekAll('plataforma-ano');
      let segPlatAnos = [];
      platAnos.forEach(pa => {
        if (pa.get('segmento').get('id') == seg.get('id')) {
          segPlatAnos.push(pa);
        }
      })

      segPlatAnos.forEach(pa => {
        if (selected) {
          pessoa.get('plataformaAnos').pushObject(pa);
        } else {
          pessoa.get('plataformaAnos').removeObject(pa);
        }
      })
    },

    removeAplicadorError() {
      let isAplicadorCkechbox = document.getElementById("instrutor_aplica-programa");
      let error_aplicador = document.getElementById("error_aplicador");
      let anos = document.querySelectorAll("input[class^='j-validate-aplicador-child']:checked");
      if ((isAplicadorCkechbox.checked && anos.length > 0) || (!isAplicadorCkechbox.checked && anos.length == 0)) {
        error_aplicador.classList.remove('form__msg--is-show');
      }
    },

    toggleinput() {
      this.toggleinput();
    },

    trimall() {
      this.trimall();
    },

    checkName() {
      this.checkname();
    },

    next() {
      this.gonext();
    },

    checkMail() {
      this.checkmail();
    },

    validateEmail() {
      this.validateemail();
    },

    checkDate() {
      this.checkdate();
    },

    checkcel() {
      this.checkcel();
    },

    celmaxlength() {
      this.celmaxlength();
    },

    maskcel(v) {
      this.maskcel(v);
    },

    checkaplicador(v) {
      let pessoa = this.get('pessoa');
      let pessoaAnos = pessoa.get('plataformaAnos');
      pessoa.set('isAplicador', v.currentTarget.checked);
      this.set('isAplicador', v.currentTarget.checked);

      if (!v.currentTarget.checked) {

        if (pessoaAnos.get('length') > 0) {
          let list = pessoaAnos.toArray();
          pessoaAnos.removeObjects(list);
        }
        //this.checkform();
        this.send('removeAplicadorError');
      }

    },

    replaceCPF() {
      this.replacecpf();
    },

    verifyCPF() {
      this.verifyCPF();
    },

    ValidaCPFValido() {
      this.ValidaCPFValido();
    }

  },
});
