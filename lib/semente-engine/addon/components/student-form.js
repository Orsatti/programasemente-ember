import Ember from 'ember';
import Component from '@ember/component';
// import pessoa from '../../../../app/models/pessoa';

Ember.TextField.reopen({
  attributeBindings: ['data-type', 'data-required', 'data-duplicate']
});

export default Ember.Component.extend({
  tagName: '',
  store: Ember.inject.service(),

  formValidation: Ember.observer('selectedGenero', 'selectedAno', 'selectedTurma', function () {
    this.removeerrors();
  }),

  plataformaAnosToHide: Ember.computed(function() {
    let idxToHide = [];
    idxToHide = [6,7,8,9,10,11,12];

    let plataformaAnos = this.get('pessoa').get('instituicao').get('plataformaAnos');
    let plataformaAnosToHide = [];
    plataformaAnos.forEach(pa => {
      if (idxToHide.includes(pa.get('idx'))) {
        plataformaAnosToHide.pushObject(pa);
      }
    });

    return plataformaAnosToHide;
  }),

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
    refreshSelectedGenero(selectedGenero) {
      let pessoa = this.get('pessoa');
      pessoa.set('genero', selectedGenero);
      this.set('selectedGenero', selectedGenero);
    },
    refreshSelectedAno(selectedPlatAnoId) {
      let pessoa = this.get('pessoa');
      var pessoaAnos = pessoa.get('plataformaAnos');
      pessoaAnos.forEach(pa => {
        pessoa.get('plataformaAnos').removeObject(pa);
      })
      let ano = this.get('store').peekRecord('plataforma-ano', selectedPlatAnoId);
      pessoa.get('plataformaAnos').pushObject(ano);
      this.set('selectedAno', ano);
    },
    refreshSelectedPlataformaTurma(plataformaTurmaId) {
      let pessoa = this.get('pessoa');
      var pessoaTurmas = pessoa.get('plataformaTurmas');
      pessoaTurmas.forEach(pt => {
        pessoa.get('plataformaTurmas').removeObject(pt);
      });
      let turma = this.get('store').peekRecord('plataforma-turma', plataformaTurmaId);
      pessoa.get('plataformaTurmas').pushObject(turma);
      this.set('selectedTurma', turma);
    },

    saveProfile(pessoa) {
      pessoa.save().then(function (pessoa) {}).catch(function (error) {});
      this.gonext();
    },

    next() {
      this.gonext();
    },

    previous() {
      this.goback();
    },

    trimall() {

      this.trimall();
    },
    
    checkName() {
      this.checkname();
    },
    
    removeDependente(model, dependente) {
      var responsaveis = dependente.get('responsaveis');

      responsaveis.forEach(resp => {
        dependente.get('responsaveis').removeObject(model);
        resp.get('dependentes').removeObject(dependente);

        if (dependente.get('id')) {
          dependente.save();
        }
      });

      this.refreshCanAddDependentes();
      // model.save().then(function(model) {}).catch(function(error) {});
      // parceiro.save().then(function(parceiro) {}).catch(function(error) {});
    },

    checkmail: function() {
      this.checkmail();
    },

    checkDuplicateLogins(pessoa) {
      let target = event.target;
      // let error_duplicate = target.closest('.form-group__container').querySelector('.form__msg');
      // error_duplicate.classList.remove('form__msg--is-show');
      let logins = document.querySelectorAll('.j-check-duplicate');
      let numLogins = logins.length;
      let arrayLogins = [];
      let errorMsg = 'Este nome de usuário já foi utilizado aqui'

      pessoa.verifyEmail({
        login: pessoa.get('email'),
        instituicaoId: pessoa.get('instituicao').get('id')
      }).then(function (response) {
        target.dataset.duplicate = "false";
        // let error_container = login.closest('.form-group__container').querySelector('.form__msg');
        // error_container.innerHTML = errorMsg;
        // error_container.classList.add('form__msg--is-show');
        return;
      }).catch(function (error) {
       if (error.errors) {
        const errorStatus = error.errors[0].status;
        const error_container = target.closest('.form-group__container').querySelector('.form__msg');
        if (errorStatus === "400") {
          switch (true) {
            case target.value.length == 0:
              errorMsg = 'Por favor, insira um e-mail';
              error_container.innerHTML = errorMsg;
              error_container.classList.add('form__msg--is-show');
              break;
            case target.value.length > 0:
              errorMsg = 'O e-mail já está sendo usado'
              target.dataset.duplicate = "true";
              error_container.innerHTML = errorMsg;
              error_container.classList.add('form__msg--is-show');
              break;

          }
        } else if (errorStatus === "500") {
          errorMsg = 'Ocorreu um erro no sistema, mas não se preocupe! Nossos desenvolvedores já foram alertados.'
          error_container.innerHTML = errorMsg;
          error_container.classList.add('form__msg--is-show');
        } else {
          errorMsg = 'Ops! Parece que não conseguimos conexão com nossos servidores. Por favor, tente novamente em instantes.'
          error_container.innerHTML = errorMsg;
          error_container.classList.add('form__msg--is-show');
        }
       }
      })
      if (numLogins > 1) {
        logins.forEach(login => {
          if (login.value !== "") {
            arrayLogins.push(login.value);
          }
          let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index);
          if (findDuplicates(arrayLogins).length > 0) {
            logins.forEach(login => {
              login.dataset.duplicate = "true";
              let error = login.closest('.form-group__container').querySelector('.form__msg');
              error.innerHTML = errorMsg;
              error.classList.add('form__msg--is-show');
            })
          } else {
            logins.forEach(login => {
              login.dataset.duplicate = "false";
              let error = login.closest('.form-group__container').querySelector('.form__msg');
              error.innerHTML = errorMsg;
              error.classList.remove('form__msg--is-show');
            })
          }
        })
      }
    },
    toggleCheckbox(dep) {
     
      let target = event.target;
      let closestInput = target.parentNode.nextElementSibling;
      let identCheckboxes = document.querySelectorAll('.j-validate-ident-'+dep);
      let uncheckeds = 0;
      let fieldsetError = document.getElementById('error-fieldset-ident-'+dep);
      let inputError = closestInput.parentElement.nextElementSibling;

      closestInput.value = '';
      inputError.classList.remove('alert--is-show');
      fieldsetError.classList.remove('fieldset__error--is-show');



      identCheckboxes.forEach(c => {
        if (!c.checked) {
          uncheckeds++
        }
      })

      if (uncheckeds == 2) {
        this.set('fieldset1Error', 'Pelo menos uma das formas de identificação precisa ser preenchida');
        fieldsetError.classList.add('fieldset__error--is-show');
        target.checked = true;
        return;
      }


      if (target.checked) {
        closestInput.removeAttribute('disabled');
        closestInput.style.opacity = 1;
        closestInput.classList.remove('fieldset__field--is-disabled');
      } else {
        closestInput.disabled = true;
        closestInput.style.opacity = 0.3;
        closestInput.classList.add('fieldset__field--is-disabled');
      }


    },
    
    replaceCPF() {
      let target = event.target;
      let cpf = target.value;
      
      var regex = /^[0-9.\t]$/;
      var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
      var code = event.which ? event.which : event.keyCode;
      let error_cpf = target.closest('.form-group__container').querySelector('.form__msg');
      let errorMsg;
      if (!regex.test(key) && code !== 37 && code !== 39 && code !== 8 && code !== 9 && code !== 116 & !(code >= 96 && code <= 105)) {

        errorMsg = 'Apenas números são permitidos';
        error_cpf.innerHTML = errorMsg;
        error_cpf.classList.add("form__msg--is-show");

        event.preventDefault();
        return false;
      } else {
        errorMsg = '';
        error_cpf.classList.remove("form__msg--is-show");
      }

      cpf = cpf.replace(/\D/g, "")
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      this.set('cpf', cpf);


    },

    verifyCPF() {
      let target = event.target;
      let error_cpf = target.closest('.form-group__container').querySelector('.form__msg');
      let errorMsg;

      if (target.value.length < 1 && target.disabled == false) {
        errorMsg = 'O CPF não pode ficar vazio';
        error_cpf.innerHTML = errorMsg;
        // alerta
        error_cpf.classList.add("form__msg--is-show");

        target.focus();

      } else if (!this.ValidaCPFValido(target.value) && target.disabled == false) {
        errorMsg = 'CPF Inválido';
        error_cpf.innerHTML = errorMsg;

        // alerta
        error_cpf.classList.add("form__msg--is-show");
        target.focus();


      } else {
        error_cpf.classList.remove("form__msg--is-show");
      }



    },

  }
});
