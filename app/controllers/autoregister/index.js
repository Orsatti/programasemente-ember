import Controller from '@ember/controller';
import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  transitionToForm: function(e) { this.transitionToRoute('autoregister.form', e.get('id')); },

  preventDefault: Ember.run.later(function(){
    document.getElementById("inicia-cadastro").addEventListener("click", function(event){
      event.preventDefault()
    });
  }),

  actions: {
    checkForm: function() {
      $('form').removeData('validator');
      $('form').removeData('unobtrusiveValidation');
      $.validator.unobtrusive.parse('form');
      let that = this;
      let schoolCode = document.getElementById('codigo-escola').value;
      let input = document.getElementById('codigo-escola');
      let button =  document.getElementById('inicia-cadastro');
      button.innerHTML = 'Aguarde...';
      let codigo = this.get('store').queryRecord('codigo-cadastro', {
        include: 'instituicao.plataforma-anos, instituicao.plataforma-turmas',
        codigo: schoolCode
      }).then(function(e){
        // that.transitionToForm(e);
        that.transitionToRoute('autoregister.form', e.get('id'));
      }).catch(function(error) {
        if (error.errors) {
           
          button.innerHTML = 'Iniciar cadastro';
          // Pega alerta
          const errorCompartiment = document.getElementById('codigo-error');
          // Pega animação do alerta
          const alertAnimation = errorCompartiment.dataset.animation;
          // Pega container da mensagem a ser escrita
          const msg = errorCompartiment.querySelector('[class*="__msg"]');
          // Pega a identificação do erro
          const errorStatus =  error.errors[0].status;
          
          // Foco no input
          if (input) {
            input.focus();
          }

          // Define mensagem de erro, caso seja o erro XYZ
          let errorMsg; 
          if ( errorStatus === "400") {
            switch(true) {
              case schoolCode.length == 0:
                errorMsg = 'Por favor, insira o código fornecido pela escola.';
                break;
              case schoolCode.length > 0:
                errorMsg = 'Parece que o código informado é inválido, verifique por favor.'
                break;
                
            }
          } else if (errorStatus === "500") {
            errorMsg = 'Ocorreu um erro no sistema, mas não se preocupe, nossos desenvolvedores já foram alertados.'
          }
                
                   

          // Injeta mensagem de erro.
          msg.innerHTML = '<strong>' + errorMsg + '</strong>';

          // Confere se o elemento já está aparecendo
          if(!errorCompartiment.classList.contains('alert--is-show')) {
            // Adiciona duas classes: uma para o alerta aparecer e outra com a animação definida no html, por meio de data-SBRUBLES
            errorCompartiment.classList.add('alert--is-show', alertAnimation);
          }

        }

      })
    },

    /**
     * Captura o uso do enter em um input
     * @param  {Element} elemento que foi usado para acionar a função
     */
    checkFormEnter: function(e) {
      if (e.key === 'Enter') {
        // Evita do form ser enviado
        e.preventDefault();
        // Chama outro método dentro de "actions"
        this.send(e.target.dataset.function);
      }
    }

  }
});