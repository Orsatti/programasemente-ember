import Controller from '@ember/controller';
import Ember from 'ember';
import InstValidations from "../../validations/instituicao";

export default Controller.extend({
   store: Ember.inject.service(),
   InstValidations,
   pessoaLogged: Ember.computed('model',function(){
      let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
      return this.get('store').peekRecord('pessoa',infosLogged.id);
    }),
   actions: {
      save: function(changeset) {
         $("#form-inst-error").html('');
         changeset.validate().then(() => {
            if (changeset.get("isValid")) {

               changeset.set('isEscola', $(".isEscola")[0].checked);
               changeset.set('vendaDireta', $(".vendaDireta")[0].checked);
               changeset.set('statusTermoAceite', $(".statusTermoAceite")[0].checked);

               changeset.set('enabled', $(".enabled")[0].checked);
               changeset.set('sEnabled', $(".sEnabled")[0].checked);
               changeset.set('sPlusEnabled', $(".sPlusEnabled")[0].checked);
               changeset.set('essencialEnabled', $(".essencialEnabled")[0].checked);
               changeset.set('csEnabled', $(".csEnabled")[0].checked);

               // Sistemas
               var sis = this.get('store').peekAll('sistema');
               var plataforma = sis.find((x) => { return x.get('idx') === 1 });
               var s = sis.find((x) => { return x.get('idx') === 2 });
               var cs = sis.find((x) => { return x.get('idx') === 3 });
               changeset.get('sistemas').pushObject(plataforma);
               if (changeset.get('sEnabled')) changeset.get('sistemas').pushObject(s);
               else changeset.get('sistemas').removeObject(s);
               if (changeset.get('csEnabled')) changeset.get('sistemas').pushObject(cs);
               else changeset.get('sistemas').removeObject(cs);
               
               let that = this;
               document.getElementById('btnSubmit').innerText ="Salvando...";
               document.getElementById('btnSubmit').disabled = true;
               changeset.save().then(function (){
                  document.getElementById('btnSubmit').disabled = false;
                  document.getElementById('btnSubmit').innerText = (changeset.get('id')) ? "Salvar" : "Adicionar";
               });
             }
         })
      }
   }
})