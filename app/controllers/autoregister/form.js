import Controller from '@ember/controller';
import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  escola: Ember.computed('model', function () {
    let escola = this.get('model').get('instituicao');
    return escola;
  }),

  // preventLoginPaste: Ember.run.later('afterRender', function() {
  //   setTimeout(() => {
  //     document.getElementById('emailUser').onpaste = function(){

  //       // Pega alerta
  //     const errorCompartiment = document.getElementById('login-error');
  //     // Pega animação do alerta
  //     const alertAnimation = errorCompartiment.dataset.animation;
  //     // Pega container da mensagem a ser escrita
  //     const msg = errorCompartiment.querySelector('[class*="__msg"]');
  //     // Mensagem
  //     let errorMsg = 'Por favor, digite'
  //     // Injeta mensagem de erro.
  //     msg.innerHTML = '<strong>' + errorMsg + '</strong>';
  //     // Confere se o elemento já está aparecendo
  //     if (!errorCompartiment.classList.contains('alert--is-show')) {
  //     // Adiciona duas classes: uma para o alerta aparecer e outra com a animação definida no html, por meio de data-SBRUBLES
  //       errorCompartiment.classList.add('alert--is-show', alertAnimation);
  //     }
  //       return false;
  //   }
  //   }, 1000);
  // }),


  pessoa: Ember.computed('model', function () {
    return this.get('store').createRecord('pessoa');
  }),


  emailFocus: Ember.computed(function () {
    let input = document.getElementById('emailUser');
    if (input) {
      input.focus();
    }
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

  verifyPasswordLength() {

    let p1 = document.getElementById('senha').value;
    let p2 = document.getElementById('senha2').value;
    const passAlert = document.getElementById('pass-error');
    const msg = passAlert.querySelector('[class*="__msg"]');

    if (p1.length < 6 || p2.length < 6) {
      let errorMsg = 'A senha precisa ter pelo menos 6 caracteres.';
      passAlert.classList.add('alert--is-show', 'fadeIn');
      msg.innerHTML = '<strong>' + errorMsg + '</strong>';
      return false
    } else {
      passAlert.classList.remove('alert--is-show', 'fadeIn');
      return true;
    }

  },

  verifyIdentificationFill() {
    let identInputs = document.querySelectorAll('.j-validate-ident-text');
    let fieldsetError = document.getElementById('error-fieldset-ident');
    let notFilled = 0;
    this.set('fieldset1Error', '');

    identInputs.forEach(i => {

      if (!i.disabled && i.value.length < 1) {
        i.classList.add('fieldset__field--presents-error');
        notFilled++
      } else {
        i.classList.remove('fieldset__field--presents-error');
      }
    })

    if (notFilled > 0) {
      fieldsetError.classList.add('fieldset__error--is-show');
      this.set('fieldset1Error', 'Há campos não preenchidos');
      return false;
    }
    fieldsetError.classList.remove('fieldset__error--is-show');
    return true;

  },

  actions: {

    liveCheckEmail: function () {

      let optFor = document.getElementById('email-choice');

      if (optFor.checked) {

        $('#emailUser').on('keypress', function (event) {
          var regex = new RegExp("^[a-zA-Z0-9@.-_]+$");
          var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
          let errorMsg = 'Espaço e caracteres especiais não são permitidos';

          if (!regex.test(key)) {
            // Pega form container e tira classe de validado
            let inputContainer = document.getElementById('emailUser').closest('.form-group__input-container');
            inputContainer.classList.remove('form-group__input-container--is-validated');

            // Pega alerta
            let errorCompartiment = document.getElementById('login-error');

            // Pega animação do alerta
            let alertAnimation = errorCompartiment.dataset.animation;

            // Pega container da mensagem a ser escrita
            let msg = errorCompartiment.querySelector('[class*="__msg"]');
            errorCompartiment.classList.remove('alert--is-show', alertAnimation);

            // Injeta mensagem de erro.
            msg.innerHTML = '<strong>' + errorMsg + '</strong>';

            // Confere se o elemento já está aparecendo
            if (!errorCompartiment.classList.contains('alert--is-show')) {
              // Adiciona duas classes: uma para o alerta aparecer e outra com a animação definida no html, por meio de data-SBRUBLES
              errorCompartiment.classList.add('alert--is-show', alertAnimation);
            }

            event.preventDefault();
            return false;

          } else {
            let errorCompartiment = document.getElementById('login-error');
            let alertAnimation = errorCompartiment.dataset.animation;
            errorCompartiment.classList.remove('alert--is-show', alertAnimation);
            return true;
          }

        });
      }


    },

    verifyEmail: function () {

      let optFor = document.getElementById('email-choice');


      if (optFor.checked) {

        $('form').removeData('validator');
        $('form').removeData('unobtrusiveValidation');
        let email = document.getElementById('emailUser');

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {


          if (email.value.length > 0) {
            email.classList.remove('fieldset__field--presents-error');
          }

          if (!email.disabled) {
            let pessoa = this.get('pessoa');
            pessoa.set('email', email.value);
            let inputContainer = document.getElementById('emailUser').closest('.form-group__input-container');
            let input = document.getElementById('emailUser');
            // Pega alerta
            const errorCompartiment = document.getElementById('login-error');
            // Pega animação do alerta
            const alertAnimation = errorCompartiment.dataset.animation;
            // Pega container da mensagem a ser escrita
            const msg = errorCompartiment.querySelector('[class*="__msg"]');


            pessoa.verifyEmail({
              login: pessoa.get('email'),
              instituicaoId: this.get('escola').get('id')
            }).then(function (response) {
              errorCompartiment.classList.remove('alert--is-show', alertAnimation);
              inputContainer.classList.add('form-group__input-container--is-validated');
            }).catch(function (error) {
              if (error.errors) {

                inputContainer.classList.remove('form-group__input-container--is-validated');
                if (input) {
                  input.focus();
                }

                // Antiga mensagem de erro
                // document.getElementById('login-error').innerHTML = error.errors[0].title;

                // Pega a identificação do erro
                const errorStatus = error.errors[0].status;

                // Define mensagem de erro, caso seja o erro XYZ
                let errorMsg;
                if (errorStatus === "400") {
                  switch (true) {
                    case email.value.length == 0:
                      errorMsg = 'O campo não pode ficar vazio';
                      break;
                    case email.value.length > 0:
                      errorMsg = 'O e-mail informado já existe em nossa base'
                      break;

                  }
                } else if (errorStatus === "500") {
                  errorMsg = 'Ocorreu um erro no sistema, mas não se preocupe! Nossos desenvolvedores já foram alertados.'
                } else {
                  errorMsg = 'Ops! Parece que não conseguimos conexão com nossos servidores. Por favor, tente novamente em instantes.'
                }

                // Injeta mensagem de erro.
                msg.innerHTML = '<strong>' + errorMsg + '</strong>';

                // Confere se o elemento já está aparecendo
                if (!errorCompartiment.classList.contains('alert--is-show')) {
                  // Adiciona duas classes: uma para o alerta aparecer e outra com a animação definida no html, por meio de data-SBRUBLES
                  errorCompartiment.classList.add('alert--is-show', alertAnimation);
                }

              } else {
                // Situação não tratada ainda
                document.getElementById('login-error').innerHTML = '';
              }

            })

          }
        } else {
          let input = document.getElementById('emailUser');
          input.focus();
          let errorMsg = this.set('errorMsg', 'E-mail inválido');
          // Pega alerta
          const errorCompartiment = document.getElementById('login-error');
          // Pega animação do alerta
          const alertAnimation = errorCompartiment.dataset.animation;
          // Pega container da mensagem a ser escrita
          const msg = errorCompartiment.querySelector('[class*="__msg"]');
          msg.innerHTML = '<strong>' + errorMsg + '</strong>';

          // Confere se o elemento já está aparecendo
          if (!errorCompartiment.classList.contains('alert--is-show')) {
            // Adiciona duas classes: uma para o alerta aparecer e outra com a animação definida no html, por meio de data-SBRUBLES
            errorCompartiment.classList.add('alert--is-show', alertAnimation);
          }

        }



      }

    },

    replaceCPF() {
      let target = event.target;
      let cpf = target.value;

      var regex = /^[0-9.\t]$/;
      var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
      var code = event.which ? event.which : event.keyCode;

      if (!regex.test(key) && code !== 37 && code !== 39 && code !== 8 && code !== 9 && code !== 116) {

        let errorMsg = this.set('errorMsgCPF', 'Apenas números são permitidos');
        // Pega alerta
        const errorCompartiment = document.getElementById('cpf-error');
        // Pega animação do alerta
        const alertAnimation = errorCompartiment.dataset.animation;
        // Pega container da mensagem a ser escrita
        const msg = errorCompartiment.querySelector('[class*="__msg"]');
        msg.innerHTML = '<strong>' + errorMsg + '</strong>';

        // Alerta
        errorCompartiment.classList.add('alert--is-show', alertAnimation);



        event.preventDefault();
        return false;
      }





      cpf = cpf.replace(/\D/g, "")
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      this.set('cpf', cpf);


    },

    verifyCPF() {
      let target = event.target;
      let errorMsg = this.set('errorMsgCPF', 'CPF inválido');
      // Pega alerta
      const errorCompartiment = document.getElementById('cpf-error');
      // Pega animação do alerta
      const alertAnimation = errorCompartiment.dataset.animation;
      // Pega container da mensagem a ser escrita
      const msg = errorCompartiment.querySelector('[class*="__msg"]');

      if (!this.ValidaCPFValido(target.value) && target.disabled == false) {

        msg.innerHTML = '<strong>' + errorMsg + '</strong>';

        // alerta
        errorCompartiment.classList.add('alert--is-show', alertAnimation);

        target.focus();


      } else {
        errorCompartiment.classList.remove('alert--is-show', alertAnimation)
      }



    },

    verifyPassword: function () {
      let p1 = document.getElementById('senha').value;
      let p2 = document.getElementById('senha2').value;

      const passAlert = document.getElementById('pass-error');
      const alertAnimation = passAlert.dataset.animation;
      const msg = passAlert.querySelector('[class*="__msg"]');
      const errorMsg = 'As senhas digitadas ainda não são iguais.';
      const inputsPass = document.querySelectorAll(".j-password");


      if ((p1.length > 0 && p2.length > 0) && (p1 === p2)) {
        document.getElementById('submit').setAttribute('dataDisabled', 'false');
        passAlert.classList.remove('alert--is-show');
        inputsPass.forEach(input => {
          input.classList.add('form-group__input-container--is-validated');
        });

      } else if (p1.length > 0 || p2.length > 0) {
        document.getElementById('submit').setAttribute('dataDisabled', 'true');
        //document.getElementById('submit').classList.add("btn--disabled");
        inputsPass.forEach(input => {
          input.classList.remove('form-group__input-container--is-validated');
        });
        passAlert.classList.add('alert--is-show', alertAnimation);
        msg.innerHTML = '<strong>' + errorMsg + '</strong>';
      }
    },



    createUser: function () {
      this.verifyIdentificationFill();
      this.verifyPasswordLength();
      if (this.verifyIdentificationFill() && this.verifyPasswordLength()) {
        let button = document.getElementById('submit');
        button.innerHTML = "Aguarde..."
        let password = document.getElementById('senha').value;
        let login = document.getElementById('emailUser').value;
        let sistemas = this.get('store').peekAll('sistema');
        let sistema;
        sistemas.forEach(function (s) {
          if (s.get('idx') == 1) {
            sistema = s;
          }
        });
        let pessoa = this.get('pessoa');
        let that = this;
        pessoa.autoRegister({
          login: login,
          password: password,
          instituicaoId: this.get('escola').get('id'),
          sistemaId: sistema.get('id'),
          role: this.get('model').get('typeCadastro'),
          shouldReviewProfile: true,
          name: login,
          codigoCadastro: this.get("model").get('codigo')
        }).catch(function (error) {
          // Se existe um erro qualificado
          if (error.errors) {

            button.innerHTML = 'Avançar';
            // Pega alerta
            const errorCompartiment = document.getElementById('codigo-error');
            // Pega animação do alerta
            const alertAnimation = errorCompartiment.dataset.animation;
            // Pega container da mensagem a ser escrita
            const msg = errorCompartiment.querySelector('[class*="__msg"]');
            // Pega a identificação do erro
            const errorStatus = error.errors[0].status;

            // Define mensagem de erro, caso seja o erro XYZ
            let errorMsg = "Ops! Tivemos um problema para registrar seu usuário. Tente novamente em instantes."

            // Injeta mensagem de erro.
            msg.innerHTML = '<strong>' + errorMsg + '</strong>';

            // Confere se o elemento já está aparecendo
            if (!errorCompartiment.classList.contains('alert--is-show')) {
              // Adiciona duas classes: uma para o alerta aparecer e outra com a animação definida no html, por meio de data-SBRUBLES
              errorCompartiment.classList.add('alert--is-show', alertAnimation);
            }


          } else {
            that.get('session').authenticate('authenticator:authold', login, password, 1).then(() => {}).catch((reason) => {});
          }
        })

      };
    },

    preventPaste() {

      let optFor = document.getElementById('email-choice');

      if (optFor.checked) {

        var regex = new RegExp("^[a-zA-Z0-9@.-_]+$");
        var input = document.getElementById('emailUser')
        let errorMsg = 'Espaço e caracteres especiais não são permitidos';
        if (!regex.test(input.value) && input.value.length > 0) {
          input.value = '';
          let inputContainer = document.getElementById('emailUser').closest('.form-group__input-container');
          inputContainer.classList.remove('form-group__input-container--is-validated');
          // Pega alerta
          const errorCompartiment = document.getElementById('login-error');
          // Pega animação do alerta
          const alertAnimation = errorCompartiment.dataset.animation;
          // Pega container da mensagem a ser escrita
          const msg = errorCompartiment.querySelector('[class*="__msg"]');
          // Injeta mensagem de erro.
          msg.innerHTML = '<strong>' + errorMsg + '</strong>';
          // Confere se o elemento já está aparecendo
          if (!errorCompartiment.classList.contains('alert--is-show')) {
            // Adiciona duas classes: uma para o alerta aparecer e outra com a animação definida no html, por meio de data-SBRUBLES
            errorCompartiment.classList.add('alert--is-show', alertAnimation);
          }

        } else {
          this.send('verifyEmail');
        }
      }

    },


    toggleCheckbox() {

      let target = event.target;
      let closestInput = target.parentNode.nextElementSibling.firstChild.nextElementSibling
      let identCheckboxes = document.querySelectorAll('.j-validate-ident');
      let uncheckeds = 0;
      let fieldsetError = document.getElementById('error-fieldset-ident');
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


    }

  },

});
