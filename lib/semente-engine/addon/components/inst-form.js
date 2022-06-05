import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    didInsertElement() {
        $(".numeric").mask("#0", { reverse: true})
    },
    actions: {
        submit: function () {
            $("#create-inst-error").html('');
            this.changeset.validate().then(() => {
                if (this.changeset.get("isValid")) {
                    // Instituição ja existe    
                    var existingInst = this.get('store').peekAll('instituicao').find((x) => { return x.get('name') === this.changeset.get('name')});
                    if (existingInst) {
                        $("#create-inst-error").html('Instituição já existe'); 
                        return;
                    }    

                    // Sistemas
                    var sis = this.get('store').peekAll('sistema');
                    var plataforma = sis.find((x) => { return x.get('idx') === 1 });
                    this.changeset.get('sistemas').pushObject(plataforma);
                    if (this.changeset.get('sEnabled')) {
                        var s = sis.find((x) => { return x.get('idx') === 2 });
                        this.changeset.get('sistemas').pushObject(s);
                    }

                    // Get Plataforma Anos
                    var pas = this.get('store').peekAll('plataforma-ano');
                    $(".segmento").each((i, x) => {
                        if (x.checked === true) {
                            var segmentoid = $(x).attr('id').split("_")[1];
                            var pa = pas.filter((y) => {
                                return y.get('segmento.id') === segmentoid
                            });
                            this.changeset.get('plataformaAnos').pushObjects(pa);
                        }
                    })

                    let that = this;
                    this.changeset.save().then(function (instituicao) {
                        that.action(instituicao);
                    });
                }
            })
        },
    }
})