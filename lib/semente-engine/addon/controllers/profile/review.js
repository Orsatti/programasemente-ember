import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  appController: Ember.inject.controller('application'),
  //       // setup our query params
  store: Ember.inject.service(),
  escola: Ember.computed('model', function () {
   let escola = this.get('model').get('instituicao');
    return escola;
  }),

  loginAtual: Ember.computed('model', function() {
    return this.get('model').get('email');

  }),

  cpf: Ember.computed('model', function() {
    return this.get('model').get('cpf');

  }),


  preventDefault: Ember.computed(function () {
    let buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
      button.addEventListener("click", function (event) {
        event.preventDefault()
      });
    })

  }),
  step: 1,
  pending: [],
  fromRight: false,

  hideHeader: Ember.run.schedule('afterRender', function () {
    $('body').addClass('no-header');
  }),

  addFirstDependent: function() {
    let isAplicador = this.get('model').get('isAlsoResponsible');
    let dependentes = this.get('model').get('dependentes')
    if (isAplicador && dependentes.get('length') == 0) {
      this.send('addDependent');
    }
  }.observes('model.isAlsoResponsible'),

  checkNameEqualEmail: Ember.computed('model', function () {
    let pessoa = this.model;
    let nameInput = document.querySelector('#person_name');

    if (pessoa.get('name') == pessoa.get('email')) {
      nameInput.value = '';
    }
  }),

  checkCodigos: Ember.computed('model', function (){
    let codigosDisponiveis = [];
    let codigos = this.get('model').get('instituicao').get('codigosCadastro');
    codigos.forEach(codigo => {
      if(codigo.get('typeCadastro') == 'aluno' && codigo.get('utilizado') == 0){
        codigosDisponiveis.push(codigo);
      }
    });
    return codigosDisponiveis;
  }),

  canAddResponsibles: Ember.computed('model', function () {
    let pessoa = this.model;
    if (pessoa == null) pessoa = this.get('model');
    let maxRespAllowed = 2;
    let totalResp = pessoa.get('responsaveis').get('length');
    return totalResp < maxRespAllowed;
  }),

  canAddDependents: Ember.computed('model.dependentes[]', function () {
    let pessoa = this.get('model');
    let totalDeps = pessoa.get('dependentes').get('length');

    if (pessoa.get('maxDependentes')) {
      return totalDeps < pessoa.get('maxDependentes');
    }

    return true;
  }),

  canAddPartner: Ember.computed('model', function () {
    var retorno;
    try {
      retorno = this.get('model').get('dependentes').get('firstObject').get('responsaveis').get('length') < 2;
    } catch {
      retorno = true;
    }
    return retorno;
  }),

  refreshCanAddResponsibles: function () {
    this.set('canAddResponsibles', this.get('model').get('responsaveis').get('length') < 2);
  },

  refreshCanAddDependentes: function() {
    let codigosDisponiveis = this.get('checkCodigos');
    if((codigosDisponiveis.length - (this.get('model').get('dependentes').get('length')-1)) >= 0){
      this.set('canAddDependents', true);
      if (this.get('model').get('maxDependentes')) {
        this.set('canAddDependents', this.get('model').get('dependentes').get('length') < this.get('model').get('maxDependentes'));
      }
    }
    else{
      this.set('canAddDependents', false);
      if(this.get('model').get('dependentes').get('length') == 0){
        document.getElementById('isAlsoResponsible').checked = false;
      }
    }
  },

  stepsFound: function () {
    return Array.prototype.slice.call(document.querySelector('.j-steps').querySelectorAll('.steps__step'));
  },

  stepsStripActiveClass: function () {
    this.stepsFound().forEach(function (el) {
      el.classList.remove('steps__step--is-active', 'animated', 'pulse');
    });
  },

  findDirection: function () {
    this.set('fromRight', this.get('step') === 3);
  },

  refreshCanAddPartner: function () {
    this.set('canAddPartner', this.get('model').get('dependentes').get('firstObject').get('responsaveis').get('length') < 2);
  },

  removeUnsavedProfiles: function() {
    let pessoas = this.get('store').peekAll('pessoa');
    let that = this;
    pessoas.forEach(p => {
      if (!p.get('id')){
        that.get('store').unloadRecord(p);
      }
    });
    this.refreshIsAlsoResponsible();
  },

  refreshIsAlsoResponsible() {
    let dependentes = this.get('model').get('dependentes');

    if (dependentes.get('length') == 0) {
      this.get('model').set('isAlsoResponsible', false);
    }
  },

  validateEmailFunction() {
    let targets = [];
    let target = event.target;
    if (target.type == 'text') {
      targets.push(target);
    } else {
      let currentStep = this.get('step');
      let formInputs = document.querySelectorAll(".carousel--" + currentStep + " .j-step" + currentStep + " .j-validate");
      let inputsArray = Array.from(formInputs);

      let isEmail = function isEmail(input) {
        return input.dataset.type == 'e-mail'
      }
      let tgts = inputsArray.filter(isEmail);
      targets = Array.from(tgts);
    }
    targets.forEach(t => {

      let value = t.value;
      let errorMsg;
      // let error_mail = target.parentElement.nextElementSibling;
      let error_mail = t.closest('.form-group__container').querySelector('.form__msg');
      if (!value == "") {
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
          // target.focus();
          errorMsg = 'E-mail inválido';
          error_mail.classList.add("form__msg--is-show");
          error_mail.innerHTML = errorMsg;

          this.set('emailsOK', false);
          return false;

        } else {
          error_mail.classList.remove("form__msg--is-show");
          this.set('emailsOK', true);
          return true;
        };
      }
    })
  },

  validateFormFunction: function () {
    // Limpa mensagens de erro, mas mantém a indicação de erro
    let allErrorMsgs = document.querySelectorAll('.form__msg');
    allErrorMsgs.forEach(errorMsg => {
      errorMsg.innerHTML = "";
    });
    // Identifica elementos do form que serão os alvos e prepara variáveis para controle
    let currentStep = this.get('step');
    let formInputs = document.querySelectorAll(".carousel--" + currentStep + " .j-step" + currentStep + " .j-validate");
    let formSubmit = document.querySelectorAll(".carousel--" + currentStep + " .j-step" + currentStep + " .j-submit");
    let error_form = document.getElementById('error_form');
    let alertAnimation = error_form.dataset.animation;
    let naoValidados = [];
    let isAplicador = false;
    if(document.getElementById('instrutor_aplica-programa') != null) isAplicador = document.getElementById('instrutor_aplica-programa').checked;
    // Identifica os elementos vazios ou inválidos e os inclui no array naoValidados
    let that = this;
    formInputs.forEach(input => {
      if (input.value === "" && input.dataset.required == "true" && !input.disabled) {
        naoValidados.push(input);
      };
      if (input.dataset.type == "cpf" && !input.disabled && input.value.length < 14) {
        naoValidados.push(input);
      };
      if (input.dataset.type == "celular") {
        if((input.dataset.required == "true" && input.value.length < 15) || (isAplicador && input.disabled)){
          naoValidados.push(input);
        }
      };
      if (input.dataset.type == "e-mail") {
        if((input.dataset.required == "true" && !input.disabled) || (isAplicador && input.disabled)){
          this.validateEmailFunction();
          if (input.value == this.get('model').get('userName') && currentStep > 1){
            naoValidados.push(input);
          }
          if (!that.get('emailsOK')) {
            naoValidados.push(input);
          }
        }
      };
      if (input.dataset.type == "aplicador" && input.checked) {
        let anos = document.querySelectorAll("input[class^='j-validate-aplicador-child']:checked");
        if (anos.length == 0)
          naoValidados.push(input);
      };
      if (input.dataset.type == "login" && input.dataset.duplicate == "true") {
        naoValidados.push(input);
      }
      if (input.dataset.type == "nascimento") {
        var year = new Date().getFullYear();
        if(input.value > year || input.value < 1900) naoValidados.push(input);
      }
    });
    // Reseta classe de is--show em todos os inputs do form caso não exista campos inválidos
    formInputs.forEach(i => {
      if (i.closest('.form-group__container').querySelector('.form__msg')) {
        i.closest('.form-group__container').querySelector('.form__msg').classList.remove('form__msg--is-show');
      } else {
        // Não bom. Caso específico para erro do checkbox de professor aplicador.
        if (i.closest('.form-group__container').parentNode.nextElementSibling.querySelector('.form__msg')) {
          i.closest('.form-group__container').parentNode.nextElementSibling.querySelector('.form__msg').classList.remove('form__msg--is-show');
        }
      }
    });
    // Se existem campos inválidos
    if (naoValidados.length > 0) {
      // Em cada campo inválido, adiciona a barrinha vermelha abaixo
      naoValidados.forEach(i => {
        if (i.closest('.form-group__container').querySelector('.form__msg')) {
          i.closest('.form-group__container').querySelector('.form__msg').classList.add('form__msg--is-show');
        } else {
          // Não bom. Caso específico para erro do checkbox de professor aplicador.
          if (i.closest('.form-group__container').parentNode.nextElementSibling.querySelector('.form__msg')) {
            i.closest('.form-group__container').parentNode.nextElementSibling.querySelector('.form__msg').classList.add('form__msg--is-show');
          }
        }
      });
      // Muda a sintaxe da mensagem de erro entre singular e plural
      if (naoValidados.length === 1) {
        var errorMsg = 'Ops! Parece que há algo errado com o campo destacado. Revise por favor e preencha corretamente';
      } else {
        var errorMsg = 'Ops! Parece que há algo errado com os campos destacados. Revise por favor e preencha corretamente';
      };
      // Clona mensagem de erro e a posiciona ao lado do botão "Avançar"
      let error_clone = document.getElementById("error_clone");
      if (error_clone) {
        error_clone.remove();
      }
      let ec2 = error_form.cloneNode(true);
      ec2.id = "error_clone";
      formSubmit[0].parentNode.insertBefore(ec2, formSubmit.nextSibling);
      ec2.innerHTML = errorMsg;
      ec2.classList.add("alert--is-show", alertAnimation);
      return false;
    }
    // Se não existem campos inválidos
    else {
      // Retira mensagem de erro da tela
      let error_clone = document.getElementById("error_clone");
      if (error_clone) {
        error_clone.classList.remove("alert--is-show");
      }
      //this.send('carouselFoward');
      return true;
    }

  },

  ValidaCPFValido(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;

    strCPF = strCPF.replace(".", "");
    strCPF = strCPF.replace(".", "");
    strCPF = strCPF.replace("-", "");
    strCPF = strCPF.trim();

    if (strCPF == "00000000000") return false;

    for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto !== parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto !== parseInt(strCPF.substring(10, 11))) return false;
    return true;
  },



  actions: {
    refreshCanAddDependentes: function() {
      this.refreshCanAddDependentes();
    },

    addResponsible: function () {
      var currentPerson = this.get('model');
      var newResponsible = this.get('store').createRecord('pessoa', {
        role: "responsavel",
        instituicao: this.get('model').get('instituicao')
      })
      currentPerson.get('responsaveis').pushObject(newResponsible);
      newResponsible.get('dependentes').pushObject(currentPerson);

      this.refreshCanAddResponsibles();
    },

    addPartner: function () {
      var partner = this.get('store').createRecord('pessoa', {
        role: "responsavel",
        instituicao: this.get('model').get('instituicao'),
        shouldReviewProfile: true
      })

      var dependentes = this.get('model').get('dependentes');
      dependentes.forEach(dep => {
        partner.get('dependentes').pushObject(dep);
        dep.get('responsaveis').pushObject(partner);
      });

      this.refreshCanAddPartner();
    },

    addDependent: function () {
      var currentPerson = this.get('model');
      var newDependente = this.get('store').createRecord('pessoa', {
        role: "aluno",
        instituicao: this.get('model').get('instituicao')
      })
      currentPerson.get('dependentes').pushObject(newDependente);
      newDependente.get('responsaveis').pushObject(currentPerson);

      this.refreshCanAddDependentes();

      if(this.get('canAddDependents')){
        let numDependentes = this.get('model').get('dependentes').get('length') - 1;

        if ((numDependentes + 1) > 0) {
          setTimeout(function () {
            let currentDep = document.getElementsByClassName("j-student-form-" + numDependentes);
            currentDep[0].scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }, 50);
        }
      }
      else{
        currentPerson.get('dependentes').removeObject(newDependente);
        newDependente.get('responsaveis').removeObject(currentPerson);

        if(this.get('model').get('dependentes').get('length') == 0){
          document.getElementById('isAlsoResponsible').checked = false;
        }
      }
    },


    removeDependentes() {
      var prof = this.get('model');
      this.removeUnsavedProfiles();
      if (!prof.get('isAlsoResponsible')) {
        prof.get('dependentes').forEach(dep => {
          dep.get('responsaveis').removeObject(prof);
          prof.get('dependentes').removeObject(dep);
        });

        prof.save();
      }

      this.refreshCanAddDependentes();
    },

    validateForm() {
      return this.validateFormFunction();
    },


    validateStudentProfile: function () {
      let btn = document.getElementById("confirmar_cadastro");
      btn.innerText = 'Por favor, aguarde...'
      btn.disabled = true;
      let pessoa = this.get('model');
      pessoa.set('shouldReviewProfile', false);
      let that = this;
      pessoa.save().then(function (pessoa) {
        window.location = '/webapp';
        // that.transitionToRoute('application');
      }).catch(function (error) {
        btn.innerText = 'Confirmar cadastro'
        btn.disabled = false;
        let error_clone = document.getElementById("error_clone");
        if (error_clone) {
          error_clone.remove();
        }
        let ec2 = error_form.cloneNode(true);
        ec2.id = "error_clone";
        btn.parentNode.insertBefore(ec2, btn.nextSibling);
        ec2.innerHTML = 'Houve um problema, tente novamente em instantes';
        ec2.classList.add("alert--is-show", "fadeIn");

      });
    },


    refreshInstructorResponsible: function () {

    },

    validateTeacherProfile: function () {
      let btn = document.getElementById("confirmar_cadastro");
      btn.innerText = 'Por favor, aguarde...'
      btn.disabled = true;
      let pessoa = this.get('model');
      pessoa.set('shouldReviewProfile', false);
      let that = this;
      pessoa.save().then(function (pessoa) {
        // that.transitionToRoute('index');
        window.location = '/webapp';
      }).catch(function (error) {
        btn.innerText = 'Confirmar cadastro'
        btn.disabled = false;
        let error_clone = document.getElementById("error_clone");
        if (error_clone) {
          error_clone.remove();
        }
        let ec2 = error_form.cloneNode(true);
        ec2.id = "error_clone";
        btn.parentNode.insertBefore(ec2, btn.nextSibling);
        ec2.innerHTML = 'Houve um problema, tente novamente em instantes';
        ec2.classList.add("alert--is-show", "fadeIn");

      });

    },

    initTeacherResponsible: function () {
      let teacher = this.get('model');

      if (teacher.get('dependentes').get('length') <= 0) {
        let newDependente = this.get('store').createRecord('pessoa', {
          role: "aluno",
          instituicao: this.get('model').get('instituicao')
        });
        newDependente.get('responsaveis').pushObject(teacher);
        teacher.get('dependentes').pushObject(newDependente);
      }
    },

    carouselFoward: function () {
      let m = document.getElementById("content-main");
      if (m) {
        m.scrollTo(0, 0);
      };
      let errors = document.querySelectorAll(".form__msg--is-show");
      errors.forEach(error => {
        error.classList.remove('form__msg--is-show');
      })
      let next = this.get('step') + 1;
      this.stepsStripActiveClass();
      this.stepsFound()[next - 1].classList.add('steps__step--is-active', 'animated', 'pulse');
      this.findDirection();
      this.set('step', next);
    },


    carouselBackward: function () {
      let m = document.getElementById("content-main");
      if (m) {
        m.scrollTo(0, 0);
      };
      let errors = document.querySelectorAll(".form__msg--is-show");
      errors.forEach(error => {
        error.classList.remove('form__msg--is-show');
      })
      let before = this.get('step') - 1;
      this.stepsStripActiveClass();
      this.stepsFound()[before - 1].classList.add('steps__step--is-active', 'animated', 'pulse');
      this.findDirection();
      this.set('step', before);
      this.removeUnsavedProfiles();
    },


    validateName() {
      let target = event.target;
      const regex = new RegExp(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s._\b]+$/);

      var checkOnInput = function (evt) {
        const key = String.fromCharCode(!evt.charCode ? evt.which : evt.charCode);
        let errorMsg = 'Somente letras são permitidas';
        let error_name = target.closest('.form-group__container').querySelector('.form__msg');

        if (!regex.test(key)) {
          error_name.innerHTML = errorMsg;
          error_name.classList.add("form__msg--is-show");
          event.preventDefault();
          return false;
        } else {
          error_name.classList.remove("form__msg--is-show");
          error_name.innerHTML = '';
        }
      };

      var checkPaste = function (evt) {
        const key = String.fromCharCode(!evt.charCode ? evt.which : evt.charCode);
        let errorMsg = 'Somente letras são permitidas';
        let error_name = target.closest('.form-group__container').querySelector('.form__msg');
        if (!regex.test(event.clipboardData.getData('text'))) {
          error_name.innerHTML = errorMsg;
          error_name.classList.add("form__msg--is-show");
          event.preventDefault();
          return false;
        } else {
          error_name.classList.remove("form__msg--is-show");
          error_name.innerHTML = '';
        }

      };

      target.addEventListener('paste', checkPaste, false);
      target.addEventListener('keypress', checkOnInput, false);


    },


    validateDate() {
      this.send('removeErrorTag');
    },



    liveCheckEmail() {
      this.send('removeErrorTag');
      let target = event.target;
      let errorMsg;
      target.addEventListener('keypress', function (evt) {
        var regex = new RegExp(/^[A-Za-z0-9-@._\b]+$/);
        var key = String.fromCharCode(!evt.charCode ? evt.which : evt.charCode);

        if (evt.code == "Space") {
          errorMsg = 'Espaços não são permitidos';
        } else {
          errorMsg = 'Caractere não permitido';
        }
        // let error_mail = target.parentElement.nextElementSibling;
        let error_mail = target.closest('.form-group__container').querySelector('.form__msg');
        if (!regex.test(key)) {

          error_mail.innerHTML = errorMsg;
          error_mail.classList.add("form__msg--is-show");

          event.preventDefault();
          return false;

        } else {
          error_mail.classList.remove("form__msg--is-show");
          error_mail.innerHTML = '';
        }

      });

    },

    validateEmail() {
      return this.validateEmailFunction();
    },


    phoneMask: function (v) {
      let target = event.target;
      if (v) {
        var r = v.replace(/\D/g,"");
        r = r.replace(/\D/g, "")
        r = r.replace(/(\d{2})(\d)/, "($1) $2")
        r = r.replace(/(\d{5})(\d)/, "$1-$2")
        r = r.replace(/(-\d{4})(\d+?)$/, "$1");
        target.value = r;
      }
    },


    validateCel() {
      let target = event.target;
      let errorMsg;
      // let error_cel = target.parentElement.nextElementSibling;
      let error_cel = target.closest('.form-group__container').querySelector('.form__msg');
      if (target.value.length > 0 && target.value.length < 15) {
        target.focus();
        errorMsg = 'Número inválido';
        error_cel.innerHTML = errorMsg;
        error_cel.classList.add("form__msg--is-show");
      } else {
        error_cel.classList.remove("form__msg--is-show");
      };
    },


    celReachedMaxLength() {
      console.log('input event');
      let target = event.target;
      if (target.value.length == 15) {
        // target.parentElement.nextElementSibling.classList.remove("form__msg--is-show");
        target.closest('.form-group__container').querySelector('.form__msg').classList.remove("form__msg--is-show");
      }
    },

    toggleInput() {
      let target = event.target;
      let input = target.closest('.form-group__container').querySelector('.j-validate');
      let currentStep = this.get('step');
      let formInputs = document.querySelectorAll(".carousel--" + currentStep + " .j-step" + currentStep + " .j-validate");
      let dualReq = [];

      if (input.dataset.type !== 'cpf') {
              // Verifica se existe o Dual Requirement de celular + e-mail e, caso sim, popula o array
              formInputs.forEach(el => {
                if (el.classList.contains('j-dualRequirement')) {
                  dualReq.push(el);
                }
              });

              // Se existirem os 2 campos do dual requirement, critica se um deles está preenchido
              if (dualReq.length == 2) {
                let pInfo = document.getElementById("p-info");
                pInfo.classList.remove("blink");
                if (input.disabled == false) {
                  for (let i = 0; i < dualReq.length; i++) {
                    if (input != dualReq[i]) {
                      if ((dualReq[i].disabled && !input.disabled) || (!dualReq[i].disabled && input.disabled)) {
                        //alert('Você precisa especificar ou um e-mail ou um telefone')

                        setTimeout(function(){ pInfo.classList.add("blink"); }, 1);
                        return false;
                      }
                    }

                  };
                }
              };

      }


      input.addEventListener('blur', function () {});
      let contextMsg;
      if (input.dataset.context == "personal") {
        contextMsg = 'possuo'
      } else {
        contextMsg = 'possui'
      }
      if (input.disabled == false) {
        input.disabled = true;
        input.focus();
        input.value = '';
        let evt = new Event("blur");
        input.dispatchEvent(evt);
        input.dataset.required = 'false';
        input.classList.add("form-group__input--is-disabled");
        input.closest('.form-group__container').querySelector('.form__msg').classList.remove('form__msg--is-show');
        target.innerHTML = contextMsg.charAt(0).toUpperCase() + contextMsg.slice(1) + ' ' + input.dataset.type;
      } else {
        input.value = '';
        input.disabled = false;
        input.dataset.required = 'true';
        input.classList.remove("form-group__input--is-disabled");
        target.innerHTML = 'Não ' + contextMsg + ' ' + input.dataset.type;
      }

    },

    removeErrorTag() {
      let currentStep = this.get('step');
      let formInputs = document.querySelectorAll(".carousel--" + currentStep + " .j-step" + currentStep + " .j-validate");
      let inputsWithError = [];
      formInputs.forEach(input => {
        if (input.closest('.form-group__container').querySelector('.form__msg').classList.contains("form__msg--is-show")) {
          inputsWithError.push(input);
        };
      });

      if (inputsWithError.length > 0) {
        inputsWithError.forEach(input => {

          if (!input.value == "") {
            input.closest('.form-group__container').querySelector('.form__msg').classList.remove('form__msg--is-show');
          }
        });

      }

      if (inputsWithError.length == 1) {
        let error_form = document.getElementById("error_clone");

        if (error_form) {
          error_form.classList.remove("alert--is-show");
        }

      }

    },


    trimAll() {
      let inputs = document.querySelectorAll('input[type="text"]');

      inputs.forEach(input => {
        let str = input.value;
        let trimmed = str.trim();
        input.value = trimmed;
        //input.closest('.form-group__container').querySelector('.form__msg').classList.remove("form__msg--is-show");
      })

    },

    async saveResponsibles() {
      let formOk = this.validateFormFunction();
      if (formOk) {
        let aluno = this.get('model');
        let responsaveis = aluno.get('responsaveis');
        for (let i = 0; i < responsaveis.get('length'); i++) {
          const resp = responsaveis.objectAt(i);
          await resp.save().then(function (responsavel) {}).catch(function (error) {});
        }
        this.send('carouselFoward');
      } else {
        return false;
      }

    },

    saveTeacher() {
      let professor = this.get('model');

      professor.save().then(function (prof) {}).catch(function (error) {});
      this.send('carouselFoward');
    },

    saveDependentes() {
      let formOk = this.validateFormFunction();
      let that = this;
      let codigosDisponiveis = this.get('checkCodigos');

      if (formOk && codigosDisponiveis.length > 0) {
        let responsavel = this.get('model');

        let dependentes = responsavel.get('dependentes');
        let promises = [];
        dependentes.forEach(dep => {
          dep.set('enabled', true);
          dep.set('codigoCadastro', null);
          let mods = dep.get('modulos');
          dep.set('codigoCadastro', null);
          dep.set('enabled', true);
          mods.forEach(function(mod){
            dep.get('modulos').removeObject(mod);
          })
          if (!dep.get('email')){
            dep.set('email', dep.get('cpf'));
          }
          promises.push(dep.save());
        })
        Promise.all(promises).then(() => {
          that.send('carouselFoward');
        })
      } else {

        if(!formOk) {
          return false;
        } else {
          let currentStep = this.get('step');
          let errorMsg = 'A escola chegou à quantidade limite de criação de alunos, entre em contato com seu gestor'
          let formSubmit = document.querySelectorAll(".carousel--" + currentStep + " .j-step" + currentStep + " .j-submit");
          let error_clone = document.getElementById("error_clone");
          if (error_clone) {
            error_clone.remove();
          }
          let ec2 = error_form.cloneNode(true);
          ec2.id = "error_clone";
          formSubmit[0].parentNode.insertBefore(ec2, formSubmit.nextSibling);
          ec2.innerHTML = errorMsg;
          ec2.classList.add("alert--is-show", 'fadeIn');
          return false;
        }

      }
    },

    savePartner() {
      let formOk = this.validateFormFunction();
      if (formOk) {
        let responsavel = this.get('model');

        let responsaveis = responsavel.get('dependentes').get('firstObject').get('responsaveis');
        let parceiro;

        if (responsaveis.get('length') > 1) {
          responsaveis.forEach(resp => {
            if (resp.get('id') != responsavel.get('id')) {
              parceiro = resp;
            }
          });
          parceiro.save();
        }
        this.send('carouselFoward')
      } else {
        return false;
      }
    },

    replaceCPF() {
      let target = event.target;
      let cpf = target.value;

      var regex = /^[0-9.\t]$/;
      var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
      var code = event.which ? event.which : event.keyCode;

      if (!regex.test(key) && code !== 37 && code !== 39 && code !== 8 && code !== 9 && code !== 116 && !(code >= 96 && code <= 105) && !(code >= 48 && code <= 57))  {

        let errorMsg = this.set('errorMsgCPF', 'Apenas números são permitidos');
        // Pega alerta
        let errorContainer = target.closest('.form-group__container').querySelector('.form__msg')


        // Pega container da mensagem a ser escrita
        errorContainer.innerHTML = '<strong>' + errorMsg + '</strong>';
        errorContainer.classList.add("form__msg--is-show");

        event.preventDefault();
        return false;
      }





      cpf = cpf.replace(/\D/g, "")
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      target.value = cpf;
      // this.set('cpf', cpf);
    },

    verifyCPF() {
      let target = event.target;
      let formGroup = target.parentElement;
      // Pega alerta
      const errorCompartiment = target.closest('.form-group__container').querySelector('.form__msg')
      let cpf = target.value;


      if (target.value.length < 1 && target.disabled == false) {
        let errorMsg = this.set('errorMsgCPF', 'O CPF não pode ficar vazio');
        errorCompartiment.innerHTML = errorMsg;
        // alerta
        formGroup.classList.remove('form-group__input-container--is-validated');
        errorCompartiment.classList.add('form__msg--is-show');

        target.focus();

      } else if (!this.ValidaCPFValido(target.value) && target.disabled == false) {
        let errorMsg = this.set('errorMsgCPF', 'CPF Inválido');
        errorCompartiment.innerHTML = errorMsg;

        // alerta
        errorCompartiment.classList.add('form__msg--is-show');
        formGroup.classList.remove('form-group__input-container--is-validated');
        target.focus();


      } else {
        errorCompartiment.classList.remove('form__msg--is-show')
        formGroup.classList.add('form-group__input-container--is-validated');
        let pessoa = this.get('model');
        let that = this;
        pessoa.verifyCpf({
          cpf: pessoa.get('cpf')
        }).then(function (response) {
          errorCompartiment.classList.remove('form__msg--is-show', 'fadeIn');
          formGroup.classList.add('form-group__input-container--is-validated');
        }).catch(function (error) {
          if (error.errors) {
            formGroup.classList.remove('form-group__input-container--is-validated');
            if (target) {
              target.focus();
            }

            // Antiga mensagem de erro
            // document.getElementById('login-error').innerHTML = error.errors[0].title;

            // Pega a identificação do erro
            const errorStatus = error.errors[0].status;

            // Define mensagem de erro, caso seja o erro XYZ
            let errorMsg;
            if (errorStatus === "400") {
              switch (true) {
                case cpf.length == 0:
                  errorMsg = 'Por favor, insira um cpf';
                  break;
                case cpf.length > 0:
                  errorMsg = 'O cpf informado já foi cadastrado.'
                  break;
              }
            } else if (errorStatus === "500") {
              errorMsg = 'Ocorreu um erro no sistema, mas não se preocupe! Nossos desenvolvedores já foram alertados.'
            } else {
              errorMsg = 'Ops! Parece que não conseguimos conexão com nossos servidores. Por favor, tente novamente em instantes.'
            }

            // Injeta mensagem de erro.
            that.set('errorMsgCpf', errorMsg);
            errorCompartiment.innerHTML = errorMsg;
            // msg.innerHTML = '<strong>' + errorMsg + '</strong>';

            // Confere se o elemento já está aparecendo
            if (!errorCompartiment.classList.contains('form__msg--is-show')) {
              // Adiciona duas classes: uma para o alerta aparecer e outra com a animação definida no html, por meio de data-SBRUBLES
              errorCompartiment.classList.add('form__msg--is-show', 'fadeIn');
            }

          }
        })
      }

    },

    logout() {
      this.get('appController').send('invalidateSession');
    }


  }
});
