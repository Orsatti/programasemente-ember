import Controller from '@ember/controller';
import PessoaValidations from "../../../validations/pessoa";
import Ember from 'ember';

export default Controller.extend({
    PessoaValidations,
    segmentos:Ember.computed('model',function(){
      return this.get('model.segmentos');
    }),

    selectedPlataformaAno: '',
    plataformaAnos:Ember.computed('model',function(){
      return this.get('model.instituicao').get('plataformaAnos');
    }),

    plataformaTurmas:Ember.computed('model',function(){
        return this.get('model.instituicao').get('plataformaTurmas');
    }),

    sEnabled: Ember.computed('model.instituicao', function () {
      var s = this.get('model.instituicao').get('sistemas').find((x) => { return x.get('idx') === 2 });
      if (s) {
          this.get('model.instituicao').set('sEnabled', true);
      }
      return this.get('model.instituicao').get('sEnabled');
    }),

    isAluno(value) {
      this.set('perfil', value);
      this.set('activeProfile', value);
    },

    startInformation: Ember.computed('model.instituicao', function () {
      this.set('activeProfile', '');
      this.set('user_modulos', '');
      this.set('new_user_inst', '');
      this.set('new_user_id', '');
      this.set('new_user_name', '');
      this.set('new_user_role', '');
      this.set('new_user_email', '');
      this.set('new_user_phone', '');
      this.set('new_user_senha', '');
      this.set('new_user_cpf', '');
      this.set('new_user_login', '');
      this.set('new_user_enabled', true);
      if(this.get('model.instituicao').get('sEnabled')) this.set('new_user_acessoPlataformaS', true);
      this.set('new_user_aplicador', false);
      this.set('isAplicador', false);
      this.set('new_user_gender', '');
      this.set('new_user_birth', '');
      this.set('new_user_ano', '');
      this.set('new_user_turma', '');
      this.set('pessoa_selected_edit', '');
      this.set('perfil', '');
      this.set('new_user_login', '');
    }),

    actions: {
      replacePhone() {
        let target = event.target;
        let phone = target.value;
        phone = phone.replace(/\D/g, "")
        phone = phone.replace(/(\d{2})(\d)/, "($1) $2")
        phone = phone.replace(/(\d{5})(\d{4})/, "$1-$2")
        this.set('new_user_phone', phone);
      },
  
      replaceCPF() {
        let target = event.target;
        let cpf = target.value;
  
        var regex = /^[0-9.\t]$/;
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        var code = event.which ? event.which : event.keyCode;
  
        if (!regex.test(key) && code !== 37 && code !== 39 && code !== 8 && code !== 9 && code !== 116) {
  
          this.set('errorMsgCPF', 'Apenas números são permitidos');
          this.set('cpfError', true);
          event.preventDefault();
          return false;
        }
  
        cpf = cpf.replace(/\D/g, "")
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        this.set('new_user_cpf', cpf);
      },
  
      checkaplicador(v) {
        this.set('isAplicador', v.currentTarget.checked);
        this.set('new_user_aplicador', v.currentTarget.checked);
      },
  
      refreshPlataformaTurmas(plataformaAnoId) {
        if (plataformaAnoId != "0") {
            let plataformaAnos = this.get('plataformaAnos');
            plataformaAnos.forEach(pa => {
              if(pa.get('id') == plataformaAnoId) this.set('selectedPlataformaAno', pa);
            });
        } else {
          this.set('selectedPlataformaAno', "");
        }
      },
    }
})