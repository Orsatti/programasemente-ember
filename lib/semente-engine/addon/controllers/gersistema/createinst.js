import Controller from '@ember/controller';
import InstValidations from "../../validations/instituicao";

export default Controller.extend({
   InstValidations,
   actions: {
      save: function(instituicao) {
         debugger;
         this.transitionToRoute('gersistema')
      }
   }
})