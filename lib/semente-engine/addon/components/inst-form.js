import Ember from 'ember';

export default Ember.Component.extend({
    router: Ember.inject.service('-routing'),
    store: Ember.inject.service(),
    actions: {
        submit: function () {
            this.changeset.validate().then(() => {
                if (this.changeset.get("isValid")) {
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
                        debugger
                        that.action(instituicao);
                    });
                }
            })
        },
    }
})