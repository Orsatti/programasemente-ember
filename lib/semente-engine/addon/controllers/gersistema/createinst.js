import Controller from '@ember/controller';
import InstValidations from "../../validations/instituicao";
import Ember from 'ember';

export default Controller.extend({
   InstValidations,
   store: Ember.inject.service(),
   actions: {
      save: function(changeset) {
         $("#form-inst-error").html('');
         changeset.validate().then(() => {
             if (changeset.get("isValid")) {
                // Instituição ja existe    
                var existingInst = this.get('store').peekAll('instituicao').find((x) => { return x.get('name') === changeset.get('name')});
                if (existingInst) {
                    $("#formp-inst-error").html('Instituição já existe'); 
                    return;
                }
                 
                changeset.set('enabled', $(".enabled")[0].checked);
                changeset.set('isEscola', $(".isEscola")[0].checked);
                changeset.set('statusTermoAceite', $(".statusTermoAceite")[0].checked);
                changeset.set('sEnabled', $(".sEnabled")[0].checked);
                changeset.set('sPlusEnabled', $(".sPlusEnabled")[0].checked);

                // Sistemas
                var sis = this.get('store').peekAll('sistema');
                var plataforma = sis.find((x) => { return x.get('idx') === 1 });
                changeset.get('sistemas').pushObject(plataforma);
                if (changeset.get('sEnabled')) {
                    var s = sis.find((x) => { return x.get('idx') === 2 });
                    changeset.get('sistemas').pushObject(s);
                }

                // Get Plataforma Anos
                var pas = this.get('store').peekAll('plataforma-ano');
                $(".segmento").each((i, x) => {
                    if (x.checked === true) {
                        var segmentoid = $(x).attr('id').split("_")[1];
                        var pa = pas.filter((y) => {
                            return y.get('segmento.id') === segmentoid
                        });
                        changeset.get('plataformaAnos').pushObjects(pa);
                    }
                })

                //  changeset.save().then(function (instituicao) {
                //      this.transitionToRoute('gerdata', instituicao)
                //  });
             }
         })
      }
   }
})