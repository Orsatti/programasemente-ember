import Controller from '@ember/controller';
import Ember from 'ember';
import InstValidations from "../../validations/instituicao";

export default Controller.extend({
   store: Ember.inject.service(),
   InstValidations,
   role: Ember.computed('model',function(){
      let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
      return this.get('store').peekRecord('pessoa',infosLogged.id).get('role');
    }),
   actions: {
      save: function(changeset) {
         $("#form-inst-error").html('');
         changeset.validate().then(() => {
            if (changeset.get("isValid")) {
                 // Sistemas
                 var sis = this.get('store').peekAll('sistema');
                 var plataforma = sis.find((x) => { return x.get('idx') === 1 });
                 changeset.get('sistemas').pushObject(plataforma);
                 if (changeset.get('sEnabled')) {
                     var s = sis.find((x) => { return x.get('idx') === 2 });
                     changeset.get('sistemas').pushObject(s);
                 }

                 changeset.save();
             }
         })
      }
   }
})