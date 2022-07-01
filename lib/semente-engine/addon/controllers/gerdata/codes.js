import Controller from '@ember/controller';
import Ember from 'ember';
import InstValidations from "../../validations/instituicao";
import ENV from '../../config/environment';

export default Controller.extend({
   envnmt: ENV.APP,
   store: Ember.inject.service(),
   InstValidations,
   role: Ember.computed('model',function(){
      let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
      return this.get('store').peekRecord('pessoa',infosLogged.id).get('role');
   }),
   totalCodigosAlunos: 0,
   totalUtilizadosAlunos: 0,
   totalCodigosInstrutores: 0,
   totalUtilizadosInstrutores: 0,
   codigos: Ember.computed('model',function(){
      let codigos = this.get('model.instituicao').get('codigosCadastro');
      let tca = 0;
      let tua = 0;
      let tci = 0;
      let tui = 0;
      codigos.forEach(cod => {
         if(cod.get('typeCadastro') == "aluno"){
            tca = tca + 1;
            if(cod.get('utilizado')){
               tua = tua + 1;
            }
         }
         if(cod.get('typeCadastro') == "instrutor"){
            tci = tci + 1;
            if(cod.get('utilizado')){
               tui = tui + 1;
            }
         }
      });
      this.set('totalCodigosAlunos', tca);
      this.set('totalUtilizadosAlunos', tua);
      this.set('totalCodigosInstrutores', tci);
      this.set('totalUtilizadosInstrutores', tui);
      return codigos;
   }),
   actions: {
      downloadCodigos() {
         let inistituicao = this.get('model.instituicao');
         let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
         window.location.href = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/instituicoes/downloadCodigos?pessoaId=' + infosLogged.id + '&instituicaoId=' + inistituicao.get('id');
       },
   }
})