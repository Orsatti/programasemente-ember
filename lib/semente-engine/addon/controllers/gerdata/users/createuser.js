import Controller from '@ember/controller';
import PessoaValidations from "../../../validations/pessoa";
import Ember from 'ember';

export default Controller.extend({
  store: Ember.inject.service(),
  PessoaValidations,
  isEdit: false,

  segmentos:Ember.computed('model',function(){
    return this.get('model.segmentos');
  }),

  actions: {
    save: function(changeset){
      $("#form-user-error").html('');
      $("#role-error").html('');
      $("#cpf-error").html('');
      $("#email-error").html('');
      $("#phone-error").html('');
      $("#gender-error").html('');
      $("#aluno-ano-error").html('');
      $("#aluno-turma-error").html('');
      $("#nascimento-error").html('');
      changeset.validate().then(() => {
          if (changeset.get("isValid")) {
            var existingIUser = this.get('store').peekAll('pessoa').find((x) => { return x.get('email') === changeset.get('email')});
            if (existingIUser) return $("#form-user-error").html('Login já existe'); 

            if ((changeset.get('emailCadastrado') == null || changeset.get('emailCadastrado') == "") && 
                (changeset.get('telefone') == null || changeset.get('telefone') == "")) {
                  $("#phone-error").html('Email ou Telefone devem ser preenchidos');
                  $("#email-error").html('Email ou Telefone devem ser preenchidos'); 
              return;
            }

            changeset.set('enabled', document.getElementById('new_user_enabled').checked);
            changeset.set('instituicao', this.get('model.instituicao'));
            if(this.get('model.instituicao').get('sEnabled')){
              changeset.set('acessoPlataformaS', document.getElementById('new_user_acessoPlataformaS').checked);
            }
            if(this.get('model.instituicao').get('csEnabled')){
              changeset.set('acessoCs', document.getElementById('new_user_acessoCs').checked);
            }

            if(document.getElementById('new_user_role').value == "") return $("#role-error").html('Selecione um perfil'); 
            changeset.set('role', document.getElementById('new_user_role').value);

            if(document.getElementById('new_user_gender').value == "") return $("#gender-error").html('Selecione um genero'); 
            changeset.set('genero', document.getElementById('new_user_gender').value);

            if(changeset.get('role') != 'aluno' && changeset.get('role') != 'instrutor'){
              if(changeset.get('telefone') == null || changeset.get('telefone') == "") return $("#phone-error").html('Obrigatório');
            }

            if(changeset.get('role') != 'aluno'){
              if(document.getElementById('new_user_birth').value == "") return $("#nascimento-error").html('Obrigatório');
              else changeset.set('nascimentoPlataforma', document.getElementById('new_user_birth').value);
            }

            if(changeset.get('role') == 'aluno'){
              if(document.getElementById('new_user_ano').value == "") return $("#aluno-ano-error").html('Selecione um ano'); 
              let platAno = this.get('store').peekRecord('plataforma-ano', document.getElementById('new_user_ano').value);
              changeset.get('plataformaAnos').pushObject(platAno);
              
              if(document.getElementById('new_user_turma').value == "") return $("#aluno-turma-error").html('Selecione uma turma'); 
              let platTurma = this.get('store').peekRecord('plataforma-turma', document.getElementById('new_user_turma').value);
              changeset.get('plataformaTurmas').pushObject(platTurma);

              if(document.getElementById('new_user_birth').value == ""){
                if(platAno.get('segmento').get('titulo') == "EJA") return $("#nascimento-error").html('Obrigatório para alunos EJA'); 
                if(platAno.get('segmento').get('titulo') == "Adultos") return $("#nascimento-error").html('Obrigatório para adultos'); 
              }
              else changeset.set('nascimentoPlataforma', document.getElementById('new_user_birth').value);
            }

            if(changeset.get('role') == 'instrutor'){
              changeset.set('isAplicador', document.getElementById('new_user_aplicador').checked);
              if(!changeset.get('isAplicador')){
                changeset.get('plataformaAnos').forEach(pa => {
                  changeset.get('plataformaAnos').removeObject(pa);
                });
                changeset.get('plataformaTurmas').forEach(pt => {
                  changeset.get('plataformaTurmas').removeObject(pt);
                });
              } 
              else{
                if (changeset.get('emailCadastrado') == null || changeset.get('emailCadastrado') == ""){
                  return $("#email-error").html('Email obrigatório para professores aplicadores');
                }
                if (changeset.get('telefone') == null || changeset.get('telefone') == "") {
                  return $("#phone-error").html('Telefone obrigatório para professores aplicadores');
                }
              }
            }

            if(changeset.get('cpf') != null && changeset.get('cpf') != ""){
              let Soma = 0;
              let Resto = 0;
              let strCPF = changeset.get('cpf');
              strCPF = strCPF.replace(".", "");
              strCPF = strCPF.replace(".", "");
              strCPF = strCPF.replace("-", "");
              strCPF = strCPF.trim();

              if (strCPF == "00000000000") return $("#cpf-error").html('CPF inválido');

              for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
              Resto = (Soma * 10) % 11;

              if ((Resto == 10) || (Resto == 11)) Resto = 0;
              if (Resto !== parseInt(strCPF.substring(9, 10))) return $("#cpf-error").html('CPF inválido');

              Soma = 0;
              for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
              Resto = (Soma * 10) % 11;

              if ((Resto == 10) || (Resto == 11)) Resto = 0;
              if (Resto !== parseInt(strCPF.substring(10, 11))) return $("#cpf-error").html('CPF inválido');
            }

            changeset.set('mustSendWelcomeEmail', true);
            changeset.set('comprouAp', false);

            let that = this;
            document.getElementById('btnSubmit').innerText ="Salvando...";
            document.getElementById('btnSubmit').disabled = true;
            changeset.save().then(function () {
              document.getElementById('btnSubmit').disabled = false;
              document.getElementById('btnSubmit').innerText ="Informações Salvas!";
              that.transitionToRoute('gerdata.users',  that.get('model.instituicao').get('id'))
            }).catch((reason) => {
              document.getElementById('btnSubmit').disabled = false;
              document.getElementById('btnSubmit').innerText ="Adicionar";
              if (reason.errors) {
                reason.errors.forEach((error) => {
                  if (error.status === "500") return $("#form-user-error").html('Entre em contato com os desenvolvedores.'); 
                  else return $("#form-user-error").html(error.title); 
                });
              }
              else return $("#form-user-error").html(reason.message);
            });
          }
      })
    }
  }
})