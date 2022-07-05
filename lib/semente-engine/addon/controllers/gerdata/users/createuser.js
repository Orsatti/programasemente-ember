import Controller from '@ember/controller';
import PessoaValidations from "../../../validations/pessoa";
import Ember from 'ember';

export default Controller.extend({
  store: Ember.inject.service(),
  PessoaValidations,
  segmentos:Ember.computed('model',function(){
    return this.get('model.segmentos');
  }),

  actions: {
    save: function(changeset){
      $("#form-user-error").html('');
      $("#role-error").html('');
      $("#gender-error").html('');
      $("#aluno-ano-error").html('');
      $("#aluno-turma-error").html('');
      $("#nascimento-error").html('');
      changeset.validate().then(() => {
          if (changeset.get("isValid")) {
            var existingIUser = this.get('store').peekAll('pessoa').find((x) => { return x.get('email') === changeset.get('email')});
            if (existingIUser) {
                $("#form-user-error").html('Login já existe'); 
                return;
            }

            if ((changeset.get('emailCadastrado') == null || changeset.get('emailCadastrado') == "") && 
                (changeset.get('telefone') == null || changeset.get('telefone') == "")) {
              $("#form-user-error").html('Email ou Telefone devem ser preenchidos'); 
              return;
            }

            changeset.set('enabled', document.getElementById('new_user_enabled').checked);
            changeset.set('instituicao', this.get('model.instituicao'));
            changeset.set('acessoPlataformaS', document.getElementById('new_user_acessoPlataformaS').checked);

            if(document.getElementById('new_user_role').value == ""){
              $("#role-error").html('Selecione um perfil'); 
              return;
            }
            changeset.set('role', document.getElementById('new_user_role').value);

            if(document.getElementById('new_user_gender').value == ""){
              $("#gender-error").html('Selecione um genero'); 
              return;
            }
            changeset.set('genero', document.getElementById('new_user_gender').value);

            if(changeset.get('role') == 'aluno'){
              if(document.getElementById('new_user_birth').value == ""){
                $("#nascimento-error").html('Obrigatório'); 
                return;
              }
              changeset.set('nascimentoPlataforma', document.getElementById('new_user_birth').value);

              if(document.getElementById('new_user_ano').value == ""){
                $("#aluno-ano-error").html('Selecione um ano'); 
                return;
              }
              let platAno = this.get('store').peekRecord('plataforma-ano', document.getElementById('new_user_ano').value);
              changeset.get('plataformaAnos').pushObject(platAno);

              if(document.getElementById('new_user_turma').value == ""){
                $("#aluno-turma-error").html('Selecione uma turma'); 
                return;
              }
              let platTurma = this.get('store').peekRecord('plataforma-turma', document.getElementById('new_user_turma').value);
              changeset.get('plataformaTurmas').pushObject(platTurma);
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
            }

            let that = this;
            changeset.save().then(function () {
              that.transitionToRoute('gerdata.users',  that.get('model.instituicao').get('id'))
            });
          }
      })
    }
  }
})